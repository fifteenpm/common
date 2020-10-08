import { useEffect, useState } from "react";
import * as THREE from "three";
import videojs from 'video.js';

export function useVideoTexture({
    sources,
    canPlay = false,
    loopPlayer = true,
    videoElement = "video",
}) {
    const [video, setVideo] = useState();
    const [player, setPlayer] = useState();
    const [texture, setTexture] = useState();
    useEffect(() => {
        if (!sources) return;
        const _video = document.createElement(videoElement);
        document.body.appendChild(_video);
        // video.src = src;
        // video.addEventListener('canplaythrough',ready);
        const _player = window.player = videojs(_video, {
            autoplay: true,//false, //true,
            // preload: false,//"auto",
            // fluid: "true",
            muted: true,
            controls: true,
            playsinline: true,
            sources: sources,
            html5: {
                hls: {
                    overrideNative: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
                useDevicePixelRatio: true,
            },
            // vhs: {
            //     playsinline: true,
            // }

        }, function () {
            // console.log("THIS IN CALBACK", this)

            // this.off('click');
        });
        // player.playsinline(true)
        // player.src({
        //     type: 'application/x-mpegURL',
        //     src: src,
        // });
        _player.loop(loopPlayer)
        setPlayer(_player)
        setVideo(_video)
    }, [sources])


    useEffect(() => {
        if (player && canPlay) {
            const promise = player.play()
            console.log("RETURN TRUE!!!", promise)
            // player.bigPlayButton.show()
            // var promise = document.querySelector(videoElement).play()
            // if (promise !== undefined) {
            //     promise.catch(error => {
            //         //         // Auto-play was prevented
            //         //         // Show a UI element to let the user manually start playback
            //         //         // console.log("UHM HERE WE ARE?")
            //         console.error("Caught error trying to start video play:", error)
            //         //         player.bigPlayButton.show();
            //         //         // alert('blah')
            //     }).then(() => {
            //         console.log("IN THEN OF PROMISE!", promise.state, promise)

            //         // if (promise.state != "fulfilled") {
            //         setTimeout(() => {
            //             console.log("tryin to restart the player")
            //             // player.pause()
            //             player.play()
            //         }, 3000)
            //     })
                //             // Auto-play started
                //             player.bigPlayButton.show()i
                //             console.log("Now it should play?", player, video)

            // }
        }

    }, [player, canPlay])


    useEffect(() => {
        if (!video) return
        // create material from video texture
        let tex = new THREE.VideoTexture(video);
        tex.minFilter = THREE.LinearFilter;
        tex.format = THREE.RGBFormat;
        setTexture(tex)
    }, [video])

    return {
        texture,
    }
};
