import React, { useMemo, useEffect } from 'react';
import { useVideoTexture } from '../Video/hooks';


export default function Video({ materialRef, src, play, ...props }) {

    if (!src) {
        console.error("src a required prop for Video texture.")
    }
    if (play === undefined) {
        console.error("play is a required prop for Video texture.")
    }

    const { texture } = useVideoTexture({ src, play })

    return <meshBasicMaterial
        ref={materialRef}
        map={texture}
        {...props}
    />
}
