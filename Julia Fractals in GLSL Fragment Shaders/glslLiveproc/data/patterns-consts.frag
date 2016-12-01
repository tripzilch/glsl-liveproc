#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

#define PI 3.141592653589793
#define TAU (2.0 * PI)
#define PHI 1.618033988749895 // .5 + .5 * 5 ** .5 -- Golden Ratio, the most irrational number

uniform sampler2D texture;

//varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;

void main (void) {
    vec2 wob = sin(count * vec2(0.1, 0.062) + vec2(-0.5,.5));
    vec2 st = zoom * vertTexCoord.st + M + wob * .01;

    gl_FragColor = vec4(vec3(rand_dot_grid(st * 4.0)), 1.0);
}
