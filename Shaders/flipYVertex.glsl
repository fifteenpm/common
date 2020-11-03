precision mediump float;

varying vec2 vUv;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = vec2(uv.s, 1.0 - uv.t);
}

