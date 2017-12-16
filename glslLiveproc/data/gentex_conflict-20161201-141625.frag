#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

#define PI 3.141592653589793
#define TAU (2.0 * PI)
#define PHI 1.618033988749895 // .5 + .5 * 5 ** .5 -- aka Golden Ratio, aka the most irrational number

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

const float r232 = (1.0 / 4294967296.0);

/* --------------------------------------------------------------------
    Multiplicative hash primes, from PRNG example code from Knuth's
    "The Art of Computer Programming".

    PHI = .5 + .5 * 5 ** .5 ~= 1.618..., the "most irrational number".

    2**32 / PHI       = 2654435769.4972, nearest prime = 2654435761u
    2**32 / PHI / PHI = 1640531526.5028, nearest prime = 1640531513u
-------------------------------------------------------------------- */

#define KNUTH_a 2654435761u
#define KNUTH_b 1640531513u

const uvec2 KNUTH2 = uvec2(KNUTH_a, KNUTH_b);
// here's a bunch of random hex digits selected from 3,5,6,9,A,C (bits 50% on)
// const uvec4 seed = uvec4(0xC9A55996, 0x56969A33, 0x6933AA96, 0x59A6CC56); // #1
// const uvec4 seed = uvec4(0x993AA396, 0x6A3993CA, 0xAAA566AA, 0x353A3659); // #2
// const uvec4 seed = uvec4(0x95CC5559, 0xAAA6ACA3, 0x693CC53A, 0xC6C96CA5); // #3
// const uvec4 seed = uvec4(0xAA39A966, 0xAA65CAA6, 0xAC93655A, 0xA36C9AAC); // #4
// const uvec4 seed = uvec4(0xC39AC6A5, 0xCC955CCA, 0x3595593A, 0x3695C999); // #5
// const uvec4 seed = uvec4(0xCA66353A, 0x5C995635, 0x699AC653, 0x9CA9395A); // #6
// const uvec4 seed = uvec4(0x93C69AC9, 0x99A39596, 0x939C539A, 0xACA99953); // #7
const uvec4 seed = uvec4(0x55336963, 0x96AC5A36, 0x393C6A9A, 0x33C39A9C); // #0

float fP(vec2 co) { return pow(smoothstep(14.,2., length(co)), 2.0); }
float fr(vec2 co) { return smoothstep(10.,1., length(co)) * 0.625 + .375; }

bool cell_mask(vec2 cq, vec2 co, uint seed2) {
    uvec4 h = floatBitsToUint(0.236 * cq.xyyx - 0.146 * cq.yxyx);
    h ^= (h.yzwx >> 16);
    h ^= seed2;

    h ^= seed;
    h *= KNUTH_a;
    vec4 m2 = pow(r232 * h + cq.x - co.x, vec4(2.0));

    h ^= seed.wxyz;
    h *= KNUTH_a;
    m2 += pow(r232 * h + cq.y - co.y, vec4(2.0));

    h ^= seed.zwxy;
    h *= KNUTH_a;
    vec4 P = step(r232 * h, vec4(fP(cq)));

    h ^= seed.yzwx;
    h *= KNUTH_a;
    vec4 r2 = (r232 * 0.375) * h + fr(co) * 0.625;


    return any(lessThan(m2, r2 * P));

    // m2 < r2 && h < fP
    // (m2 - r2) < 0 && (h - fP) < 0

}

const vec3 ee = vec3(-0.5, 0.5, 0.0);
float rand_dot_grid(vec2 co) {
    vec4 qd = floor(co.xyxy + ee.xxyy);
    bool mask = any(bvec4(
        cell_mask(qd.xy, co, 33u),
        cell_mask(qd.zy, co, 33u),
        cell_mask(qd.xw, co, 33u),
        cell_mask(qd.zw, co, 33u)));
    mask = mask || any(bvec4(
        cell_mask(qd.xy, co, 77u),
        cell_mask(qd.zy, co, 77u),
        cell_mask(qd.xw, co, 77u),
        cell_mask(qd.zw, co, 77u)));
    return float(mask);
}

void main (void) {
    vec2 wob = sin(count * vec2(0.1, 0.062) + vec2(-0.5,.5));
    vec2 st = zoom * vertTexCoord.st + M + wob * .01;
    gl_FragColor = vec4(vec3(rand_dot_grid(st * 4.0)), 1.0);
}
