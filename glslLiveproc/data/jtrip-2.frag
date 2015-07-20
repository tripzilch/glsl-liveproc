#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 C;
uniform float pixsize;
uniform float wheel;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 gamma = vec3(0.45);
const vec3 igamma = 1.0 / gamma;
const float MAXITER = 160.;
const float BAILOUT2 = 4096.0;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);

vec3 color;
vec2 Z, eps, Z2, sp;
float Zmag2, i, w, zms, wsum, ri, lZmag2;

void main (void) {
    Z = vertTexCoord.st;
    eps = vec2(pixsize * 0.5, 0.);

    Z2 = Z * Z;
    Zmag2 = Z2.x + Z2.y;
    color = vec3(0.0);
    wsum = 0.0;
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // iterate Z
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            // calc squared magnitudes
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            lZmag2 = log2(Zmag2);
            //ri = max(0.0, i - log2(0.5 * lZmag2));
            // accumulate colour
            // zms = smoothstep(-12.0, 0.0, -lZmag2);
            w = smoothstep(-12.0, 0.0, -lZmag2) * pow(i, 4.0);
            sp = normalize(Z) * pow(smoothstep(-12.0, 12.0, lZmag2), 1.0) * wheel;
            wsum += w;
            color += w * pow(texture2D(texture, .5 + .5 * sp).xyz, igamma);
        }
    }
    gl_FragColor = vec4(pow(color / wsum, gamma), 1.0);
}
