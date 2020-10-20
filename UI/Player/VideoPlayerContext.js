import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
// import { loadVideoMesh } from "../../../Utils/LegacyLoaders";
const rotateObject = (object, rotateX = 0, rotateY = 0, rotateZ = 0) => {
  rotateX = (rotateX * Math.PI) / 180;
  rotateY = (rotateY * Math.PI) / 180;
  rotateZ = (rotateZ * Math.PI) / 180;

  object.rotateX(rotateX);
  object.rotateY(rotateY);
  object.rotateZ(rotateZ);
}
const useVideoTexture = ({
  videoElement, loop,
  muted, volume, sources,
  playbackRate,

}) => {
  // initialize video element
  videoElement = videoElement || document.createElement('video');
  videoElement.codecs = "avc1.4D401E, mp4a.40.2";
  videoElement.playsInline = true;
  videoElement.post = "https://dummyimage.com/320x240/ffffff/fff";
  videoElement.crossOrigin = 'anonymous';
  videoElement.loop = loop;
  videoElement.muted = muted;
  videoElement.volume = volume;
  videoElement.playbackRate = playbackRate;
  for (let i = 0; i < sources.length; i++) {
    /* First source element creation */
    let src = document.createElement("source");
    // Attribute settings for my first source
    src.setAttribute("src", sources[i].src);
    src.setAttribute("type", sources[i].type);
    videoElement.appendChild(src);
  }
  document.body.appendChild(videoElement);
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

const VideoPlayerProvider = ({ tracks, videoGeometry, curIdx = 0, ...props }) => {

  const videoElement = useMemo(() => document.createElement("video"));
  const { videoTexture } = useVideoTexture({ videoElement, ...tracks[curIdx].props });

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
