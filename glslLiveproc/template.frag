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

void main (void) {
    //vec2 eps = vec2(pixsize * 0.5, 0.);
    vec3 color;
    float wsum = 0.0, w;

    vec2 st = zoom * vertTexCoord.st + M;

    vec3 rgb = vec3(1.0, st.x * 0.5 + 0.5, st.y * 0.5 + 0.5);
    gl_FragColor = vec4(rgb,1.);
}
