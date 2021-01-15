import React, { useMemo } from 'react';
import * as THREE from 'three';
// img src: http://paulbourke.net/geometry/spherical/
import tennisBallMap from '../assets/textures/tennis-ball/tennis-ball.png';
import { tileTextureMaps } from './utils';

export default function TennisBall({ materialRef, ...props }) {
    // https://www.cc0textures.com/view.php?tex=Facade12
    const [colorMap] = useMemo(() => {
        const textureLoader = new THREE.TextureLoader();
        const colorMap = textureLoader.load(tennisBallMap);
        const textureMaps = [colorMap];
        return tileTextureMaps(textureMaps, props);
    });
    return <meshStandardMaterial
        ref={materialRef}
        map={colorMap}
        {...props}
    />;
}
