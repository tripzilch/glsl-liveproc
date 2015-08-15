#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 C;
uniform vec2 P;
uniform vec2 M;
//uniform float pixsize;
uniform float zoom;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const float MAXITER = 400.;
const float BAILOUT2 = 4096.0;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);
const float tx = 10.5 / 768.;

/*float rand(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}*/

vec3 tex(vec2 p) {
    return pow(texture2D(texture, .5 + p).xyz, igamma);
}

const float trap_r = .75;
vec3 trap(vec2 Z, float i) {
    vec2 X = (Z - vec2(P)) * trap_r;
    return vec3(length(X), X);
}

vec3 traptex(vec3 T, float i) {
    return tex(normalize(T.yz) * min(.8, T.x * pow(1.0 + i, 0.1)));
    //mix(tex(normalize(T.yz) * T.x), vec3(0), smoothstep(0.9, 1.0, T.x));
}

void main (void) {
    //vec2 eps = vec2(pixsize * 0.5, 0.);
    vec3 color;
    float wsum = 0.0, w;

    //vec2 noise2 = vec2(rand(gl_FragCoord.xy), rand(gl_FragCoord.yx + 1111.)) * 2.0 - 1.0;
    vec2 Z = zoom * vertTexCoord.st + M;
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    vec2 Zprev;

    // orbit trap vars
    float i = 0.0;
    vec3 min_T = trap(Z, i);
//    color = mix(tex(normalize(min_T.yz) * min_T.x), vec3(0), smoothstep(0.9, 1.0, min_T.x));
    color = traptex(min_T, i);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // iterate Z
            Zprev = Z;
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            // calc squared magnitudes
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            // orbit trap
            vec3 T = trap(Z, i);
            vec3 s = traptex(T, i);

            color = mix(s, color, smoothstep(min_T.x, min_T.x * 3.0, T.x));
            min_T = (T.x < min_T.x) ? T : min_T;
            //w = exp(-32.0 * d) + 1.0E-10;
            //wsum += w;
            //tZ += w * Z;
            //td += w * d;
            //color += w * tex(Z - P);
        }
    }
    //vec3 cf = 22.0 * vec3(.8,.9,1.0);
    //color = .5 + .5 * cos(td * exp(-td) * cf);
    //color /= wsum > 0.0 ? wsum : 1.0;
    // if (td < 1.0) {
    //     color = tex(0.4 * normalize(tZ) * td);
    // }
    color *= step(BAILOUT2, Zmag2);
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
