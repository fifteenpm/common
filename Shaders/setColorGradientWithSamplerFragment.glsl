varying vec2 vUv;
// uniform vec3 rgbColor;
uniform sampler2D samplerMap;

void main() {

    vec4 samplerTexture = texture2D(samplerMap, vUv);
    
    //rgb(13, 118, 46)
    // vec3 color1 = vec3(.46,.86,.61);
    vec3 color1 = vec3(.051,.46,.18);
    //rgb(118, 220, 156)
    vec3 color2 = vec3(.0, 0., 0.);
    // vec3 color2 = vec3(.066, .178, .61);
    
    
    float mixValue = distance(vUv,vec2(.5,.5));
    vec3 color = mix(color1,color2,mixValue);
    gl_FragColor = vec4(color, samplerTexture.a);
}
