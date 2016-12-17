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
uniform float bw_threshold;
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
vec2 pixf = vertTexCoord.xy;

vec3 tex(vec2 p) {
    return pow(texture2D(texture, p + .5).xyz, igamma);
}

// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- 
// Multiplicative hash primes
//
// PHI = .5 + .5 * 5 ** .5 -- aka Golden Ratio, aka the most irrational number
//
// 2**32 / PHI       = 2654435769.4972, nearest prime = 2654435761u = 0x9e3779b1
// 2**32 / PHI / PHI = 1640531526.5028, nearest prime = 1640531513u = 0x61c88639
const uint KNUTH = 0x9e3779b1;
const uvec2 KNUTH2 = uvec2(0x9e3779b1, 0x61c88639);
const uvec4 useed = uvec4(0x55336963, 0x96AC5A36, 0x393C6A9A, 0x33C39A9C); // #0
const vec4 fseed = vec4(3395695930.0, 1553552949.0, 1771750995.0, 2628335962.0); // #6

// 1 / 2**32
const float r232 = (1.0 / 4294967296.0);

// per pixel random hash
uvec3 ABC = floatBitsToUint(vec3(vertTexCoord.xy, count));
uint hash_state = ((ABC.x * KNUTH ^ ABC.y) * KNUTH ^ ABC.z) * KNUTH;
//uint hash_state = floatBitsToUint(dot(vec3(vertTexCoord.xy, count), fseed.xyz)) * KNUTH;

void hash(uint k) { hash_state ^= k; hash_state *= KNUTH; }
uint uhash(uint k) { hash_state ^= k; hash_state *= KNUTH; return hash_state; }

float rand0(uint k) { return float(uhash(k)) * r232; }
float rand1(uint k) { return float(uhash(k)) * r232 - 0.5; }
vec2 rand2(uint k) { return  r232 * vec2(uhash(k), uhash(k + 303u)) - 0.5; }
vec3 rand3(uint k) { return  r232 * vec3(uhash(k), uhash(k + 303u), uhash(k + 909u)) - 0.5; }
vec4 rand4(uint k) { return  r232 * vec4(uhash(k), uhash(k + 303u), uhash(k + 909u), uhash(k + 808u)) - 0.5; }
// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- 


void main (void) {
    vec2 Z = M + zoom * (pixf + jitter_amount * rand2(11u));
    float grey = rand0(77u);
    vec3 color = vec3(grey);
    gl_FragColor = vec4(color, 1.0);
}
