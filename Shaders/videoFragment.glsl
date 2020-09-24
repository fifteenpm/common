precision mediump float;

varying vec2 vUv;

uniform vec2 resolution;
uniform sampler2D video;

void main()
{
	vec3 foreground = texture2D(iChannel0, vUv).rgb;
	float greenness = 1.0 - (length(foreground - green) / length(vec3(1, 1, 1)));
	float foregroundAlpha = clamp((greenness - 0.8) / 0.1, 0.0, 1.0);
	vec4 color = vec4(foreground * (1.0 - foregroundAlpha), 1. - foregroundAlpha);// + vec4(1., 1., 1., 0.0);
	if (uAddDots){
		color = addDots(color);
	}	
	gl_FragColor = color;
}
