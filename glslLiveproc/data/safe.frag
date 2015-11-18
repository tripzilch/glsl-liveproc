#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform texOffset; // vec2(1/width,1/height)
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

void main (void) {
    vec3 color;
    float wsum = 0.0, w;

    vec2 st = zoom * vertTexCoord.st + M;
    float c = 0.0;
    for (int i = 1; i < 5; i++) {
        c += 1.0 + sin(st.x * float(i) + st.y * float(i & 5));
    }
    vec3 rgb = vec3(c / 10.0);
    gl_FragColor = vec4(rgb,1.);
}



