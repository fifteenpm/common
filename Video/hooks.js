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
    const [texture, setTexture] = useState();
    useEffect(() => {
        if (!sources) return;
        const _video = document.createElement(videoElement);
        _video.crossOrigin = "anonymous"
        _video.playsinline = true
        // _video.setAttribute('webkit-playsinline', 'webkit-playsinline');



        // document.body.appendChild(_video);
        // // video.src = src;
        // // video.addEventListener('shouldPlayVideothrough',ready);
        // const _player = window.player = videojs(_video, {
        //     // autoplay: true,//false,
        //     // preload: false,//"auto",
        //     // fluid: true,
        //     muted: true,
        //     // reportTouchActivity: true,
        //     // evented: true,
        //     // controls: true,
        //     playsinline: true,
        //     sources: sources,
        //     html5: {
        //         hls: {
        //             overrideNative: true,
        //         },
        //         nativeAudioTracks: false,
        //         nativeVideoTracks: false,
        //         // useDevicePixelRatio: true,
        //     },
        // }, function () {
        //     // console.log("videojs callback", JSON.stringify(this, null, 4))
        //     // this.off('click');
        // });
        // _player.loop(loopPlayer)
        // setPlayer(_player)
        setVideo(_video)

    }, [sources])


    // useEffect(() => {
    //     if (shouldPlayVideo && player && player.paused()) {
    //         player.ready(function () {
    //             // video.addEventListener("loadedmetadata", () => {
    //             var promise = player.play();
    //             if (promise !== undefined) {
    //                 promise.then(function () {
    //                     // Autoplay started!
    //                     console.log("playing!")
    //                 }).catch(function (error) {
    //                     // Autoplay was prevented.
    //                     console.log("playing prevented :(", error)
    //                     // alert('bah')
    //                     // player.play()
    //                 });
    //             }
    //             // })

    //         });
    //     }
    // }, [player, shouldPlayVideo])


    // ok found the main issue: hls really isn't going to work with webgl on ios: https://stackoverflow.com/a/43684752
    // so need to do mp4 for ios

    useEffect(() => {
        if (!video || !shouldPlayVideo) return;
        if (Hls.isSupported()) {
            var hls = new Hls();
            console.log("SOURCES", sources)
            hls.loadSource(sources.hls.src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.log("MANIFEST PARSED -  PLAY")
                video.play();
            });
        }
        // hls.js is not supported on platforms that do not have Media Source
        // Extensions (MSE) enabled.
        // 
        // When the browser has built-in HLS support (check using `canPlayType`),
        // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
        // element through the `src` property. This is using the built-in support
        // of the plain video element, without using hls.js.
        // 
        // Note: it would be more normal to wait on the 'canplay' event below however
        // on Safari (where you are most likely to find built-in HLS support) the
        // video.src URL must be on the user-driven white-list before a 'canplay'
        // event will be emitted; the last video event that can be reliably
        // listened-for when the URL is not on the white-list is 'loadedmetadata'.
        else {//} if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // TODO webm    
            // video.src = sources.mp4.src;
            // console.log("SOURCE!", video.src)

            // video.codecs = "avc1.4D401E, mp4a.40.2";
            video.playsInline = true;
            video.post = "https://dummyimage.com/320x240/ffffff/fff";
            video.crossOrigin = 'anonymous';
            video.loop = true;
            video.muted = true;
            video.volume = 0;
            // video.playbackRate = playbackRate;
            // for (let i = 0; i < sources.length; i++) {
            
            const mp4Src = document.createElement("source");
            console.log("SETTING SOURCE ATTRIBTUES: ", sources.mp4, sources.webm)
            mp4Src.setAttribute("src", sources.mp4.src);
            mp4Src.setAttribute("type", sources.mp4.type);
            video.appendChild(mp4Src);
            const webmSrc = document.createElement("source");
            webmSrc.setAttribute("src", sources.webm.src);
            webmSrc.setAttribute("type", sources.webm.type);
            video.appendChild(webmSrc);

            // }
            document.body.appendChild(video);

            // create material from video texture

            // video.addEventListener('loadedmetadata', function () {
            // console.log("LOADED METADATA _PLAY")
            console.log(video)

            video.addEventListener("canplay", () => {
                // state.videoPlayer.media.playsinline = true;
                console.log("PLAY!")
                video.play();
                // state.videoPlayer.mesh.visible = true;
            });

            const promise = video.play();
            console.log("promise?", promise)
            // });
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
