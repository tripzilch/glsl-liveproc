#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;
uniform vec2 texOffset; // vec2(1/width,1/height)
uniform vec2 C;
uniform vec2 P;
uniform float min_iter;
uniform vec2 M;
uniform float count;
uniform float zoom;
uniform float tex_zoom;
uniform float tex_angle;
uniform float alpha;
uniform float jitter_amount;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const float MAXITER = 350.;
const float BAILOUT2 = 256.0;
const float TAU = 6.283185307179586;
const float PHI = 1.618033988749895;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);
const float tx = 10.5 / 768.;

float rand(vec2 co) {
    const float a = 12.9898;
    const float b = 78.233;
    const float c = 43758.5453;
    float dt= dot(co.xy, vec2(a, b));
    float sn= mod(dt, 3.14);
    return fract(sin(sn) * c) - 0.5;
}
float randfc(float k) { return rand(gl_FragCoord.xy + k * 48.3); }

vec2 randfc2(float k) { return vec2(rand(gl_FragCoord.xy + k * 29.9),
                                    rand(gl_FragCoord.xy + k * 127.6)); }

vec3 randfc3(float k) { return vec3(rand(gl_FragCoord.xy + k * 89.2),
                                    rand(gl_FragCoord.xy + k * 55.1),
                                    rand(gl_FragCoord.xy + k * 34.0)); }

vec3 tex(vec2 p, float i) {
    //float a = i * (TAU / PHI / PHI);
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    //r += texOffset * vec2(rand(gl_FragCoord.xy + i * 7.0), rand(gl_FragCoord.xy + 2323.0 + i * 13.0)) * 2.0;
    return pow(texture2D(texture, r).xyz, igamma);
}

vec3 trap(vec2 Z, float i) {
    vec2 X = (Z - vec2(P)) * .5 * tex_zoom;
    return vec3(X, length(X));
}

vec3 tex_circular(vec3 T, float i) {
    //return mix(tex(T.xy, i), vec3(0.0), smoothstep(.49, .5, T.z));
    return mix(tex(T.xy, i), vec3(1.0), smoothstep(.4963, .5, T.z));
}

void main (void) {
    vec2 Z = M + zoom * (vertTexCoord.st + jitter_amount * randfc2(count));
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    float dZmag2 = Z2.x + Z2.y;
    vec2 dZ = vec2(1.0, 0);

    // orbit trap vars
    float i = 0.0;
    vec3 color = (i >= min_iter) ? tex_circular(trap(Z, i), i) : vec3(1.0);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // iterate Z
            vec2 Zprev = Z;
            // dZ = d = 2 * d * Z = 2 * (d.x + i*d.y) * (Z.x + i*Z.y) =
            //    = 2 * (drZr + i*drZi + i*diZr - diZi) =
            //    = 2 * (d.x * Z.x - d.y * Z.y) + 2i * (d.x * Z.y + d.y * Z.x)
            //    = 2 * vec2

            // A*B = A.x * B.x - A.y * B.y , A.x * B.y + A.y * B.x
            //     = A.x * B + A.y * vec2(-1, 1) * B.yx
            dZmag2 *= 4. * Zmag2;
            dZ *= 2.0 * Z;

            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            // calc squared magnitudes
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            if (i >= min_iter) {// orbit trap
                vec2 X = (Z - vec2(P)) * .5 * tex_zoom;
                //vec3 c = tex_circular(trap(Z, i), i);
                vec3 c = mix(tex(X, i), vec3(1.0), smoothstep(.4963, .5, length(X)));
                float dZmag = length(dZ);
                //if (dZmag2 > pow(texOffset.x, 2.)) c.rb = vec2(1);
                c.r = dZmag * tex_zoom;
                c.b = dZmag * .125 * tex_zoom;
                //c = tex(X, i);
                color *= c; //pow(c, vec3(0.75));
            }
        }
    }
    // inside black
    color *= step(BAILOUT2, Zmag2);
    // dither, gamma, output
    color += randfc3(count) * (2.0 / 256.0);
    gl_FragColor = vec4(pow(color, gamma), alpha);
}
