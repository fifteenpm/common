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
    color = new THREE.Color(0x0f5e9c),
    specularColor = new THREE.Color(0x111111),
    waterOpacity = 0.5,
    waterWidth = 128,
    waterBounds = 512,
    ...props
}) {
    const shaderUniforms = useRef()
    const heightMapUniforms = useRef({})
    const heightmapVariable = useRef()
    const gpuCompute = useRef()
    const { gl } = useThree()
    const mousePos = useRef(new THREE.Vector2(0, 0))
    useEffect(() => {
        shaderUniforms.current = THREE.UniformsUtils.merge([
            THREE.ShaderLib['phong'].uniforms,
            {
                heightmap: { value: null },
                diffuse: { value: color },
                specular: { value: specularColor },
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
        // heightmapVariable.material.uniforms.mousePos = { value: mousePos.current };
        // heightmapVariable.material.uniforms.mouseSize = { value: 20.0 };
        // heightmapVariable.material.uniforms.viscosityConstant = { value: 0.03 };
        // heightmapVariable.material.defines.BOUNDS = waterBounds.toFixed(1);
        heightMapUniforms.current = {
            mousePos: { value: mousePos.current },
            mouseSize: { value: 20.0 },
            viscosityConstant: { value: 0.03 },
        }
        heightmapVariable.current.material.uniforms = heightMapUniforms.current
        heightmapVariable.current.material.defines.BOUNDS = waterBounds.toFixed(1);

        const error = gpuCompute.current.init();
        if (error !== null) {
            console.error(error);
        }
    }, [])

    function fillTexture(heightmap0) {
        const simplex = new SimplexNoise();
        const waterMaxHeight = 19;
        const waveRippleFactor = 0.95;
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
        // console.log("RAY", raycaster)
        // const uniforms = heightmapVariable.material.uniforms;
        if (!gpuCompute.current) return;

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
        fragmentShader={THREE.ShaderChunk['meshphong_frag']}
    />
}
