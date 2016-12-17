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

const float MAXITER = 75.;
const float BAILOUT2 = 16.0;
const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);
const float tx = 10.5 / 768.;

const float r232 = (1.0 / 4294967296.0);

const uvec4 seeds = uvec4(0x55336963, 0x96AC5A36, 0x393C6A9A, 0x33C39A9C); // #0
const uint KNUTH = 2654435761u; // prime close to 2**32/PHI = 2654435769

uvec3 ABC = floatBitsToUint(vec3(vertTexCoord.xy, count)) * KNUTH;
uint hash_state = ((ABC.x * KNUTH ^ ABC.y) * KNUTH ^ ABC.z) * KNUTH;

void hash(uint k) { hash_state ^= k; hash_state *= KNUTH; }
void hash2(uvec2 k) { hash_state ^= k.x; hash_state *= KNUTH; hash_state ^= k.y; hash_state *= KNUTH; }
uint uhash(uint k) { hash_state ^= k; hash_state *= KNUTH; return hash_state; }

float rand(uint k) { return  r232 * float(uhash(k)); }
vec2 rand2(uint k) { return  r232 * vec2(uhash(k), uhash(k + seeds.x)); }
vec3 rand3(uint k) { return  r232 * vec3(uhash(k), uhash(k + seeds.x), uhash(k + seeds.y)); }
vec4 rand4(uint k) { return  r232 * vec4(uhash(k), uhash(k + seeds.x), uhash(k + seeds.y), uhash(k + seeds.z)); }

vec4 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec4 c = texture2D(texture, .5 + rot * p).rgba;
    return vec4(pow(c.rgb, igamma), c.a);
}

const float tr0 = 0.354, // 724.0 / 2048.0
            tr1 = 0.4;
vec4 bcol = tex(vec2(-0.5, -0.5));
vec4 trap(vec2 Z, vec2 dZ) {
  vec2 X = (Z - P) * tex_zoom;
  float d = length(X);
  vec4 a_scale = vec4(1.0, 1.0, 1.0, pow(length(dZ), -0.15));
  return (d > tr0 ? bcol : tex(X)) * a_scale;
}

void main (void) {
    vec2 RND = rand2(25u) - rand2(2525u);
    vec2 Z = (RND * jitter_amount + vertTexCoord.xy) * zoom + M;
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    vec2 dZ = vec2(1.0, 0);

    // orbit trap vars
    float i = 0.0;
    vec4 cc = (i >= min_iter) ? trap(Z, dZ) : bcol;
    //vec4 cc = trap(Z,i);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // iterate dZ
            dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
            // iterate Z
            // vec2 Zprev = Z;
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            // calc squared magnitudes
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            // orbit trap
            vec4 c = trap(Z, dZ);
            //cw = c * c.wwzz + cw;
            cc = mix(cc, c, smoothstep(cc.a * 0.9, cc.a * 1.1, c.a));
        } else { i = MAXITER;}
    }
    //cc.rgb *= step(BAILOUT2, Zmag2);
    gl_FragColor = vec4(pow(cc.rgb, gamma), alpha);
}
