import React, { useMemo } from 'react';
import * as THREE from 'three';
import { cloudEnvMap, tileTextureMaps } from './utils';
import diffuse from "../assets/textures/surface-imperfections08/SurfaceImperfections08_var1.jpg";
import glossiness from "../assets/textures/surface-imperfections08/SurfaceImperfections08_var1.jpg";
import normal from "../assets/textures/surface-imperfections08/SurfaceImperfections08_nrm.jpg";

export default function SurfaceImperfections08({ materialRef, ...props }) {
    const [diffuseMap, glossinessMap, normalMap, envMap] = useMemo(() => {
        const textureLoader = new THREE.TextureLoader();
        const diffuseMap = textureLoader.load(diffuse);
        const glossinessMap = textureLoader.load(glossiness);
        const normalMap = textureLoader.load(normal);
        const envMap = props.envMapURL ? textureLoader.load(envMapUrl) : cloudEnvMap();
        const textureMaps = [diffuseMap, glossinessMap, normalMap, envMap];
        return tileTextureMaps(textureMaps, props);
    });
    return <meshStandardMaterial
        ref={materialRef}
        map={diffuseMap}
        roughnessMap={glossinessMap}
        // roughness={0.1}
        normalMap={normalMap}
        envMap={envMap}
        // roughness={-1} // invert roughness to get glossiness
        {...props}
    />;
}
