#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;

void main (void) {
    vec3 color = vec3(1.0, 0.0, 0.0);
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
