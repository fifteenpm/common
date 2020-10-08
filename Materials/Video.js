import React, { useEffect } from 'react';
import { useVideoTexture } from '../Video/hooks';


export default function Video({ materialRef, sources, canPlay, ...props }) {

    if (!sources) {
        console.error("sources a required prop for Video texture.")
    }
    if (canPlay === undefined) {
        console.error("play is a required prop for Video texture.")
    }

    const { texture } = useVideoTexture({ sources, canPlay })

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
