import { useEffect, useState } from "react";
import * as THREE from "three";
import videojs from 'video.js';
import Hls from 'hls.js';

export function useVideoTexture({
    sources,
    shouldPlayVideo = false,
    loopPlayer = true,
    videoElement = "video",
}) {
    const [video, setVideo] = useState();
    const [player, setPlayer] = useState();
    const [playable, setPlayable ] = useState(false);
    const [texture, setTexture] = useState();
    useEffect(() => {
        if (!sources) return;
        const _video = document.createElement(videoElement);
        document.body.appendChild(_video);
        // vieo.src = src; video.addEventListener('canplaythrough',ready); 

        // note: (jeremy): tried hls.js too but i don't mind maxmimalist
        // approach of video.js e.g. features like fixing low-pixel frames after
        // video loops (see:
        // https://www.heartinternet.uk/blog/streaming-video-on-the-web-a-performance-review-of-popular-javascript-players/)
        const _player = window.player = videojs(_video, {
            autoplay: false,
            preload: "auto",
            // fluid: "true",
            crossorigin: 'anonymous',
            muted: true,
            // controls: true,
            playsinline: true,
            loop: true,
            sources: sources,
            html5: {
                hls: {
                    overrideNative: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
                useDevicePixelRatio: true,
            },
        }, function () {
            this.ready(() => {
                setPlayer(this)
                setVideo(_video)
                setPlayable(true)
            })
        });
    }, [])

            // }
            // document.body.appendChild(video);

    useEffect(() => {
        console.log('playable', playable, 'shouldplay', shouldPlayVideo)
        if (playable && shouldPlayVideo) {
            const promise = player.play()
            console.log("PLAY IS TRIGGERED: Promise:", promise)
            // player.bigPlayButton.show()
            // var promise = document.querySelector(videoElement).play()
            if (promise !== undefined) {
                promise.catch(error => {
                    // Auto-play was prevented
                    console.error("Caught error trying to start video play:", error)
                }).then(() => {
                    console.log("playing... Promise.then:", promise)
                    if (player.paused){
                        console.log("PLAY from paused!",)
                        player.play()
                    }
                    

                })
            }
        }

    }, [video, shouldPlayVideo])

    useEffect(() => {
        if (!video) return
        // create material from video texture
        let tex = new THREE.VideoTexture(video);
        // if (repeat) {
        //     texture.repeat.x = repeat.x;
        //     texture.repeat.y = repeat.y;
        //     texture.wrapS = THREE.ClampToEdgeWrapping;
        //     texture.wrapT = THREE.ClampToEdgeWrapping;
        //   }

        tex.minFilter = THREE.LinearFilter;
        tex.format = THREE.RGBFormat;
        // tex.flipY = false;
        setTexture(tex)
    }, [video])

    return {
        texture,
    }
};
