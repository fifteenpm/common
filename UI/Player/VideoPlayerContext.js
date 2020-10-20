import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const useVideoTexture = ({ videoElement }) => {
  // initialize video element
  // create material from video texture
  let texture = new THREE.VideoTexture(videoElement);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  return {
    videoTexture: texture,
  }

}

const useVideoElement = ({ sources, loop = true, muted = false, volume = 1, playbackRate = 1.0, ...props }) => {
  const videoElement = useMemo(() => {
    const element = document.createElement("video")
    element.codecs = "avc1.4D401E, mp4a.40.2";
    element.playsInline = true;
    element.post = "https://dummyimage.com/320x240/ffffff/fff";
    element.crossOrigin = 'anonymous';
    element.loop = loop;
    element.muted = muted;
    element.volume = volume;
    element.playbackRate = playbackRate;
    for (let i = 0; i < sources.length; i++) {
      /* First source element creation */
      let src = document.createElement("source");
      // Attribute settings for my first source
      src.setAttribute("src", sources[i].src);
      src.setAttribute("type", sources[i].type);
      element.appendChild(src);
    }
    document.body.appendChild(element);
    return element;
  });

  return {
    videoElement
  }
}

const VideoPlayerContext = React.createContext([{}, () => { }]);

const VideoPlayerProvider = ({ tracks, videoGeometry, curIdx = 0, ...props }) => {

  const { videoElement } = useVideoElement({ sources: tracks[curIdx].sources })
  const { videoTexture } = useVideoTexture({ videoElement });

  const [state, setState] = useState({
    videoElement: videoElement,
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
