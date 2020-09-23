import React, { useEffect, useState } from 'react';
import { useResource } from 'react-three-fiber';
import * as THREE from 'three';
import clothingEnv from '../assets/textures/env-maps/color-spectrum.png';
import NaiveGlass from './NaiveGlass';
import PolishedSpeckledMarbleTop from './PolishedSpeckledMarbleTop';
import FoamGrip from './FoamGrip';
import { Sunflare } from './Sunflare';

const MaterialsContext = React.createContext([{}, () => { }]);

const MaterialsProvider = ({ activeMaterialNames, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [polishedSpeckledMarbleTopRef, polishedSpeckledMarbleTop] = useResource();
    const [platformPolishedSpeckledMarbleTopRef, platformPolishedSpeckledMarbleTop] = useResource();
    const [naiveGlassRef, naiveGlass] = useResource();
    // const [naiveGlass2Ref, naiveGlass2] = useResource();
    const [sunflareRef, sunflare] = useResource();
    const [foamGripRef, foamGrip] = useResource();
    const [activeMaterials, setActiveMaterials] = useState()

    const materials = {
        polishedSpeckledMarbleTop,
        platformPolishedSpeckledMarbleTop,
        naiveGlass,
        // naiveGlass2,
        sunflare,
        foamGrip,
    }

    useEffect(() => {
        if (!activeMaterialNames) return;
        const activeMaterialsLookup = {};
        for (const name in activeMaterialNames) {
            for (const material in materials) {
                if (material.constructor.name == name) {
                    activeMaterialsLookup[name] = material
                }
            }
        }
        setActiveMaterials(activeMaterialNames)
    }, [activeMaterialNames])

    useEffect(() => {
        const allMats = Object.values(materials);
        const loadedMats = allMats.filter(mat => mat);
        setLoaded(allMats.length == loadedMats.length);
    })

    return <MaterialsContext.Provider value={{ loaded, ...materials }}>
        <FoamGrip
            materialRef={foamGripRef}
            useAOGreen={true}
            useDarkEnv={true}
        />
        <PolishedSpeckledMarbleTop
            materialRef={polishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 16, y: 16 }}
            skinning={true}
        // useMetallicLight={true}
        // useAlbedoGreen={true}
        />
        <PolishedSpeckledMarbleTop
            materialRef={platformPolishedSpeckledMarbleTopRef}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.BackSide}
            // useMetallicLight={true}
            // useAlbedoGreen={true}
            useEnvMap={false}
        />
        <Sunflare
            materialRef={sunflareRef}
            transparent={true}
            textureRepeat={{ x: 8, y: 8 }}
            side={THREE.DoubleSide}
        />
        <NaiveGlass
            materialRef={naiveGlassRef}
            skinning={true}
            envMapURL={clothingEnv}
        />
        {/* <NaiveGlass
            materialRef={naiveGlass2Ref}
            skinning={true}
        /> */}
        {props.children}
    </MaterialsContext.Provider>
}

export { MaterialsContext, MaterialsProvider };

