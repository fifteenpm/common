import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import Hls from 'hls.js'
import { isIOS } from '../../Utils/BrowserDetection'

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
    if (isIOS || !Hls.isSupported() || !sources.hls) {
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
