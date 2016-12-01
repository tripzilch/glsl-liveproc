#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform vec2 M;
uniform float zoom;
uniform vec2 C;

// uniform vec2 pix_size; // vec2(1/width,1/height)
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

const float MAXITER = 150.0;
const float BAILOUT = 16.0;
void main (void) {
    vec2 Z = zoom * vertTexCoord.st + M;
    float i, iter_count = 0.0;

    for (i = 1.0; i < MAXITER; i++) {
        if (length(Z) < BAILOUT) {
            // iterate
            // Z := Z^2 + C
            Z = vec2(
                    Z.x * Z.x - Z.y * Z.y,  // Zr
                    2.0 * Z.x * Z.y         // Zi
                );
            Z += C;
            iter_count = i;
        }
    }

    float grey = (iter_count / MAXITER); // colour based on iteration count

    grey *= step(BAILOUT, length(Z)); // colour inside black

    vec3 color = vec3(grey);
    gl_FragColor = vec4(pow(color, gamma), 1.0);
}
