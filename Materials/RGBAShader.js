import vertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';
import fragment from '!raw-loader!glslify-loader!../Shaders/simpleSamplerFragment.glsl';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';



export default function RGBAShader({ materialRef, ...props }) {	
	const uniforms = useRef();
	const pickMap = () => {
		const textureLoader = new THREE.TextureLoader();
		if (props.map) return props.map
		if (props.imagePath) return textureLoader.load(props.imagePath)
	}

	useEffect(() => {
		uniforms.current = {
			samplerMap: {
				value: pickMap(),
			},
		}
	}, [])
	
	return <shaderMaterial
		ref={materialRef}
		uniforms={uniforms.current}
		transparent={true}
		vertexShader={vertex}
		fragmentShader={props.fragment ? props.fragment : fragment}
		{...props}
	/>;
}
