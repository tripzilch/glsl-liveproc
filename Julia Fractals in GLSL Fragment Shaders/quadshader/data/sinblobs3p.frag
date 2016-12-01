#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 mouse;
uniform float frameCount;

varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;

void main (void) {
    vec3 color;
    vec2 p = vertTexCoord.xy - mouse * 0.01;
    vec3 t = frameCount * vec3(0.05, -0.23, .02);

    color = sin(p.xyy * 1.8 + 1.0) + sin(p.yxx * 1.9 + 2.0);
    color = sin(color.xyz * 1.5 - 1.1) + sin(color.yzx * 1.6 - 1.9);
    color = sin(color.zxy * 1.3 - 1.3) + sin(color.xyz * 1.3 - 2.3 + t);
    color = sin(color.zyx * 2.4 - 1.5) + sin(color.xzy * 2.2 - 1.6);
    color = sin(color.xzy * 1.2 - 1.7 - t.zxy) + sin(color.zyx * 1.1 - 0.2 * t.yzx);
    color = (0.25 * color) + 0.5;
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
