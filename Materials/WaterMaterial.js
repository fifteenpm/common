import waterVertexShader from '!raw-loader!glslify-loader!../Shaders/water1Vertex.glsl';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from 'react-three-fiber'
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";
import heightMapFragmentShader from '!raw-loader!glslify-loader!../../Common/Shaders/water1Height.glsl';
import { useMemo } from 'react';
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

export default function WaterMaterial({
    materialRef,
    opacity = .5,
    shininess = 60,
    color = 0x0f5e9c,
    specularColor = 0x111111,
    waterOpacity = 0.5,
    waterWidth = 128,
    waterBounds = 512,
    waterMaxHeight = .1,
    mouseSize = 5,
    viscosityConstant = 0.001,
    ...props
}) {
    const gpuCompute = useRef()
    const shaderUniforms = useRef()
    const heightMapUniforms = useRef({})
    const heightmapVariable = useRef()
    const heightmapMaterialUniforms = useRef()
    // const gpuCompute = useRef()
    const { gl } = useThree()
    const disturbancePos = useRef(new THREE.Vector2(0, 0))

    useEffect(() => {
        shaderUniforms.current = THREE.UniformsUtils.merge([
            THREE.ShaderLib['phong'].uniforms,
            {
                heightmap: { value: null },
                diffuse: { value: new THREE.Color(color) },
                specular: { value: new THREE.Color(specularColor) },
                shininess: { value: shininess },
                // todo (jeremy) this is copied from yahceph so...
                transparency: true,
                opacity: { value: waterOpacity },

            }
        ])
    }, [])
    useEffect(() => {
        if (!materialRef.current) return
        materialRef.current.defines.WIDTH = waterWidth.toFixed(1)
        materialRef.current.defines.BOUNDS = waterBounds.toFixed(1)
    }, [materialRef.current])
    useEffect(() => {
        gpuCompute.current = new GPUComputationRenderer(waterWidth, waterWidth, gl);
        const heightmap0 = gpuCompute.current.createTexture();
        fillTexture(heightmap0)
        heightmapVariable.current = gpuCompute.current.addVariable("heightmap", heightMapFragmentShader, heightmap0);
        gpuCompute.current.setVariableDependencies(heightmapVariable.current, [heightmapVariable.current]);
        // TODO (jeremy) this is original pattern
        // heightmapVariable.current.material.uniforms.mousePos = { value: disturbancePos.current };
        // heightmapVariable.current.material.uniforms.mouseSize = { value: 20.0 };
        // heightmapVariable.current.material.uniforms.viscosityConstant = { value: 0.03 };
        // heightmapVariable.current.material.defines.BOUNDS = waterBounds.toFixed(1);
        heightmapMaterialUniforms.current = {
            mousePos: { value: disturbancePos.current },
            mouseSize: { value: mouseSize },
            viscosityConstant: { value: viscosityConstant },
        }
        heightmapVariable.current.material.uniforms = heightmapMaterialUniforms.current
        heightmapVariable.current.material.defines.BOUNDS = waterBounds.toFixed(1);

        const error = gpuCompute.current.init();
        if (error !== null) {
            console.error(error);
        }
        
    }, [])

    function fillTexture(heightmap0) {
        const simplex = new SimplexNoise();
        const waveRippleFactor = 0.095;
        const TEXTURE_WIDTH = waterWidth / 2;

        function noise(x, y, z) {
            var multR = waterMaxHeight;
            var mult = 0.025;
            var r = 0;
            for (var i = 0; i < 15; i++) {
                r += multR * simplex.noise(x * mult, y * mult);
                multR *= 0.53 + 0.025 * i;
                mult *= waveRippleFactor;
            }
            return r;
        }

        var pixels = heightmap0.image.data;

        var p = 0;
        for (var j = 0; j < TEXTURE_WIDTH; j++) {
            for (var i = 0; i < TEXTURE_WIDTH; i++) {

                var x = i * 128 / TEXTURE_WIDTH;
                var y = j * 128 / TEXTURE_WIDTH;

                pixels[p + 0] = noise(x, y, 123.4);
                pixels[p + 1] = 0;
                pixels[p + 2] = 0;
                pixels[p + 3] = 1;

                p += 4;
            }
        }
    }
    const { mouse, raycaster } = useThree()
    useFrame(() => {
        if (!gpuCompute.current) return;
        heightmapMaterialUniforms.current.mousePos.value.set(
            disturbancePos.current.x,
            disturbancePos.current.y,
        )
        gpuCompute.current.compute();
        shaderUniforms.current.heightmap.value = gpuCompute.current.getCurrentRenderTarget(heightmapVariable.current).texture;
    })

    return <shaderMaterial
        {...props}
        ref={materialRef}
        lights
        transparent
        diffuse={color}
        value={specularColor}
        shininess={shininess}
        opacity={opacity}
        uniforms={shaderUniforms.current}
        vertexShader={waterVertexShader}
        userData={{ disturbancePos: disturbancePos }}
        fragmentShader={THREE.ShaderChunk['meshphong_frag']}
    />
}
