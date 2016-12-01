#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;

void main (void) {
    vec3 color;
    color = sin(vertTexCoord.xyy * 8.0 + 1.0) + sin(vertTexCoord.yxx * 7.0 + 2.0);
    color = sin(color * 3.0 - 1.0) + sin(color.yzx * 5.0 - 2.0);
    color = (0.25 * color) + 0.5;
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
