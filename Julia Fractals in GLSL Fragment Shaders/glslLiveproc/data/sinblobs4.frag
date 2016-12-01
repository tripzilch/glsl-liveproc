#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 M;
uniform float zoom;
// uniform vec2 pix_size; // vec2(1/width,1/height)
// uniform vec2 C;
// uniform vec2 P;
// uniform float min_iter;
// uniform float count;
// uniform uint ucount;
// uniform float tex_zoom;
// uniform float tex_angle;
// uniform float alpha;
// uniform float jitter_amount;


varying vec4 vertTexCoord;

const vec3 igamma = vec3(2.2);
const vec3 gamma = 1.0 / igamma;

void main (void) {
    vec2 p = zoom * vertTexCoord.st + M;
    vec3 wobl;
    wobl = sin(   p.xyy * 0.618 + 0.0) + sin(   p.yxx * 1.000 + 3.0);
    wobl = sin(wobl.xyz * 1.174 - 1.1) + sin(wobl.yzx * 3.604 - 1.9);
    wobl = sin(wobl.zxy * 1.378 - 1.3 + 0.21 * p.yxx) + sin(wobl.xyz * 3.070 - 2.3 + 0.22 * p.yxy);
    wobl = sin(wobl.zyx * 1.617 - 1.5 + 0.22 * p.xxy) + sin(wobl.xzy * 2.616 - 1.6 + 0.23 * p.yxy);
    wobl = sin(wobl.xzy * 1.898 - 1.7 + 0.28 * p.xyy) + sin(wobl.zyx * 2.228 - 1.2 + 0.27 * p.yxx);
    wobl = 0.25 * wobl + 0.5; // wobl is now in range 0..1

    vec3 color = wobl.xxy + vec3(-0.2, 0.0, 0.2) * wobl.zyx;
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
