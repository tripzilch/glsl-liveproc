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
uniform float dissolve;
uniform float alpha;
uniform float jitter_amount;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const float MAXITER = 125.;
const float BAILOUT2 = 256.0;
const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const vec3 zom = vec3(0.0, 1.0, -1.0);

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

const float tex_edge = 64.0 / 1024.0;
const vec2 tex_corner = vec2(tex_edge * .5, tex_edge * -.5 + 1.0);
vec3 tc00 = texture2D(texture, tex_corner.xx).rgb;
vec3 tc01 = texture2D(texture, tex_corner.xy).rgb;
vec3 tc10 = texture2D(texture, tex_corner.yx).rgb;
vec3 tc11 = texture2D(texture, tex_corner.yy).rgb;
mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                 sin(tex_angle),  cos(tex_angle));

vec3 tex_square(vec2 p) {
    vec2 r = rot * p;

    vec2 corner_mix = smoothstep(-.5, .5, r);
    vec2 edge_mix = smoothstep(0, tex_edge, 0.5 - abs(r));

    vec3 c = mix(mix(tc00, tc10, corner_mix.x),
                 mix(tc01, tc11, corner_mix.x), corner_mix.y);
    c = mix(c, texture2D(texture, r + .5).xyz, edge_mix.x * edge_mix.y);
    return pow(c, igamma);
    //return mix(vec3(.4,.3,.2), vec3(1.,1.,1.), smoothstep(.4,.45,length(p)));
}
vec3 tex_back(vec2 p) {
    vec2 r = rot * p;
    vec2 corner_mix = smoothstep(-.5, .5, r);
    vec3 c = mix(mix(tc00, tc10, corner_mix.x),
                 mix(tc01, tc11, corner_mix.x), corner_mix.y);
    return pow(c, igamma);
}

vec4 trap(vec2 Z, float i) {
  vec2 X = (Z - P) * tex_zoom;
  float d = length(X);
  return vec4(tex_square(0.001 * rand2(33u) + X), d);
}
vec4 trap0(vec2 Z, float i) {
  vec2 X = (Z - P) * tex_zoom;
  float d = length(X);
  return vec4(tex_back(X), d);
}

void main (void) {
    vec2 RND = rand2(22u);
    vec2 Z = (RND * jitter_amount + vertTexCoord.xy) * zoom + M;
    //Z.xy=Z.yx*zom.zy;
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;

    // orbit trap vars
    float i = 0.0;
    vec4 ca = (i >= min_iter) ? trap(Z,i) : trap0(Z,i);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            // iterate Z
            // vec2 Zprev = Z;
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            // calc squared magnitudes
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            // orbit trap
            if (i >= min_iter) {
                vec4 ci = trap(Z, i);
                ca = mix(min(ci, ca), ca, smoothstep(0.35, 1.0, ci.a));
            }
        } else { i = MAXITER;}
    }
    //ca.rgb = smoothstep(0.0, 1.0, ca.rgb);
    ca.rgb *= step(BAILOUT2, Zmag2);
    //gl_FragColor = vec4(pow(tex(ca.xy / ca.w), gamma), alpha);
    gl_FragColor = vec4(pow(ca.rgb, gamma), alpha);
}
