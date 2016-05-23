#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;
uniform vec2 pix_size; // vec2(1/width,1/height)
uniform vec2 C;
uniform vec2 P;
uniform float min_iter;
uniform vec2 M;
uniform float count;
uniform uint ucount;
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
const vec2 negx = vec2(-1.0, 1.0);

vec2 pixp = gl_FragCoord.xy;
vec2 pixf = vertTexCoord.xy;

const uint KNUTH = 2654435761u; // prime close to 2**32/PHI = 2654435769
uvec2 AB = floatBitsToUint(pixf.xy) * KNUTH;
//uint B = floatBitsToUint(gl_FragCoord.y) * KNUTH;
uint hash_state = KNUTH * (KNUTH * (uint(count) ^ AB.x) ^ AB.y);

void hash(uint x) {
    hash_state ^= x;
    hash_state *= KNUTH;
}
float hashf(uint x) {
    hash_state ^= x; // ^ (hash_state >> 16);
    hash_state *= KNUTH;
    return float(hash_state);
}
vec2 rand2(uint k) {
    return vec2(hashf(k), hashf(k + 123u)) / 4294967295.0 - 0.5;
}

// float rand(vec2 co) {
//     return fract(sin(mod(dot(co, vec2(12.9898, 78.233)), 3.14)) * 85160.73) - 0.5;
// }
// float randfc(float k) { return randx(pixp + k * 48.3); }
// vec2 randfc2(float k) { return vec2(randx(pixp + k * 29.9),
//                                     randx(pixp + k * 127.6)); }
// vec3 randfc3(float k) { return vec3(randx(pixp + k * 89.2),
//                                     randx(pixp + k * 55.1),
//                                     randx(pixp + k * 34.0)); }

vec3 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    return pow(texture2D(texture, r).xyz, igamma);
}

float circles(vec2 Z, float vv) {
    vec2 X = (Z - vec2(P)) * .5 * tex_zoom;
    float L = length(X);
    float c = step(vv, mod(min(L, .5 - vv), vv * 2.0)); // concentric circles
    return c;
}

float trap(vec2 Z, vec2 dZ) {
    vec2 X = (Z - vec2(P)) * tex_zoom * 0.5;
    float L = length(X);
    float dL = length(dZ);
    float c = mix(tex(X).r,1.0,step(.47,L)) - 0.5;
    c = clamp(c * max(1.0, 2.0 / dL), -0.5, 0.5) + 0.5; //max(2.0, 10.0 / dL));
    return c;
}

void main (void) {
    vec2 RND = rand2(25u);
    //vec3 color = vec3(RND.xy + 0.5, 0.0);
    //color.b = step(gl_FragCoord.x,10.0)*step(gl_FragCoord.y,10.0);
    //gl_FragColor = vec4(color, alpha);
    //return;
    vec2 Z = M + zoom * (1.5 * jitter_amount * RND + pixf);
    //Z.yx = Z.xy;

    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    vec2 dZ = vec2(1.0, 0);

    const float rstripes = 0.151;
    float i = 0.0;
    float color = (i >= min_iter) ? trap(Z,dZ) : 1.0;
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            if (i >= min_iter) {
                color *= trap(Z, dZ);
            }
        } else { i = MAXITER; }
    }
    //color /= MAXITER;
    // inside black
    color *= step(BAILOUT2, Zmag2);
    // gamma, output
    // gl_FragColor = vec4(vec3(pow(grey, gamma.r)), alpha);
    gl_FragColor = vec4(vec3(pow(color, gamma.r)), alpha);
}
