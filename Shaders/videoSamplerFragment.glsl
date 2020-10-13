varying vec2 vUv;
uniform sampler2D samplerMap;
uniform float alpha;
uniform bool isIOS;

void main() {
    vec4 color =  texture2D(samplerMap, vUv);
    if (isIOS){
        color = color.bgra;
    } 
    gl_FragColor = color;
}
