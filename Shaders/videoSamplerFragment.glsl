varying vec2 vUv;
uniform sampler2D samplerMap;

void main() {
    vec4 color =  texture2D(samplerMap, vUv);
    gl_FragColor = color;
}
