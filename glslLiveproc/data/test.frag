#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 C;
uniform vec2 P;
uniform vec2 M;
uniform float zoom;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);

vec3 tex(vec2 p) {
    return pow(texture2D(texture, .5 + p).xyz, igamma);
}

const uint offset_basis32 = 2166136261;
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
}

void main (void) {
    //vec2 eps = vec2(pixsize * 0.5, 0.);
    vec3 color;
    float wsum = 0.0, w;

    vec2 st = zoom * vertTexCoord.st + M;
    float c = 0.0;
    for (int i = 0; i< 4; i++) c += rand_FNV(st, i);
    vec3 rgb = vec3(c / 4.0);
    gl_FragColor = vec4(rgb,1.);
}
