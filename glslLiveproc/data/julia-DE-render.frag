#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform vec2 C;
uniform float u_pix_size;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 gamma = vec3(0.45);
const vec3 igamma = 1.0 / gamma;
const float MAXITER = 750.;
const vec4 BAILOUT2 = vec4(4096.0);

void main (void) {
    vec2 Z = vertTexCoord.st;
    vec2 eps = vec2(u_pix_size * 0.5, 0.);

    // distance estimator for 4 pixels at once
    vec4 Zr = Z.xxxx + eps.yxyx,
         Zi = Z.yyyy + eps.yyxx;

    vec4 dZmag2 = vec4(1.0);
    vec4 Zr2 = Zr * Zr, Zi2 = Zi * Zi;
    vec4 Zmag2 = Zr2 + Zi2;
    float i;
    for (i = 1.; i < MAXITER; i++) {
        if (all(lessThan(Zmag2, BAILOUT2))) {
            // iterate dZ
            dZmag2 *= 4. * Zmag2;
            // iterate Z
            Zi = 2.0 * Zr * Zi + C.y;
            Zr = Zr2 - Zi2 + C.x;
            // calc squared magnitudes
            Zr2 = Zr * Zr;
            Zi2 = Zi * Zi;
            Zmag2 = Zr2 + Zi2;
        }
    }

    vec4 dist = sqrt(Zmag2) * log(Zmag2) * inversesqrt(dZmag2);
    vec3 rgb = all(lessThan(Zmag2, BAILOUT2))
                ? vec3(0.)
                : vec3(all(greaterThan(dist, eps.xxxx * 0.707)));

    gl_FragColor = vec4(rgb, 1.); //vec4(pow(rgb, gamma), 1.0);
}
