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

    return <meshBasicMaterial
        ref={materialRef}
        map={videoTexture}
        {...props}
    />
}
