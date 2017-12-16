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
const vec2 negx = vec2(-1.0, 1.0);

vec2 pixp = gl_FragCoord.xy;

vec3 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    return pow(texture2D(texture, r).xyz, igamma);
}

vec3 tex(vec2 p, vec2 dpdx) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    p = .5 + rot * p;
    dpdx = rot * dpdx;
    return pow(textureGrad(texture, p, dpdx, dpdx.yx * negx).xyz, igamma);
}

vec3 texplex(vec2 Z) {
    vec2 X = (Z - vec2(P)) * .5 * tex_zoom;
    return mix(tex(X), vec3(1.0), smoothstep(.4963, .5, length(X)));
}

// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ----
// Multiplicative hash primes
//
// PHI = .5 + .5 * 5 ** .5 -- aka Golden Ratio, aka the most irrational number
//
// 2**32 / PHI       = 2654435769.4972, nearest prime = 2654435761u = 0x9e3779b1
// 2**32 / PHI / PHI = 1640531526.5028, nearest prime = 1640531513u = 0x61c88639
const uint KNUTH = 0x9e3779b1u;
const uvec4 useed = uvec4(0x55336963u, 0x96AC5A36u, 0x393C6A9Au, 0x33C39A9Cu); // #0
// --- ---- ---
const float r232 = (1.0 / 4294967296.0); // 1 / 2**32
const float r231 = (2.0 / 4294967296.0);
uvec3 ABC = floatBitsToUint(vec3(vertTexCoord.xy, count)); // per pixel random hash
const int N_RAND = 32;
uvec4 RND[N_RAND];
void main (void) {
    RND[0] = useed;
    RND[0] ^= ABC.xxxx;
    RND[0] *= KNUTH;
    RND[0] ^= ABC.yyyy;
    RND[0] *= KNUTH;
    RND[0] ^= ABC.zzzz;
    RND[0] *= KNUTH;
    for (int n = 1; n < N_RAND; n++) {
        RND[n] = (RND[n - 1] ^ uvec4(n * 1597)) * KNUTH;
    }

    vec2 Z = ((RND[0].xy * r231 - 1.0) * jitter_amount + vertTexCoord.xy) * zoom + M;

    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    // vec2 dZ = vec2(1.0, 0);

    float i = 0.0;
    vec3 color = (i >= min_iter) ? texplex(Z) : vec3(1.0);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            vec3 cc = texplex(Z);
            if (i >= min_iter) color = color * cc;
        }
    }
    // inside black
    color *= step(BAILOUT2, Zmag2);
    // dither, gamma, output
    color = mix(color, r232 * RND[31].rgb, 1/64.0);
    gl_FragColor = vec4(pow(color, gamma * 1.1), 1.0);
}
