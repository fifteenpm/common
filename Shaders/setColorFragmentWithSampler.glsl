varying vec2 vUv;
uniform vec3 rgbColor;
uniform sampler2D samplerMap;

void main() {
    vec4 samplerTexture = texture2D(samplerMap, vUv);
    gl_FragColor = vec4(rgbColor, samplerTexture.a);
}
