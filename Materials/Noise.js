import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from 'react-three-fiber';
import explosion from "../assets/textures/explosion/explosion.png";
import vertex from '!raw-loader!glslify-loader!../Shaders/noiseVertex.glsl';
import fragment from '!raw-loader!glslify-loader!../Shaders/noiseFragment.glsl';
import { set } from 'animejs';


// source: https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
export default function Noise({ materialRef, ...props }) {
	const { mouse } = useThree();
	const noiseScale = useMemo(() => props.noiseScale ? props.noiseScale : .033);
	const alpha = useMemo(() => props.alpha ? props.alpha : 1.)
	const start = useMemo(() => Date.now())
	const uniforms = useRef();
	const pickMap = () => {
		const textureLoader = new THREE.TextureLoader();
		if (props.shaderMap) return props.shaderMap
		if (props.imagePath) return textureLoader.load(props.imagePath)
		return textureLoader.load(explosion)
	}
	// useFrame(() => {
	// 	if (!uniforms.current) return;
	// 	console.log(uniforms.current.map.value.offset)
	// 	uniforms.current.map.value.offset.x -=  .05
	// 	uniforms.current.map.value.offset.y -=  .05
	// 	console.log(uniforms.current.map.value.offset, "------")
    // })

	useEffect(() => {
		const texMap = pickMap()
		const offset = props.offset ? props.offset : {x: 0, y: 0}
		console.log("OFFSET", offset)
		uniforms.current = {
			offset: {
				value: offset,
			},
			map: {
				value: texMap,
			},
			time: {
				value: 0.0,
			},
			noiseScale: {
				value: noiseScale,
			},
			alpha: {
				value: alpha,
			}
		}
	}, [])
	
	useFrame(() => {
		const timeScale = .00009;
		uniforms.current.time.value = timeScale * (Date.now() - start);
	})

	return <shaderMaterial
		ref={materialRef}
		// uniformsNeedUpdate={true}
		uniforms={uniforms.current}
		transparent={alpha < 1. ? true : false}
		wireframe={props.wireframe ? props.wireframe : false}
		vertexShader={vertex}
		fragmentShader={fragment}
		{...props}
	/>;
}
