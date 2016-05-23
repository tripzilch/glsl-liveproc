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
const vec4 ones = vec4(1.0);
const vec4 zeros = vec4(0.0);

vec3 tex(vec2 p) {
    return pow(texture2D(texture, .5 + p).xyz, igamma);
}

void main (void) {
    vec3 color;
    float wsum = 0.0, w;

    vec2 st = zoom * vertTexCoord.st + M;
    vec3 c = vec3(0.0);
    vec2 fi = vec2(3.0, 5.0);
    for (int i = 1; i < 23; i++) {
        fi = fi.yx + vec2(0.0, fi.y);
        float a;
        a = 66.0 / float(i+77) * dot(st + vec2(i*i,i), mod(fi, 11.235));
        a += dot(vec3(-0.9, -0.7, 0.6), c);
        a = sin(a);

        c = c.yzz;
        c.z += a;
    }
    vec3 rgb = vec3(smoothstep(-6.0, 6.0, c));
    gl_FragColor = vec4(rgb, 1.0);
}



