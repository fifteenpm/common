varying vec2 vUv;
uniform sampler2D samplerMap;

void main() {
  vec4 samplerTexture = texture2D(samplerMap, vUv);

  // sunset gradient
  vec3 color1 = vec3(0.226,0.000,0.615);
  vec3 color2 = vec3(1.0,0.55,0);
  float mixValue = distance(vUv,vec2(.5,.5));
  vec3 color = mix(color1,color2,mixValue);
  
  // gl_FragColor = vec4(color, samplerTexture.a);
  gl_FragColor = vec4(1., 0., 0., samplerTexture.a);
}
