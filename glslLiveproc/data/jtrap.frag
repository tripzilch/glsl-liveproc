#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;
uniform vec2 texOffset; // vec2(1/width,1/height)
uniform vec2 C;
uniform vec2 P;
uniform vec2 M;
//uniform float pixsize;
uniform float zoom;
uniform float tzoom;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const float MAXITER = 350.;
const float BAILOUT2 = 256.0;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);
const float tx = 10.5 / 768.;

float rand(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec3 tex(vec2 p, float i) {
    vec2 r = .5 + p;
    //r += texOffset * vec2(rand(gl_FragCoord.xy + i * 7.0), rand(gl_FragCoord.xy + 2323.0 + i * 13.0)) * 2.0;
    return pow(texture2D(texture, r).xyz, igamma);
}

vec3 trap(vec2 Z, float i) {
    vec2 X = (Z - vec2(P)) * .5 * tzoom;
    return vec3(X, length(X));
}

vec3 tex_circular(vec3 T, float i) {
    return mix(tex(T.xy, i), vec3(1.0), smoothstep(.4963, .5, T.z));
}

void main (void) {
    vec3 color;
    float wsum = 0.0, w;

    vec2 Z = zoom * vertTexCoord.st + M;
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;

    // orbit trap vars
    float i = 0.0;
    vec3 min_T = trap(Z, i);
//    color = mix(tex(normalize(min_T.yz) * min_T.x), vec3(0), smoothstep(0.9, 1.0, min_T.x));
    color = tex_circular(min_T, i);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // iterate Z
            vec2 Zprev = Z;
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            // calc squared magnitudes
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            // orbit trap
            vec3 T = trap(Z, i);
            vec3 c = tex_circular(T, i);

            //float amount = smoothstep(min_T.x, min_T.x * 1.01, T.x);
            //color = mix(c, color, amount);
            color *= c; //pow(c, vec3(0.75));
            //color = min(color, c);
            //color = max(color, c);
            min_T = (T.z < min_T.z) ? T : min_T;
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
    // color *= smoothstep(BAILOUT2 * .9, BAILOUT2, Zmag2);
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
