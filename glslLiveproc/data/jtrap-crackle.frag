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
    return pow(texture2D(texture, r).xyz, igamma);
}

vec3 tex(vec2 p, vec2 dpdx) {
    mat2 rot = mat2( cos(tex_angle), -sin(tex_angle),
                     sin(tex_angle),  cos(tex_angle));
    p = .5 + rot * p;
    dpdx = rot * dpdx;
    return pow(textureGrad(texture, p, dpdx, dpdx.yx * negx).xyz, igamma);
}

vec3 tex_circular(vec2 Z) {
    vec2 X = (Z - vec2(P)) * .5 * tex_zoom;
    vec3 c = mix(tex(X), vec3(1.0), step(.496, length(X)));
    return c;
}

const float if_e = 1.0;
vec3 tex_circular(vec2 Z, float n) {
    vec2 X = (Z - vec2(P)) * tex_zoom * 0.5;
    vec3 c = mix(tex(X), vec3(1.0), step(.496, length(X)));
    return c;
}

void main (void) {
    vec2 Z = M + zoom * (pixf + 1.0 * jitter_amount * randfc2(count));

    vec2 Z2 = Z * Z;
    float Zmag2 = Z2.x + Z2.y;
    vec2 dZ = vec2(1.0, 0);

    float i = 0.0;
    vec3 color = (i >= min_iter) ? tex_circular(Z, i) : vec3(1.0);
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT2) {
            dZ = 2.0 * vec2(Z.x * dZ.x - Z.y * dZ.y, Z.x * dZ.y + Z.y * dZ.x);
            Z.y *= 2.0 * Z.x;
            Z.x = Z2.x - Z2.y;
            Z += C;
            Z2 = Z * Z;
            Zmag2 = Z2.x + Z2.y;
            vec3 cc = tex_circular(Z, i);
            if (i >= min_iter) color = color * cc;
        }
    }
    // inside black
    color = vec3(smoothstep(0.480, 0.485, pow(color.g, 1.0)));
    color *= step(BAILOUT2, Zmag2);
    // dither, gamma, output
    //color.g = rand(gl_FragCoord.xy)+0.5;
    //color *= vec3(1.0,1.0,0.5) + randfc3(count);
    gl_FragColor = vec4(pow(color, gamma * 1.1), alpha);
}
