varying vec2 vUv;
uniform sampler2D samplerMap;

void main() {
    gl_FragColor = texture2D(samplerMap, vUv);
}
