import React, { useMemo, useRef, useEffect } from 'react';
import {useFrame} from 'react-three-fiber';
import simpleSamplerFragment from '!raw-loader!glslify-loader!../Shaders/simpleSamplerFragment.glsl'
import noiseVertex from '!raw-loader!glslify-loader!../Shaders/noiseVertex.glsl';


export default function VideoNoiseShader({ materialRef, videoMaterial, ...props }) {
    const noiseScale = useMemo(() => props.noiseScale ? props.noiseScale : .033);
	const alpha = useMemo(() => props.alpha ? props.alpha : 1.)
	const start = useMemo(() => Date.now())
    const uniforms = useRef()
    const timeScale = useMemo(() => props.timeScale ? props.timeScale : .00009)
    useEffect(() => {
        if (!videoMaterial) return;
        uniforms.current = {
            samplerMap: { value: videoMaterial.map },
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
    }, [videoMaterial])
    useFrame(() => {
		
		uniforms.current.time.value = timeScale * (Date.now() - start);
	})

    return <shaderMaterial
        ref={materialRef}
        transparent={alpha < 1. ? true : false}
        uniforms={uniforms.current}
        vertexShader={noiseVertex}
        fragmentShader={simpleSamplerFragment}
        {...props}
    />
}
