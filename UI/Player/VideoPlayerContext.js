import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
// import { loadVideoMesh } from "../../../Utils/LegacyLoaders";

const useVideoTexture = ({
  videoElement, loop,
  muted, volume, sources,
  playbackRate,

}) => {
  // initialize video element
  // videoElement = videoElement || document.createElement('video');
  // videoElement.codecs = "avc1.4D401E, mp4a.40.2";
  // videoElement.playsInline = true;
  // videoElement.post = "https://dummyimage.com/320x240/ffffff/fff";
  // videoElement.crossOrigin = 'anonymous';
  // videoElement.loop = loop;
  // videoElement.muted = muted;
  // videoElement.volume = volume;
  // videoElement.playbackRate = playbackRate;
 
  // create material from video texture
  let texture = new THREE.VideoTexture(videoElement);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  return {
    videoTexture: texture,
  }

}

const useVideoElement = () => {
  const element = useMemo(() => document.createElement("video"));

  return {
    videoElement: element,
  }
}

const VideoPlayerContext = React.createContext([{}, () => { }]);

const VideoPlayerProvider = ({ tracks, videoGeometry, curIdx = 0, loop=true, muted=true, volume=0, playbackRate=1.0, ...props }) => {


  const [videoElement, sources] = useMemo(() => {
    const element = document.createElement("video")
    element.codecs = "avc1.4D401E, mp4a.40.2";
    element.playsInline = true;
    element.post = "https://dummyimage.com/320x240/ffffff/fff";
    element.crossOrigin = 'anonymous';
    element.loop = loop;
    element.muted = muted;
    element.volume = volume;
    element.playbackRate = playbackRate; 
    const currentSources = tracks[curIdx].sources;
    for (let i = 0; i < currentSources.length; i++) {
      /* First source element creation */
      let src = document.createElement("source");
      // Attribute settings for my first source
      src.setAttribute("src", currentSources[i].src);
      src.setAttribute("type", currentSources[i].type);
      element.appendChild(src);
    }
    document.body.appendChild(element);
    return [element, currentSources]
  });
  const { videoTexture } = useVideoTexture({ videoElement, sources });

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
