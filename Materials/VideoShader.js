import React, { useRef, useEffect } from 'react';

import simpleSamplerFragment from '!raw-loader!glslify-loader!../Shaders/simpleSamplerFragment.glsl'
import simpleVertex from '!raw-loader!glslify-loader!../Shaders/simpleVertex.glsl';


export default function VideoShader({ materialRef, videoMaterial, ...props }) {
    const uniforms = useRef()
    useEffect(() => {
        if (!videoMaterial) return;
        uniforms.current = {
            samplerMap: { value: videoMaterial.map }
        }
    }, [videoMaterial])
    return <shaderMaterial
        ref={materialRef}
        uniforms={uniforms.current}
        vertexShader={simpleVertex}
        fragmentShader={simpleSamplerFragment}
        {...props}
    />
}
