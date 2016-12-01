#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 M;
uniform float zoom;
uniform vec2 C;
uniform vec2 P;

// uniform vec2 pix_size; // vec2(1/width,1/height)
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

vec3 tex(vec2 p) {
    return pow(texture2D(texture, p + 0.5).xyz, igamma);
}

// vec3 tex_circular(vec3 T, float i) {
//     //return mix(tex(T.xy, i), vec3(0.0), smoothstep(.49, .5, T.z));
//     return mix(tex(T.xy, i), vec3(1.0), smoothstep(.4963, .5, T.z));
// }
//
// vec3 trap(vec2 Z, float i) {
//     vec2 X = (Z - vec2(P)) * .5 * tex_zoom;
//     return vec3(X, length(X));
// }

const float MAXITER = 150.0;
const float BAILOUT = 16.0;
void main (void) {
    vec2 Z = zoom * vertTexCoord.st + M;
    float i, iter_count = 0.0;

    vec3 color = vec3(0.0);
    float minL = length(Z - P);
    for (i = 1.0; i < MAXITER; i++) {
        if (length(Z) < BAILOUT) {
            // iterate
            // Z := Z^2 + C
            Z = vec2(
                    Z.x * Z.x - Z.y * Z.y,  // Zr
                    2.0 * Z.x * Z.y         // Zi
                );
            Z += C;

            // orbit trap!
            float L = length(Z - P);
            if (L < minL) {
                color = mix(tex(Z - P), color, smoothstep(1.4, 1.5, L));
                minL = L;
            }
        }
    }

    color *= step(BAILOUT, length(Z)); // colour inside black

    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
