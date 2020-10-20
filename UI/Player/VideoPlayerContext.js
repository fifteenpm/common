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
const loadVideoMesh = ({
  //  initialize an object of type 'video'
  videoElement, geometry, url, name, position, loop,
    muted, mimetype, invert, volume, sources,
    computeBoundingSphere, playbackRate,
    rotateX, rotateY, rotateZ, repeat
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
  if (repeat) {
    texture.repeat.x = repeat.x;
    texture.repeat.y = repeat.y;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  let material = new THREE.MeshBasicMaterial({ map: texture });
  // create mesh from material and geometry
  let videoMesh = new THREE.Mesh(geometry, material);
  videoMesh.renderOrder = 1;
  // configure geometry
  if (invert) {
    geometry.scale(-1, 1, 1);
  }
  if (computeBoundingSphere) {
    geometry.computeBoundingSphere();
  }
  // set position
  videoMesh.position.set(...position);
  videoMesh.name = name;
  videoMesh.userData.media = videoElement;
  // rotate
  rotateObject(videoMesh, rotateX, rotateY, rotateZ);
  return videoMesh;

}

const VideoPlayerContext = React.createContext([{}, () => { }]);

const VideoPlayerProvider = ({ tracks, curIdx=0, ...props }) => {

  const videoPlayer = useMemo(() => document.createElement("video"));
  const videoMesh = loadVideoMesh({ videoElement: videoPlayer, ...tracks[curIdx].props });
  
  const [state, setState] = useState({
    videoPlayer: videoPlayer,
    videoMesh: videoMesh,
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
