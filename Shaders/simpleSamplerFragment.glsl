varying vec2 vUv;
uniform sampler2D samplerMap;
uniform float alpha;

void main() {
    vec4 color =  texture2D(samplerMap, vUv);
    gl_FragColor = vec4(color.rgb, alpha);
}
