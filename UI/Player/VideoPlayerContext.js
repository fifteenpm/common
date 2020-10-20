import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
// import { loadVideoMesh } from "../../../Utils/LegacyLoaders";

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

const useVideo = ({ sources, loop = true, muted = true, volume = 1, playbackRate = 1.0, ...props }) => {
  const [videoTexture, videoElement] = useMemo(() => {

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
    let tex = new THREE.VideoTexture(element);
    tex.minFilter = THREE.LinearFilter;
    tex.format = THREE.RGBFormat;
    return [tex, element];
  });



  return {
    videoTexture,
    videoElement
  }
}

const VideoPlayerContext = React.createContext([{}, () => { }]);

const VideoPlayerProvider = ({ tracks, videoGeometry, curIdx = 0, loop = true, muted = false, volume = 1, playbackRate = 1.0, ...props }) => {

  // const { videoElement, videoTexture } = useVideo({ sources: tracks[curIdx].sources })
  // const { videoTexture } = useVideoTexture({ videoElement });
  const [videoTexture, videoElement] = useMemo(() => {

    const element = document.createElement("video")
    element.codecs = "avc1.4D401E, mp4a.40.2";
    element.playsInline = true;
    element.post = "https://dummyimage.com/320x240/ffffff/fff";
    element.crossOrigin = 'anonymous';
    element.loop = loop;
    element.muted = muted;
    element.volume = volume;
    element.playbackRate = playbackRate;

    // todo temp
    const sources = tracks[curIdx].sources;
    for (let i = 0; i < sources.length; i++) {
      /* First source element creation */
      let src = document.createElement("source");
      // Attribute settings for my first source
      src.setAttribute("src", sources[i].src);
      src.setAttribute("type", sources[i].type);
      element.appendChild(src);
    }
    document.body.appendChild(element);
    let tex = new THREE.VideoTexture(element);
    tex.minFilter = THREE.LinearFilter;
    tex.format = THREE.RGBFormat;
    return [tex, element];
  });


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
