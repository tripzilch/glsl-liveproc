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
uniform vec2 pix_size;

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

// try
//
// uvec2 cox = unpackDouble2x32(co.x);
// uvec2 coy = unpackDouble2x32(co.y);
// uint r = (co.x + co.y)
// mult hash

float rand(vec2 co) {
    const float a = 12.9898;
    const float b = 78.233;
    const float c = 43758.5453;
    float dt= dot(co.xy, vec2(a, b));
    float sn= mod(dt, 3.14);
    return fract(sin(sn) * c) - 0.5;
}
float randfc(float k) { return rand(pixp + k * 48.3); }

vec2 randfc2(float k) { return vec2(rand(pixp + k * 29.9),
                                    rand(pixp + k * 127.6)); }

vec3 randfc3(float k) { return vec3(rand(pixp + k * 89.2),
                                    rand(pixp + k * 55.1),
                                    rand(pixp + k * 34.0)); }

vec3 tex(vec2 p) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    vec2 r = .5 + rot * p;
    return texture2D(texture, clamp(r, 0.01, .99)).xyz;
}

const vec3 background = vec3(0.8588235, 0.8196078, 0.6901961);
const vec3 black =vec3(0.3098039, 0.2784314, 0.2313725);
vec3 texc(vec2 Z, vec2 dZ) {
    vec2 X = (Z - P) * .5 * tex_zoom;
    float res = length(dZ * pix_size * tex_zoom) * zoom * 2.0;
    float L = length(X);
    vec3 c = tex(X);
    c = mix((c - black) / (background - black), c, 0.3);
    //c.b = step(.99, res);
    return c;
}

void main (void) {
    vec2 Z = M + 2.0 * zoom * (pixf + 2.0 * jitter_amount * randfc2(count));
    Z = -Z.yx;
    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    vec2 dZ = vec2(1.0, 0);

    float i = 0.0;
    vec3 color = (i >= min_iter) ? texc(Z, dZ) : texc(P, dZ);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            if (i >= min_iter) {
                vec3 c = texc(Z, dZ);
                color = min(color, c);
            }
        }
    }
    // inside black
    color *= step(BAILOUT2, Zmag2);
    gl_FragColor = vec4(color, alpha);
}
