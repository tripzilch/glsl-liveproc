#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main (void) {
    vec2 st = (-u_resolution.xy + 2.0 * gl_FragCoord.xy) / u_resolution.y; // -1.0 .. 1.0
    vec3 rgb = vec3(1.0, st.x * 0.5 + 0.5, st.y * 0.5 + 0.5);
    gl_FragColor = vec4(rgb,1.);
}
