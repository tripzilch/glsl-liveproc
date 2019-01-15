#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;
uniform vec2 buf_size;
uniform vec2 tex_size;
uniform vec4 tile_rect;
uniform float count;
uniform float alpha;
uniform int N_SAMPLES;

uniform vec3 camera_pos;
uniform vec3 uu;
uniform vec3 vv;
uniform vec3 ww;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const float TAU = 6.283185307179586;
const float PHI = 1.618033988749895;
const float sq2 = 1.4142135623730951;
const float isq2 = 0.7071067811865476;

// #define ROTX(phi) (mat3(             \
//     vec3(1.,       0.,        0.),   \
//     vec3(0., cos(phi), -sin(phi)),   \
//     vec3(0., sin(phi),  cos(phi))))
// 
// #define ROTX(phi) (mat3(             \
//     vec3(1.,       0.,        0.),   \
//     vec3(0., cos(phi), -sin(phi)),   \
//     vec3(0., sin(phi),  cos(phi))))

vec3 tex(vec2 p) { 
  return pow(textureGrad(texture, p + .5, vec2(1., 0.) / tex_size.x, vec2(0., 1.) / tex_size.y).xyz, igamma);
}

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

// --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ---- --- ----

// ======== Special random functions

vec3 cos_hemi(vec3 n, uint i) {
  //hash(1112u * i);
  //vec2 uv = vec2(hash_state.ba) * vec2(TAU * r232, r231) + vec2(0.0, -1.0); // (0..TAU, -1..1)
  vec2 uv = rand2f(1112u * i);
  uv.x *= TAU;
  uv.y = uv.y * 2.0 - 1.0;
  vec3 p = vec3(sqrt(1.0 - uv.y * uv.y) * vec2(cos(uv.x), sin(uv.x)), uv.y);
  return normalize(n + p);
}

// ======== (signed) distance functions

float max3(vec3 p ) { return max(p.x, max(p.y, p.z)); }

float sd_box(vec3 p, vec3 b) {
  vec3 di = abs(p) - b;
  float mc = max3(di);
  return min(mc, length(max(di, 0.0)));
}

float sd_sphere(vec3 p, float radius) { 
  return length(p) - radius; 
}

float sd_torus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float sd_plane(vec3 p, vec4 n) { // n must be normalized
  return dot(p, n.xyz) + n.w; 
}

float ud_roundbox(vec3 p, vec3 b, float r) {
  return length(max(abs(p)-b, 0.0)) - r;
}

float sd_cylinder(vec3 p, vec3 c) {
  return length(p.xz - c.xy) - c.z;
}

float sd_capsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float sd_ellipsoid(vec3 p, vec3 r) {
  return (length(p / r) - 1.0) * min(min(r.x, r.y), r.z);
}

const float sh = sin(.6);
const float ch = cos(.6);
float sd_heart(vec3 p) {
  p.x = abs(p.x);
  p.xy = vec2(p.x * ch - p.y * sh - 1.0, p.y * ch + p.x * sh);
  p.z += 3.0;
  return sd_ellipsoid(p, vec3(3.5, 7.0, 1.0));
}
#define ROTX(phi) (mat3(             \
    vec3(1.,       0.,        0.),   \
    vec3(0., cos(phi), -sin(phi)),   \
    vec3(0., sin(phi),  cos(phi))))

// ======== scene and distance estimation

// colors
const vec3 sky = vec3(.2, .2, .7);
const vec3 sky2 = vec3(.03, .03, .1);
const vec3 mist = vec3(.3, .25, .35);
const vec3 sun = vec3(1.0, 1.0, .7);
const vec3 moon = vec3(0.5, 0.7, 1.0);
const vec3 obj_colors[] = vec3[](
  vec3(0.12,0.11,0.3),
  vec3(0.7,0.8,0.9),
  vec3(0.98,0.05,0.12),
  vec3(0.4,0.9,1.0),
  vec3(0.7,0.3,0.95));


// scene (DE function and obj_id function)
#define OBJ1(p) sd_ellipsoid(p - vec3(0.0, -3.0, 0.0), vec3(18.0, 3.0, 18.0))
#define OBJ2(p) sd_torus(p - vec3(0.0, 1.5, 0.0), vec2(10.0, 0.3))
#define OBJ3(p) sd_heart(p - vec3(0.0, 7.0, 0.0))

float DE(vec3 p) { 
  return min(OBJ1(p), min(OBJ2(p), OBJ3(p))); 
}

int obj_id(vec3 p) {
  int i;
  float d, f;
  d = OBJ1(p);
  i = 0;
  f = min(d, OBJ2(p));
  if (f < d) { d = f; i = 1; }
  f = min(d, OBJ3(p));
  if (f < d) { d = f; i = 2; }
  return i;
}

// tracing
const float d_max = 128.0;
float intersect(vec3 p, vec3 r) {
    float d = .01;
    for(int i = 0; i < 128; i++) {
        float step = DE(r * d + p);
        d += step;
        if (step < 0.0001 || d > d_max) break;
    }
    d = min(d, d_max);
    return d;
}

vec3 calc_normal(vec3 p) {
    vec3 eps = vec3(0.0001, 0.0, 0.0);
    return normalize(vec3(
      DE(p + eps.xyy) - DE(p - eps.xyy),
      DE(p + eps.yxy) - DE(p - eps.yxy),
      DE(p + eps.yyx) - DE(p - eps.yyx)));
}

// ======== lights
const vec3 sundir = normalize(vec3(-.2, .9, -.6));
const vec3 moondir = normalize(vec3(-.2, .6, .8));

vec3 skycolor(vec3 r) {
  vec3 c = vec3(0.0);
  c = mix(c, sky2, smoothstep(0.0, 0.5, r.y));
  c = mix(c, sun * 4., smoothstep(.8, .9, pow(dot(r, sundir), 8.0)));
  c = mix(c, moon * 2., smoothstep(.8, 1.0, pow(dot(r, moondir), 4.0)));
  return c;
  //vec3 t = tex(vec2(atan(r.x, r.z) / TAU, -r.y * 0.5 - 0.05));
}

// ======== material

vec3 pos_color(vec3 p, vec3 n) {
  return obj_colors[obj_id(p)]; // vec3(0.6) * vec3(1.0, 0.9, 0.8);
}

vec3 ray_bounce(vec3 p, vec3 n, vec3 r) {
  vec2 uv = rand2f(1112u);
  uv.x *= TAU;
  uv.y = uv.y * 2.0 - 1.0;
  vec3 rh = vec3(sqrt(1.0 - uv.y * uv.y) * vec2(cos(uv.x), sin(uv.x)), uv.y);
  vec3 rr = reflect(r, n);
  float b = pow((2.0 + dot(rr, rh)) * 0.5, 2.0);
  return normalize(normalize(n + rh) + b * rr);
  //return cos_hemi(n, 7721u);
}

// ======== global illumination pathtracer

// void bounce(vec3 p, vec3 r) {
//   float d = intersect(p, r); // writes p += r * d;
//   p += r * d;
//   if(d >= d_max) { // we hit nothing
//     acol += skycolor(r);       
//     break;
//   } 
//   vec3 n = calc_normal(p);
//   vec3 surface_color = pos_color(p, n);
//   mcol *= surface_color;
//   // acol += mcol * light
//   r = ray_bounce(p, n, r);
//   // out: p, r, acol, mcol     
// }

const uint num_levels = 4u;
vec3 ray_color(vec3 p, vec3 r) {
    vec3 mcol = vec3(1.0);
    vec3 acol = vec3(0.0);

    // iteratively create num_levels bounces of global illumination
    for (uint i = 0u; i < num_levels; i++) {
      // in: p, r, acol, mcol
      float d = intersect(p, r);
      p += r * d;
      if(d >= d_max) { // we hit nothing
        acol += skycolor(r);       
        break;
      } 
      vec3 n = calc_normal(p);
      vec3 surface_color = pos_color(p, n);
      mcol *= surface_color;
      // acol += mcol * light
      r = ray_bounce(p, n, r);
      // out: p, r, acol, mcol   
    }

    return acol * mcol;
}

mat3 setCamera( in vec3 ro, in vec3 rt, in float cr )
{
    vec3 cw = normalize(rt-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -cw );
}

// compute the color of a pixel
void main(void) {
  const float fov = 2.0;
  const float focus_distance = 4.0;
  const float blur_amount = 0.00;

  vec3 camera_pos = vec3(2.5, 10., -25.);
  vec3 look_at = vec3(0., 5., 0.);
  vec3 up = vec3(0.0, 1.0, 0.0);

  vec3 ww = normalize(look_at - camera_pos);  // front axis
  vec3 uu = normalize(cross(up, ww));     // right axis
  vec3 vv = normalize(cross(ww, uu));     // up axis
  
//  mat3 camera_matrix = mat3(
//    vec3( 1.,  0.,  0.),  // ::  uu * er.x |p.x|
//    vec3( 0., -1.,  0.),  // :: -vv * er.y |p.y|
//    vec3( 0.,  0.,  1.)); // ::  ww * er.z |fov|
//
  mat3 camera_matrix = mat3(uu, -vv, ww);

  // float a = count * 0.005;
  // camera_matrix = ROTX(a) * camera_matrix;

  vec3 col = vec3(0.0);
  for(uint i = 0u; i < N_SAMPLES; i++) {
      vec2 p = vertTexCoord.xy + (drand2f(i + 7u) - 1.0) / buf_size.y; // screen coords with antialiasing

      // create ray with depth of field
      vec3 er = normalize(vec3(p.xy, fov));
      //vec3 rd = uu * er.x - vv * er.y + ww * er.z;

      //vec3 ao = blur_amount * vec3(drand2f(i * 555u + 888u) - 1.0, 0.0);
      //vec3 ad = normalize(er * focus_distance - ao);
      
      vec3 ro = camera_pos;
      vec3 rd = camera_matrix * er;
      //ro += ao.x * uu + ao.y * vv;
      //rd += ad.x * uu + ad.y * vv;

      // accumulate path
      col += ray_color(ro, normalize(rd));
  }
  col = col / float(N_SAMPLES);

  // apply gamma correction
  // col = pow(col, gamma);
  gl_FragColor = vec4(col + (rand3f(11u) - rand3f(26u)) / 256.0, alpha);
}
