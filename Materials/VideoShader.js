import simpleSamplerFragment from '!raw-loader!glslify-loader!../Shaders/videoSamplerFragment.glsl';
import simpleVertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';
import React, { useEffect, useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { useVideoTexture } from '../Video/hooks';
import { isIOS } from '../Utils/BrowserDetection';

export default function VideoShader({ materialRef, sources, shouldPlayVideo, ...props }) {
    const { texture } = useVideoTexture({ sources, shouldPlayVideo })
    const uniforms = useRef()

    useEffect(() => {
        if (texture && !uniforms.current) {
            console.log("SETTING TEXTURE", texture)
            uniforms.current = {
                samplerMap: { value: texture },
                isIOS: { value: isIOS }
            }
        }
    }, [texture])

    // useFrame(() => {
    //     console.log(materialRef.current)
    // })

    return <shaderMaterial
        ref={materialRef}
        uniforms={uniforms.current}
        vertexShader={simpleVertex}
        fragmentShader={simpleSamplerFragment}
        {...props}
    />
}
