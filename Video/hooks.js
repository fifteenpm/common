// export function useVideoMediaStream({ }) {
//     // https://gist.github.com/askilondz/d618fb2e39f481fd19bf3f8b0476a3b6
//     var mediaSource = new MediaSource();
//     video.src = window.URL.createObjectURL(mediaSource);
//     mediaSource.addEventListener('sourceopen', function () {
//         var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
//         // Get video segments and append them to sourceBuffer.
//         reader.onload = function (e) {
//             sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
//             if (i === NUM_CHUNKS - 1) {
//                 mediaSource.endOfStream();
//             } else {
//                 if (video.paused) {
//                     // start playing after first chunk is appended
//                     video.play();
//                 }
//                 readChunk(++i);
//             }
//         };
//     })
// }

import React, { useMemo, useRef, useEffect, useResource } from "react";
import * as THREE from "three";
import videojs from 'video.js'


// TODO (jeremy) useVideoTexture so that play can be set in a different
// component more easily...
export function useVideoTexture({ src, play, loopPlayer = true }) {

    const [video, player] = useMemo(() => {
        if (!src) return;
        const video = document.createElement("video");
        console.log("ADDING VID TO DOM")
        document.body.appendChild(video);
        video.src = src;
        // video.type = "video/mp4"
        // const player = videojs(video)
        // videojs.Hls.MAX_GOAL_BUFFER_LENGTH = 30;
        const player = window.player = videojs(video, {
            html5: {
                hls: {
                    overrideNative: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
                useDevicePixelRatio: true,

            }
        }, function () {
            console.log("THIS IN CALBACK", this)
            this.off('click');
        });

        player.src({
            type: 'application/x-mpegURL',
            src: video.src,
        });

        player.loop(loopPlayer)

        // player.src(src)
        return [video, player]
    }, [src])



    useEffect(() => {
        if (play) {
            // video.play( 
            console.log(player)
            player.play()
        }
    }, [play])

    // create material from video texture
    let texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    return {
        texture,
    }
};
