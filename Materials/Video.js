import React, { useMemo, useEffect } from 'react';
import { createVideoTexture } from '../Video/Video';

export default function Video({ materialRef, src, play, ...props }) {

    if (!src) {
        console.error("src a required prop for Video texture.")
    }
    if (play === undefined) {
        console.error("play is a required prop for Video texture.")
    }

    const videoTexture = useMemo(() => { return createVideoTexture({ src, play }) })

    useEffect(() => {
        if (!materialRef.current) return;
        console.log("ratio", materialRef.current, materialRef.current.map.image.videoWidth, materialRef.current.map.image.videoHeight)
    }, [materialRef])

    return <meshBasicMaterial
        ref={materialRef}
        map={videoTexture}
        {...props}
    />
}
