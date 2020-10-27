import videoSamplerFragment from '!raw-loader!glslify-loader!../Shaders/videoSamplerFragment.glsl';
import simpleVertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';
import flipYVertex from'!raw-loader!glslify-loader!../Shaders/flipYVertex.glsl'; 
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useVideoPlayer from '../UI/Player/hooks/useVideoPlayer';


export default function VideoShader({ materialRef, ...props }) {
    const { videoTexture } = useVideoPlayer()
    const uniforms = useRef()

    useEffect(() => {
        if (videoTexture && !uniforms.current) {
            uniforms.current = {
                samplerMap: { value: videoTexture },
                offset: { value: props.offset ? props.offset : new THREE.Vector2(0.0, 0.0) },
                // sample
            }
        }
    }, [videoTexture])


    return <shaderMaterial
        ref={materialRef}
        uniforms={uniforms.current}
        vertexShader={props.flipY ? flipYVertex : simpleVertex}
        fragmentShader={videoSamplerFragment}
        {...props}
    />
}
