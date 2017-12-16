#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_TEXTURE_SHADER
uniform sampler2D texture;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const vec3 gamma = vec3(0.45);
const vec3 igamma = 1.0 / gamma;
const float MAXITER = 150.;
const float BAILOUT = 4096.;

void main () {
    vec2 st = (-u_resolution.xy + 2.0 * gl_FragCoord.xy) / u_resolution.y;

    //vec2 C = 2.0 * (-u_resolution.xy + 2.0 * u_mouse.xy) / u_resolution.y;
    vec2 C =
        2.0 * (-u_resolution.xy + 2.0 * u_mouse.xy) / u_resolution.y;
        // vec2(-0.75, 0.); // neck
        // vec2(-.4, .6); // stars
        // vec2(.285, 0.); // brain
        // vec2(.285, 0.01); // brain2
        // vec2(-.71, .22); // dragon1
        // vec2(-.835, -.232); // dragon2
        // vec2(-.8, .156); // dragon3
    // C += sin(u_time * vec2(0.72, 0.91)) * 0.15;
    //C += sin(u_time * vec2(0.72, 0.41));
    //C += sin(u_time * vec2(0.53, 0.67));
    //C += sin(u_time * vec2(0.25, 0.41));
    //C += sin(u_time * vec2(0.32, 0.23));
    //C *= 0.4;
    vec2 Z = 1.5 * st, Zo;
    vec3 color = vec3(0.0);
    float wsum = 0.0;
    float Zmag2 = dot(Z,Z), Zomag2;
    float weight, shade;
    vec2 cp;

    float on = 1.0;
    float i;
    for (i = 1.; i < MAXITER; i++) {
        if (Zmag2 < BAILOUT) {
            // iterate
            Zo = Z; Zomag2 = Zmag2;
            Z = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y) + C;
            Zmag2 = dot(Z,Z);
            // accumulate
            weight = pow(1.0 + Zmag2, -5.) * pow(i, 1.0);
            shade = smoothstep(-1., 1., dot(normalize(Z), normalize(Zo))) / pow(i, .5);
            cp = normalize(Z.xyxy - Zo.xyxy).xy;
            wsum += weight;
            color += weight * pow(texture2D(texture, .5 + .5 * cp).xyz, igamma) * shade;
        }
    }

    vec3 rgb = (color / wsum) * .5;
    gl_FragColor = vec4(pow(rgb, gamma), 1.0);
}
