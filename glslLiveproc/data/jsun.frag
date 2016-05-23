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

const uint KNUTH = 2654435761u; // prime close to 2**32/PHI = 2654435769
uvec2 AB = floatBitsToUint(vertTexCoord.xy) * KNUTH;
uint hash_state = KNUTH * (KNUTH * (uint(count) ^ AB.x) ^ AB.y);

float hashf(uint x) {
    hash_state ^= x; // ^ (hash_state >> 16);
    hash_state *= KNUTH;
    return float(hash_state);
}
vec2 rand2(uint k) {
    return vec2(hashf(k), hashf(k + 123u)) * (1.0 / 4294967295.0) - 0.5;
}

vec3 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    return pow(texture2D(texture, r).xyz, igamma);
}

const float tr0 = 0.49, tr1 = 0.499;
vec4 trap(vec2 Z, float i) {
  vec2 X = (Z - P) * tex_zoom;
  float d = length(X);
  float e = .5 - .5 * exp(-d);
  vec2 p = e * X / d;
  vec3 c = tex(e * X / d);
  return vec4(c, e);
  //
}

void main (void) {
    vec2 RND = rand2(25u);
    vec2 Z = (RND * jitter_amount + vertTexCoord.xy) * zoom + M;
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;

    // orbit trap vars
    float i = 0.0;
    //vec4 cw = (i >= min_iter) ? trap(Z,i) : zeros;
    vec4 cw = trap(Z,i);
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
            vec4 c = trap(Z, i);
            //cw = c * c.wwzz + cw;
            cw = mix(c, cw, smoothstep(tr0, tr1, c.w));
        } else { i = MAXITER;}
    }
    //cw.rgb *= step(BAILOUT2, Zmag2);
    //gl_FragColor = vec4(pow(tex(cw.xy / cw.w), gamma), alpha);
    gl_FragColor = vec4(pow(cw.rgb, gamma), alpha);
}
