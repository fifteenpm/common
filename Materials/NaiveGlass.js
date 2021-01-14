import React, { useMemo } from 'react';
import * as THREE from 'three';
import env from "../assets/textures/env-maps/optical-illusion.png"

export default function NaiveGlass({ materialRef, flipY=true, ...props }) {
    const envMap = useMemo(() => {
        const textureLoader = new THREE.TextureLoader();
        const envMap = props.envMapURL ? textureLoader.load(props.envMapURL) : textureLoader.load(env);
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        envMap.encoding = THREE.sRGBEncoding;
        envMap.flipY = flipY;
        return envMap;
    })
    return <meshPhongMaterial
        ref={materialRef}
        {...props}
        side={THREE.DoubleSide}
        color={props.color ? props.color : "white"}
        shininess={props.shininess ? props.shininess : 30}
        opacity={props.opacity ? props.opacity : .5}
        map={envMap}
        envMap={envMap}
        transparent={true}
        combine={THREE.MixOperation}
    />
}
