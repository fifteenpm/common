varying vec2 vUv;
uniform sampler2D map;
uniform float alpha;
uniform vec2 offset;

  void main() {
    vec2 offsetUV = fract(vUv + offset);
    vec4 color =  texture2D(map, offsetUV);
    gl_FragColor = vec4(color.rgb, alpha);
  }
