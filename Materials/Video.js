import React, { useEffect } from 'react';
import { useVideoTexture } from '../Video/hooks';


export default function Video({ materialRef, sources, shouldPlayVideo, ...props }) {

    const { texture } = useVideoTexture({ sources, shouldPlayVideo })

    useEffect(() => {
        if (texture) {
            materialRef.current.map = texture;
        }
    }, [texture])

    return <meshBasicMaterial
        ref={materialRef}
        map={texture}
        {...props}
    />
}
