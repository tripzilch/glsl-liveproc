#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 C;
uniform float u_pix_size;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 gamma = vec3(0.45);
const vec3 igamma = 1.0 / gamma;
const float MAXITER = 50.;
const vec4 BAILOUT2 = vec4(4096.0);
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);

void main (void) {
    vec2 Z = vertTexCoord.st;
    vec2 eps = vec2(u_pix_size * 0.5, 0.);

    // distance estimator for 4 pixels at once
    vec4 Zr = Z.xxxx + eps.yxyx,
         Zi = Z.yyyy + eps.yyxx;

    vec4 dZmag2 = vec4(1.0);
    vec4 Zr2 = Zr * Zr, Zi2 = Zi * Zi;
    vec4 Zmag2 = Zr2 + Zi2;
    vec3 color = vec3(0.0);
    vec2 cp = vec2(0.0);
    float i, weight, wsum = 0.0;
    for (i = 1.; i < MAXITER; i++) {
        if (all(lessThan(Zmag2, BAILOUT2))) {
            weight = pow(1.0 + dot(Zmag2/BAILOUT2,ones), -2.0) * pow(i, 0.5);
            // iterate dZ
            dZmag2 *= 4. * Zmag2;
            // iterate Z
            Zi = 2.0 * Zr * Zi + C.y;
            Zr = Zr2 - Zi2 + C.x;
            // calc squared magnitudes
            Zr2 = Zr * Zr;
            Zi2 = Zi * Zi;
            Zmag2 = Zr2 + Zi2;
            cp = normalize(vec2(Zr.x, Zi.x));
            wsum += weight;
            color += weight * pow(texture2D(texture, .5 + .5 * cp).xyz, igamma);    
        }
    }

    vec4 dist = (all(lessThan(Zmag2, BAILOUT2)))
              ? zeros 
              : sqrt(Zmag2) * log(Zmag2) * inversesqrt(dZmag2);
    color *= dot(ones, smoothstep(eps.xxxx * 1.5, eps.xxxx * 6.0, dist))
             * .25 / wsum;

    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
