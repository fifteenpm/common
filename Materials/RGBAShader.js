import vertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';
import fragment from '!raw-loader!glslify-loader!../Shaders/setColorGradientWithSamplerFragment.glsl';
import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';



export default function RGBAShader({ materialRef, ...props }) {
	const uniforms = useRef();
	const pickMap = () => {
		const textureLoader = new THREE.TextureLoader();
		if (props.map) return props.map
		if (props.imagePath) return textureLoader.load(props.imagePath)
	}
	// const onBeforeCompile = useCallback((shader) => {
	// 	const textureLoader = new THREE.TextureLoader();
	// 	// uniforms.current = shader.uniforms;
	// 	// uniforms.current.samplesMap

	// 	shader.vertexShader = shader.vertexShader.replace(
	// 		`varying vec3 vLightFront;`,

	// 		`varying vec3 vLightFront;
	// 		varying vec2 vUv;`
	// 	)
	// 	// shader.vertexShader = shader.vertexShader.replace(
	// 	// 	'#include <begin_vertex>',
	// 	// 	`#include <begin_vertex>;
	// 	// 	// mvPosition = modelViewMatrix * vec4(position, 1.);
	// 	// 	gl_Position = projectionMatrix * mvPosition;
	// 	// 	vUv = uv;`
	// 	// )// vertex)

	// 	shader.fragmentShader = shader.fragmentShader.replace(
	// 		'uniform vec3 diffuse;',
	// 		`
	// 		uniform vec3 diffuse;
	// 		varying vec2 vUv;
	// 		uniform sampler2D samplerMap;
	// 		`
	// 	)
	// 	shader.fragmentShader = shader.fragmentShader.replace(
	// 		"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
	// 		// todo - add back outgoingLight
	// 		`
	// 		vec4 samplerTexture = texture2D(samplerMap, vUv);
	// 		gl_FragColor = vec4(outgoingLight.rgb, samplerTexture.a);`
	// 	)
	// 	// sunset gradient
	// 	//vec3 color1 = vec3(0.226,0.000,0.615);
	// 	//vec3 color2 = vec3(1.0,0.55,0);
	// 	//float mixValue = distance(vUv,vec2(.5,.5));
	// 	//vec3 color = mix(color1,color2,mixValue);

	// 	//vec3 colorWithLight = color + outgoingLight
	// 	//gl_FragColor = vec4(colorWithLight, samplerTexture.a);
	//     shader.uniforms.samplerMap = { value: textureLoader.load(props.imagePath) };
	// }, [])
	useEffect(() => {
		const textureLoader = new THREE.TextureLoader();
		uniforms.current = {
			samplerMap: {
				value: textureLoader.load(props.imagePath),
			},
			rgbColor: {
				value: new THREE.Vector3(0., 1., 0),
			},
		}
	}, [])

	return <shaderMaterial
		ref={materialRef}
		uniforms={uniforms.current}
		transparent={true}
		vertexShader={vertex}
		fragmentShader={fragment}
		{...props}
	/>;

	// return <meshLambertMaterial ref={materialRef} transparent 
	// onBeforeCompile={onBeforeCompile}
	// shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
	// shader.vertexShader = shader.vertexShader.replace(
	// 	'#include <begin_vertex>',
	// 	[
	// 		`float theta = sin( time + position.y ) / ${ amount.toFixed( 1 ) };`,
	// 		'float c = cos( theta );',
	// 		'float s = sin( theta );',
	// 		'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
	// 		'vec3 transformed = vec3( position ) * m;',
	// 		'vNormal = vNormal * m;'
	// 	].join( '\n' )
	// );

	// material.userData.shader = shader;

	// }}


	// />
}
