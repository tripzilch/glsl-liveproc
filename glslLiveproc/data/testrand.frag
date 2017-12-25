#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

varying vec4 vertColor;
varying vec4 vertTexCoord;

uniform float count;
uniform uint ucount;

// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ----
// Multiplicative hash primes
//
// PHI = .5 + .5 * 5 ** .5 -- aka Golden Ratio, aka the most irrational number
//
// 2**32 / PHI       = 2654435769.4972, nearest prime = 2654435761u = 0x9e3779b1
// 2**32 / PHI / PHI = 1640531526.5028, nearest prime = 1640531513u = 0x61c88639
//
const uint KNUTH = 0x9e3779b1u;
const uvec2 KNUTH2 = uvec2(0x9e3779b1u, 0x61c88639u);

// here's a bunch of random hex digits selected from 3,5,6,9,A,C (bits 50% on)
const uvec4 magic0 = uvec4(0x55336963u, 0x96AC5A36u, 0x393C6A9Au, 0x33C39A9Cu);
const uvec4 magic1 = uvec4(0xC9A55996u, 0x56969A33u, 0x6933AA96u, 0x59A6CC56u);
const uvec4 magic2 = uvec4(0x993AA396u, 0x6A3993CAu, 0xAAA566AAu, 0x353A3659u);
const uvec4 magic3 = uvec4(0x95CC5559u, 0xAAA6ACA3u, 0x693CC53Au, 0xC6C96CA5u);
const uvec4 magic4 = uvec4(0xAA39A966u, 0xAA65CAA6u, 0xAC93655Au, 0xA36C9AACu);
const uvec4 magic5 = uvec4(0xC39AC6A5u, 0xCC955CCAu, 0x3595593Au, 0x3695C999u);
const uvec4 magic6 = uvec4(0xCA66353Au, 0x5C995635u, 0x699AC653u, 0x9CA9395Au);
const uvec4 magic7 = uvec4(0x93C69AC9u, 0x99A39596u, 0x939C539Au, 0xACA99953u);

// 1 / 2**32
const float r232 = (1.0 / 4294967296.0);
const float r231 = (2.0 / 4294967296.0);

// get frame count and pixel bits
uvec3 cxy = floatBitsToUint(vec3(count, vertTexCoord.xy));
uint hash_1 = ((cxy.x * KNUTH ^ cxy.y) * KNUTH ^ cxy.z) * KNUTH;
uvec4 hash_state = ((hash_1 ^ magic0) * KNUTH ^ magic1) * KNUTH;

void hash(uint k) { 
  hash_state = (hash_state.garb ^ (magic2 + k)) * KNUTH; 
  //hash_state = (hash_state ^ (magic2 + k)) * KNUTH; 
}

float rand1f(uint k) { hash(k); return float(hash_state.x) * r232; }
float drand1f(uint k) { hash(k); return float(hash_state.x) * r231; }
vec2 rand2f(uint k) { hash(k); return vec2(hash_state.xy) * r232; }
vec2 drand2f(uint k) { hash(k); return vec2(hash_state.xy) * r231; }
vec3 rand3f(uint k) { hash(k); return vec3(hash_state.xyz) * r232; }
vec3 drand3f(uint k) { hash(k); return vec3(hash_state.xyz) * r231; }
vec4 rand4f(uint k) { hash(k); return vec4(hash_state.xyzw) * r232; }
vec4 drand4f(uint k) { hash(k); return vec4(hash_state.xyzw) * r231; }

// uvec4 xstate = ABC.xyxy ^ ABC.zzzx;
// void xorshift128() {
//     uint32_t s, t = xstate.z;
//     t ^= t << 11;
//     t ^= t >> 8;
//     state[3] = state[2]; state[2] = state[1]; state[1] = s = state[0];
//     xstate.yzw = xstate.xyz
//     t ^= s;
//     t ^= s >> 19;   
//     state[0] = t;
//     return t;
// }

void main (void) {
    vec3 rgb = rand3f(7u);
    gl_FragColor = vec4(rgb, 1.0);
}
