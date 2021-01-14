import waterVertexShader from '!raw-loader!glslify-loader!../Shaders/water1Vertex.glsl';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function WaterMaterial({
    opacity = .5,
    shininess = 60,
    color = 0x0f5e9c,
    specularColor = 0x111111,
    ...props,
}) {
    const uniforms = useRef()

    useEffect(() => {
        uniforms.current = THREE.UniformsUtils.merge([
            THREE.ShaderLib['phong'].uniforms,
            {
                heightmap: { value: null },
                diffuse: { value: color },
                specular: { value: specularColor },
                shininess: { value: shininess },
                transparency: { value: true },
                opacity: { value: opacity }
            }
        ])
    }, [])
    // todo (jeremy) add mouse
    useFrame(() => {

    })
    return <shaderMaterial
        {...props}
        transparent
        vertexShader={waterVertexShader}
        fragmentShader={THREE.ShaderChunk['meshphong_frag']}
    />
}
