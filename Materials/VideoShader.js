import simpleSamplerFragment from '!raw-loader!glslify-loader!../Shaders/videoSamplerFragment.glsl';
import simpleVertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';
import React, { useEffect, useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { useVideoTexture } from '../Video/hooks';
import { isIOS } from '../Utils/BrowserDetection';
import useVideoPlayer from '../UI/Player/hooks/useVideoPlayer';

export default function VideoShader({ materialRef, sources, shouldPlayVideo, ...props }) {
    // const {videoTexture} = useVideoPlayer()
    const { videoTexture } = useVideoTexture({ sources, shouldPlayVideo })
    const uniforms = useRef()

    useEffect(() => {
        if (videoTexture && !uniforms.current) {
            console.log("SETTING TEXTURE", videoTexture)
            uniforms.current = {
                samplerMap: { value: videoTexture },
                // isIOS: { value: isIOS }
            }
        }
    }, [videoTexture])

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
