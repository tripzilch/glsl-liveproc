#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;
uniform float alpha;
uniform float count;
uniform float jitter_amount;
uniform int N_SAMPLES;

uniform vec2 C;
uniform vec2 P;
uniform float min_iter;
uniform vec2 M;
uniform float zoom;

uniform float tex_zoom;
uniform float tex_angle;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const float MAXITER = 300.;
const float BAILOUT2 = 256.0;
const float TAU = 6.283185307179586;
const float PHI = 1.618033988749895;

const float i2e32 = (1.0 / 4294967296.0); // 1 / 2**32
const float i2e31 = (2.0 / 4294967296.0);

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
    hash_state = uhash4(ABC.xxxx); //  ^ (hash_state.wxyz >> 16)
    hash_state = uhash4(ABC.yyyy);
    hash_state = uhash4(ABC.zzzz);
}
vec4 rand4f(uint k) { return i2e32 * uhash4(uvec4(k)); }
vec4 trirand4f(uint k) { return rand4f(k) - rand4f(k + 0x3125u); }
vec2 trirand2f(uint k) {
    vec4 r = rand4f(k);
    return r.xy - r.wz; // rand4f(k) * mat2x4(vec4(1., -1., 0., 0.), vec4(0., 0., 1., -1.));
}
// --- ---- --- --- ---- --- --- ---- --- --- ---- --- --- ---- --- --- ----

vec4 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    return pow(texture2D(texture, r).rgba, vec4(igamma.rgb, 1.0));
}

vec4 background_color = vec4(.0, .0, 1.0, 0.0);
vec4 texex(vec2 X) {
    float L = length(X);
    float rL = 1.0 / (L + 0.0005);
    float r = smoothstep(.22, .5, L);
    vec4 bc = tex(X * (.22 + .28 * r) * rL);
    bc.a = bc.a / (1.0 + 4.0 * r * pow(L - .22, 2.0));    
    vec4 c = mix(tex(X), bc, r);
    return c;
}

vec4 texplex(vec2 Z, vec2 dZ, float i) {
    if (i < min_iter) return background_color;
    vec2 X = (Z - vec2(P) * .5) * tex_zoom;
    return texex(X);
}

void main (void) {
    init_hash();
    vec3 color = vec3(0.0);
    for (uint n = 0u; n < uint(N_SAMPLES); n++) {
        vec2 Z = (trirand2f(n + 0xb0bu) * jitter_amount + vertTexCoord.xy) * zoom + M;
        vec2 Z2 = Z * Z;
        float Zmag2 = Z2.x + Z2.y;
        vec2 dZ = vec2(1.0, 0);
        float i = 0.0;
        vec4 c = texplex(Z, dZ, i);
        //c.r = dot(c.rgb, vec3(.3,.5,.2));
        //c.g = c.a;
        for (i = 1.; i < MAXITER; i++) {
            if (Zmag2 < BAILOUT2) {
                dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
                Z.y *= 2.0 * Z.x;
                Z.x = Z2.x - Z2.y;
                Z += C;
                Z2 = Z * Z;
                Zmag2 = Z2.x + Z2.y;
                vec4 ci = texplex(Z, dZ, i); 
                c = mix(ci, c, smoothstep(ci.a * .5, ci.a * 1.5, c.a));
            }
        }
        // accumulate
        color.rgb += c.rgb * step(BAILOUT2, Zmag2);
    }
    // average, gamma, dither, output
    color /= N_SAMPLES;
    color = pow(color, gamma);
    color += trirand4f(0x303u).rgb / 256.0;
    gl_FragColor = vec4(color, alpha);
}
