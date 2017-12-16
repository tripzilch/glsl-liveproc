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
const float TAU = 6.283185307179586;
const float PHI = 1.618033988749895;
const float sq2 = 1.4142135623730951;
const float isq2 = 0.7071067811865476;

vec3 tex(vec2 p) { return pow(texture2D(texture, p + .5).xyz, igamma); }

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
}

float rand1f(uint k) { hash(k); return float(hash_state.x) * r232; }
float drand1f(uint k) { hash(k); return float(hash_state.x) * r231; }
vec2 rand2f(uint k) { hash(k); return vec2(hash_state.xy) * r232; }
vec2 drand2f(uint k) { hash(k); return vec2(hash_state.xy) * r231; }
vec3 rand3f(uint k) { hash(k); return vec3(hash_state.xyz) * r232; }
vec3 drand3f(uint k) { hash(k); return vec3(hash_state.xyz) * r231; }
vec4 rand4f(uint k) { hash(k); return vec4(hash_state.xyzw) * r232; }
vec4 drand4f(uint k) { hash(k); return vec4(hash_state.xyzw) * r231; }

// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ----

// -- SD functions
float maxcomp(vec3 p ) { return max(p.x,max(p.y,p.z));}
float sd_box(vec3 p, vec3 b)
{
  vec3  di = abs(p) - b;
  float mc = maxcomp(di);
  return min(mc, length(max(di, 0.0)));
}
float sd_sphere(vec3 p, float radius) { return length(p) - radius; }
float sd_torus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
float sd_plane(vec3 p, vec4 n) { return dot(p, n.xyz) + n.w; } // n must be normalized

float DE(vec3 p) {
  float d = sdPlane(p, vec4(0.0, 1.0, 0.0, 0.0));
  d = min(d, sd_sphere(p - vec3(0.0, -1.0, 0.0), 1.0));
  return d;
}

// -- tracing functions
vec3 calc_normal(vec3 p) {
    vec3 eps = vec3(0.0001, 0.0, 0.0);
    return normalize(vec3(
      DE(p + eps.xyy) - DE(p - eps.xyy),
      DE(p + eps.yxy) - DE(p - eps.yxy),
      DE(p + eps.yyx) - DE(p - eps.yyx)));
}

vec3 cos_hemi(vec3 n, uint i) {
  vec2 uv = rand2d(1112u * i) * vec2(TAU, 2.0);
  uv.y -= 1.0;
  vec3 p = vec3(sqrt(1.0 - uv.y * uv.y) * vec2(cos(uv.x), sin(uv.x)), uv.y);
  return normalize(n + p);
}

float intersect(vec3 p, vec3 r) {
    float res = -1.0;
    float tmax = 16.0;
    float t = 0.01;
    for(int i = 0; i < 128; i++) {
        float h = DE(p + r * t);
        if(h < 0.0001 || t > tmax) break;
        t += h;
    }    
    if(t < tmax) res = t;
    return res;
}

vec3 pos_color(vec3 p, vec3 n) {
  return vec3(0.4) * vec3(1.2, 1.1, 1.0);
}

vec3 pos_light(vec3 p, vec3 n) {
  intersect(p, cos_hemi(n, 8841u)) > 0.0
  return vec3(0.4) * vec3(1.2, 1.1, 1.0);
}

vec3 ray_bounce(vec3 p, vec3 n, vec3 r) {
  //vec3 rr = reflect(rd, n);
  //b = ((2 + dot(rr, p)) * 0.5) ** 4
  //p = normalize(normalize(n + p) + b * rr)
  return cos_hemi(n, 7721u);
}

vec3 ray_color(vec3 p, vec3 r, uint num_levels) {
    vec3 acol = vec3(0.0);
    vec3 mcol = vec3(1.0);

    // iteratively create num_levels bounces of global illumination
    float t0 = intersect(p, r); // returns dist
    float t = T0; // returns dist
    if(t < 0.0) { return skycolor(r); }
    p += r * t;
    for (uint i = 0u; t >=0.0 && i < num_levels; i++) {
        vec3 n = calc_normal(p);

        vec3 surface_color = pos_color(p, n);
        mcol *= surface_color;

        // compute lighting
        vec3 light_color = pos_light(p, n);
        acol += mcol * light_color;

        // prepare ray for indirect lighting gathering
        r = ray_bounce(p, n, r);
        t = intersect(p, r); // returns dist
        p += r * t;
    }

    return tcol;
}

// compute the color of a pixel
const uint N_SAMPLES = 32u;
vec3 pix_color(vec2 pixel, vec2 resolution) {
    const float fov = 2.5;
    const float focus_distance = 1.3;
    const float blur_amount = 0.0015;
    const uint  num_levels = 4u;

    vec3 col = vec3(0.0);
    for(uint i = 0u; i < N_SAMPLES; i++) {
        // screen coords with antialiasing
        vec2 p = (pixel * 2.0 + drand2f(i + 7u) - resolution) / resolution.y;

        // get camera position, and right/up/front axis
        vec3 ro = vec3(0.0, 1.0, -10.0);
        vec3 uu = vec3(1.0, 0.0, 0.0);
        vec3 vv = vec3(0.0, 1.0, 0.0);
        vec3 ww = vec3(0.0, 0.0, 1.0);

        // create ray with depth of field
        vec3 er = normalize(vec3(p.xy, fov));
        vec3 rd = er.x * uu + er.y * vv + er.z * ww;

        vec3 go = blur_amount * vec3(drand2f(i * 555u + 888u) - 1.0, 0.0);
        vec3 gd = normalize(er * focus_distance - go);
        ro += go.x * uu + go.y * vv;
        rd += gd.x * uu + gd.y * vv;

        // accumulate path
        col += ray_color(ro, normalize(rd), num_levels);
    }
    col = col / float(N_SAMPLES);

    // apply gamma correction
    col = pow(col, gamma);
    return col;
}

void main(void) {
    vec2 Z = M + zoom * (pixf + jitter_amount * rand2(11u));
    float grey = rand0(77u);
    vec3 color = vec3(grey);
    gl_FragColor = vec4(color, 1.0);
}
