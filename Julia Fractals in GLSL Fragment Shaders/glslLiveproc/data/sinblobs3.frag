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
    color = sin(vertTexCoord.xyy * 1.3 + 1.0) + sin(vertTexCoord.yxx * 1.3 + 2.0);
    color = sin(color.xyz * 1.5 - 1.1) + sin(color.yzx * 1.6 - 1.9);
    color = sin(color.zxy * 1.3 - 1.3) + sin(color.xyz * 1.3 - 2.3);
    color = sin(color.zyx * 1.4 - 1.5) + sin(color.xzy * 1.2 - 1.6);
    color = sin(color.xzy * 1.2 - 1.7) + sin(color.zyx * 1.1 - 1.2);
    color = (0.25 * color) + 0.5;
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
