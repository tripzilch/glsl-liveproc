// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- 
// Multiplicative hash primes
//
// PHI = .5 + .5 * 5 ** .5 -- aka Golden Ratio, aka the most irrational number
//
// 2**32 / PHI       = 2654435769.4972, nearest prime = 2654435761u = 0x9e3779b1
// 2**32 / PHI / PHI = 1640531526.5028, nearest prime = 1640531513u = 0x61c88639
const uint KNUTH = 0x9e3779b1;
const uvec2 KNUTH2 = uvec2(0x9e3779b1, 0x61c88639);

// 1 / 2**32
const float r232 = (1.0 / 4294967296.0);

// per pixel random hash
uvec3 ABC = floatBitsToUint(vec3(vertTexCoord.xy, count));
uint hash_state = ((ABC.x * KNUTH ^ ABC.y) * KNUTH ^ ABC.z) * KNUTH;

void hash(uint k) { hash_state ^= k; hash_state *= KNUTH; }
uint uhash(uint k) { hash_state ^= k; hash_state *= KNUTH; return hash_state; }

float rand0(uint k) { return float(uhash(k)) * r232; }
float rand1(uint k) { return float(uhash(k)) * r232 - 0.5; }
vec2 rand2(uint k) { return  r232 * vec2(uhash(k), uhash(k + 303u)) - 0.5; }
vec3 rand3(uint k) { return  r232 * vec3(uhash(k), uhash(k + 303u), uhash(k + 909u)) - 0.5; }
vec4 rand4(uint k) { return  r232 * vec4(uhash(k), uhash(k + 303u), uhash(k + 909u), uhash(k + 808u)) - 0.5; }
// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- 
