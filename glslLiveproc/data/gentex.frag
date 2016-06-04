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
const vec3 omz = vec3(1., -1., 0.);
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);

const float r232 = (1.0 / 4294967296.0);
const uint KNUTH = 2654435761u; // prime close to 2**32/PHI = 2654435769

uvec3 ABC = floatBitsToUint(vec3(vertTexCoord.xy, count)); // * KNUTH;
uint hash_state = ((ABC.x * KNUTH ^ ABC.y) * KNUTH ^ ABC.z) * KNUTH;

void hash(uint k) { hash_state ^= k; hash_state *= KNUTH; }
void hash2(uvec2 k) { hash_state ^= k.x; hash_state *= KNUTH; hash_state ^= k.y; hash_state *= KNUTH; }
uint uhash(uint k) { hash_state ^= k; hash_state *= KNUTH; return hash_state; }

float rand0(uint k) { return float(uhash(k)) * r232; }
float rand1(uint k) { return float(uhash(k)) * r232 - 0.5; }
vec2 rand2(uint k) { return  r232 * vec2(uhash(k), uhash(k + 303u)) - 0.5; }
vec3 rand3(uint k) { return  r232 * vec3(uhash(k), uhash(k + 303u), uhash(k + 909u)) - 0.5; }
vec4 rand4(uint k) { return  r232 * vec4(uhash(k), uhash(k + 303u), uhash(k + 909u), uhash(k + 808u)) - 0.5; }

vec3 tex_dots(vec2 p) {
    vec2 i;
    vec4 f = vec4(modf(p, i), 1.0, 1.0);
    f.zw -= f.xy;
    hash_state = 55555u;
    hash2(uvec2(i));
    vec4 i4 = vec4(i - p, i - p + 1.0);
    vec4 d4 = vec4(
    length(i+p)
    length(i+mzo.xz+p)
    length(i+mzo.zx+p)
    length(i+mzo.xx+p)
}

void main (void) {
    vec2 st = zoom * vertTexCoord.st + M;
    gl_FragColor = vec4(pow(rand3(1u)+0.5, gamma), 1.0);
}





float cta = 0.6967067093471654;
float sta = 0.7173560908995228;
mat2 rot = mat2( cta, -sta, sta,  cta);

vec3 tex_circle(vec2 p) {
    float gray = 0.9;
    gray -= 0.7 * step(length(p), 1.0);
    vec2 q = rot * p * vec2(3.3, 2.2);
    gray += 0.1 * step(length(q), 1.0);
    q = rot * q * vec2(1.5,1.2);
    gray += 0.1 * step(length(q), 1.0);
    q = rot * q * vec2(1.5,1.2);
    gray += 0.1 * step(length(q), 1.0);
    q = rot * q * vec2(1.5,1.2);
    gray += 0.1 * step(length(q), 1.0);
    vec3 rgb = vec3(gray);
    return pow(rgb, igamma);
}
