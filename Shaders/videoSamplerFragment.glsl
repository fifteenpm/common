precision mediump float;

varying vec2 vUv;
uniform sampler2D samplerMap;
uniform vec2 offset;

void main() {
    vec2 offsetUV = fract(vUv + offset);
    vec4 color =  texture2D(samplerMap, offsetUV);
    gl_FragColor = color;
}
