import videojs from 'video.js';
import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
// import { loadVideoMesh } from "../../../Utils/LegacyLoaders";
import Hls from 'hls.js'
import { isIOS } from '../../Utils/BrowserDetection'
// const useVideoTexture = ({ videoElement }) => {
//   // initialize video element
//   // create material from video texture
//   let texture = new THREE.VideoTexture(videoElement);
//   texture.minFilter = THREE.LinearFilter;
//   texture.format = THREE.RGBFormat;
//   return {
//     videoTexture: texture,
//   }

// }

// const useVideo = ({ sources, loop = true, muted = true, volume = 1, playbackRate = 1.0, ...props }) => {
//   const [videoTexture, videoElement] = useMemo(() => {

//     const element = document.createElement("video")
//     element.codecs = "avc1.4D401E, mp4a.40.2";
//     element.playsInline = true;
//     element.post = "https://dummyimage.com/320x240/ffffff/fff";
//     element.crossOrigin = 'anonymous';
//     element.loop = loop;
//     element.muted = muted;
//     element.volume = volume;
//     element.playbackRate = playbackRate;
//     for (let i = 0; i < sources.length; i++) {
//       /* First source element creation */
//       let src = document.createElement("source");
//       // Attribute settings for my first source
//       src.setAttribute("src", sources[i].src);
//       src.setAttribute("type", sources[i].type);
//       element.appendChild(src);
//     }
//     document.body.appendChild(element);
//     let tex = new THREE.VideoTexture(element);
//     tex.minFilter = THREE.LinearFilter;
//     tex.format = THREE.RGBFormat;
//     return [tex, element];
//   });



//   return {
//     videoTexture,
//     videoElement
//   }
// }

const VideoPlayerContext = React.createContext([{}, () => { }]);

const VideoPlayerProvider = ({ tracks, curIdx = 0, loop = true, muted = false, volume = 1, playbackRate = 1.0, ...props }) => {

  // const { videoElement, videoTexture } = useVideo({ sources: tracks[curIdx].sources })
  // const { videoTexture } = useVideoTexture({ videoElement });
  const { videoTexture, videoElement, videoPlayer } = useMemo(() => {

    const videoElement = document.createElement("video")
    videoElement.codecs = "avc1.4D401E, mp4a.40.2";
    videoElement.playsInline = true;
    videoElement.post = "https://dummyimage.com/320x240/ffffff/fff";
    videoElement.crossOrigin = 'anonymous';
    videoElement.loop = loop;
    videoElement.muted = muted;
    videoElement.volume = volume;
    videoElement.playbackRate = playbackRate;

    // todo temp
    const sources = tracks[curIdx].sources;

    // todo does placement of this command matter
    document.body.appendChild(videoElement);
    
    // add texture
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    let videoPlayer = undefined;
    // TODO (jeremy) hls + ios + canvas incompatable atm
    // see: https://bugs.webkit.org/show_bug.cgi?id=179417
    console.log("isIOS", isIOS)
    console.log("Hls.isSupported:", Hls.isSupported())
    console.log("sources:", sources)
    if (isIOS || !Hls.isSupported() || !sources.hls) {
      console.log("ADDING SOURCES (NON HLS)")
      for (let i = 0; i < sources.nonHLS.length; i++) {
        /* First source videoElement creation */
        let src = document.createElement("source");
        // Attribute settings for my first source
        src.setAttribute("src", sources.nonHLS[i].src);
        src.setAttribute("type", sources.nonHLS[i].type);
        videoElement.appendChild(src);
      }
      videoPlayer = videoElement
    } else if (Hls.isSupported()) {
      console.log("ADDING HLS VID")
      var hls = new Hls({
        // This configuration is required to insure that only the
        // viewer can access the content by sending a session cookie
        // to api.video service
        xhrSetup: function (xhr, url) {
          xhr.withCredentials = true;
        }
      });
      hls.loadSource(sources.hls);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // hmmmm
        videoElement.play();
      });
    } else {
      alert("hm, looks like you're browser isn't compatible with this zone.")
    }

    // const videoPlayer = window.player = videojs(videoElement, {
    //   autoplay: false,
    //   preload: "auto",
    //   // fluid: "true",
    //   crossorigin: 'anonymous',
    //   muted: muted,
    //   // controls: true,
    //   playsinline: true,
    //   loop: loop,
    //   sources: sources,
    //   html5: {
    //     hls: {
    //       overrideNative: true,
    //     },
    //     nativeAudioTracks: false,
    //     nativeVideoTracks: false,
    //     useDevicePixelRatio: true,
    //   },
    // }, () => {
    //   state.videoElement.addEventListener("loadedmetadata", () => {
    //     console.log("LOADED METADATA, pausing...")
    //     state.videoPlayer.pause();
    //     // state.videoPlayer.play();
    //     console.log("GOT INTO EVENT LISTENER, isPlaying?", state.isPlaying)
    //   });
    // })

    return {

      videoElement,
      videoTexture,
      videoPlayer,
    }
  });


  const [state, setState] = useState({
    videoElement: videoElement,
    videoPlayer: videoPlayer,
    videoTexture: videoTexture,
    tracks: tracks,
    currentTrackIndex: null,
    currentTrackName: null,
    isPlaying: false,
  });

  return (
    <VideoPlayerContext.Provider value={[state, setState]}>
      {props.children}
    </VideoPlayerContext.Provider>
  );
};

export { VideoPlayerContext, VideoPlayerProvider };
