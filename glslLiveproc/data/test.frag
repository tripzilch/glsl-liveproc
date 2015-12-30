#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;
uniform vec2 texOffset; // vec2(1/width,1/height)
uniform vec2 C;
uniform vec2 P;
uniform float min_iter;
uniform vec2 M;
uniform float count;
uniform float zoom;
uniform float tex_zoom;
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
vec2 pix_size = texOffset;
vec2 pixf = vertTexCoord.xy;

vec3 tex(vec2 p) {
    return pow(texture2D(texture, .5 + p).xyz, igamma);
}

/*const uint offset_basis32 = 2166136261;
const uint FNV_prime32 = 16777619;
const uint MASK_23 = 0x7fffff;
float rand_FNV(vec2 p, uint seed) {
    uvec2 i = floatBitsToUint(p) ^ floatBitsToUint(gl_FragCoord.xy);
    uint hash = offset_basis32 ^ seed;
    // hash all the bit
    hash ^= ((i.x >> 24) & 0xFF); hash *= FNV_prime32;
    hash ^= ((i.y >> 24) & 0xFF); hash *= FNV_prime32;
    hash ^= ((i.x >> 16) & 0xFF); hash *= FNV_prime32;
    hash ^= ((i.y >> 16) & 0xFF); hash *= FNV_prime32;
    hash ^= ((i.x >> 8) & 0xFF);  hash *= FNV_prime32;
    hash ^= ((i.y >> 8) & 0xFF);  hash *= FNV_prime32;
    hash ^= (i.x & 0xFF);         hash *= FNV_prime32;
    hash ^= (i.y & 0xFF);         hash *= FNV_prime32;
    // xor fold to 24 bits
    hash = (hash >> 23) ^ (hash & MASK_23);
    float result = hash;
    result /= 8388608.0;
    return result;
}*/

void main (void) {
    //vec2 eps = vec2(pixsize * 0.5, 0.);
    vec3 color;
    float wsum = 0.0, w;

    vec2 st = zoom * vertTexCoord.st + M;
    vec4 c = vec4(0.0);

    ivec2 ist = floatBitsToInt(st);
    int ii = (ist.x >> 8) * ist.y * 16777619 + (ist.y >> 9) * ist.x;

    float r = .5 + ii / 4294967295.0;

    /* for (int i = 1; i < 8; i++) {
        c += .5 + .5 * sin(st.xyxy * (6 + (i^5)) * (1 + c.xxyy / PHI) + st.yyxx * (5 + ((i*3+1) & 7)) * (PHI - c.yxyx) );
    }
     */
    vec3 rgb = vec3(r);
    gl_FragColor = vec4(rgb,1.);
}
