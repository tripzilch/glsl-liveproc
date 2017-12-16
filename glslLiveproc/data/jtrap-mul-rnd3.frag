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
uniform float zoom;
uniform float tex_zoom;
uniform float tex_angle;
uniform float alpha;
uniform float jitter_amount;
uniform int N_SAMPLES;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const float MAXITER = 150.;
const float BAILOUT2 = 256.0;
const float TAU = 6.283185307179586;
const float PHI = 1.618033988749895;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);
const float tx = 10.5 / 768.;
const vec2 negx = vec2(-1.0, 1.0);
const float i2e32 = (1.0 / 4294967296.0); // 1 / 2**32
const float i2e31 = (2.0 / 4294967296.0);

vec2 pixp = gl_FragCoord.xy;

// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ----
// Multiplicative hash primes
//
// PHI = .5 + .5 * 5 ** .5 -- aka Golden Ratio, aka the most irrational number
//
// 2**32 / PHI       = 2654435769.4972, nearest prime = 2654435761u = 0x9e3779b1
// 2**32 / PHI / PHI = 1640531526.5028, nearest prime = 1640531513u = 0x61c88639
const uint KNUTH = 0x9e3779b1u;
const uvec4 useed = uvec4(0x55336963u, 0x96AC5A36u, 0x393C6A9Au, 0x33C39A9Cu); // #0
uvec4 hash_state = useed;
uvec4 uhash4(uvec4 k) { return (hash_state ^ k) * KNUTH; }
void init_hash() {
    uvec3 ABC = floatBitsToUint(vec3(vertTexCoord.xy, count)); // per pixel random hash
    hash_state = uhash4(ABC.xxxx);
    hash_state = uhash4(ABC.yyyy);
    hash_state = uhash4(ABC.zzzz);
}
vec4 fhash4(uint k) { return i2e32 * ((hash_state ^ uvec4(k)) * KNUTH); }
vec4 tri_hash4(uint k) { return fhash4(k) - fhash4(k + 0x3125); }
// CxR                          4x1         2x4  ==  2x1
const mat2x4 tri2x4 = mat2x4(vec4(1.0, -1.0, 0.0, 0.0), vec4(0.0, 0.0, 1.0, -1.0))
vec2 tri_hash2(uint k) { return fhash4(k) * tri2x4; }
// --- ---- ---

vec3 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    return pow(texture2D(texture, r).xyz, igamma);
}

const vec3 background_color = vec3(1.0);
vec3 texex(vec2 X) {
    float L = length(X);
    return mix(tex(X), background_color, smoothstep(.4963, .5, L));
}
vec3 texplex(vec2 Z, vec2 dZ, float i) {
    if (i < min_iter) return background_color;
    vec2 X = (Z - vec2(P) * .5) * .5 * tex_zoom;
    vec3 c = texex(X);
    //float scale = length(dZ);
    //vec4 RND = hash(i * 0x707u + 0x606u) * i2e32;
    //c = c - 0.25 * texex(X + (RND.xy - RND.zw) * .001);
    //c = smoothstep(0., 1., c);
    return pow(c, vec3(1.15,1.25,0.9));
}

void main (void) {
    init_hash();
    vec3 color = vec3(0.0);
    for (uint n = 0u; n < uint(N_SAMPLES); n++) {
        vec4 RND = hash(0x303u * (n + 0x101u)) * i2e32;
        vec2 Z = ((RND.xy - RND.zw) * jitter_amount + vertTexCoord.xy) * zoom + M;
        //Z = Z.yx;
        vec2 Z2 = Z * Z;
        float Zmag2 = Z2.x + Z2.y;
        vec2 dZ = vec2(1.0, 0);
        float i = 0.0;
        vec3 c = texplex(Z, dZ, i);
        for (i = 1.; i < MAXITER; i++) {
            if (Zmag2 < BAILOUT2) {
                dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
            // Z = vec2(Z2.x - Z2.y, 2.0 * Z.x * Z.y);
                Z.y *= 2.0 * Z.x;
                Z.x = Z2.x - Z2.y;
                Z += C;
                Z2 = Z * Z;
                Zmag2 = Z2.x + Z2.y;
                c *= texplex(Z, dZ, i);
            }
        }
        c *= step(BAILOUT2, Zmag2);
        color += c;
    }
    // average, gamma, dither, output
    color /= N_SAMPLES;
    vec4 tri_noise = i2e32 * (hash(0x808u) - hash(0x909u));
    color = pow(color, gamma);
    color += tri_noise.rgb / 256.0;
    gl_FragColor = vec4(color, 1.0);
}
