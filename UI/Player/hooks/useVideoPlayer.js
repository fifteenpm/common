import { useContext, useEffect } from 'react';
import { VideoPlayerContext } from "../VideoPlayerContext";
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

const useVideoPlayer = () => {

  const [state, setState] = useContext(VideoPlayerContext);

  function playTrack(index) {
    if (index === state.currentTrackIndex && state.videoPlayer.media) {
      togglePlay();
    } else {
      state.videoPlayer.pause();
      state.videoPlayer.mesh = loadVideoMesh({ videoElement: state.videoPlayer, ...state.tracks[index].props });
      state.videoPlayer.media = state.videoPlayer.mesh.userData.media;
      // state.videoPlayer.media.visible = false;
      state.videoPlayer.media.addEventListener("canplay", () => {
        // state.videoPlayer.media.playsinline = true;
        state.videoPlayer.media.play();
        // state.videoPlayer.mesh.visible = true;
      });
      state.videoPlayer.play();
      setState(state => ({ ...state, currentTrackIndex: index, isPlaying: true }));
    }
  }

  function togglePlay() {
    if (state.isPlaying) {
      state.videoPlayer.media.pause();
    } else {
      state.videoPlayer.media.visible = true;
      state.videoPlayer.media.play();
    }
    setState(state => ({ ...state, isPlaying: !state.isPlaying }));
  }

  function playPreviousTrack() {
    const newIndex = ((state.currentTrackIndex + -1) % state.tracks.length + state.tracks.length) % state.tracks.length;
    playTrack(newIndex);
  }

  function playNextTrack() {
    const newIndex = (state.currentTrackIndex + 1) % state.tracks.length;
    playTrack(newIndex);
  }

  return {
    videoPlayer: state.videoPlayer,
    playTrack,
    togglePlay,
    currentTrackName: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].name,
    currentTrackId: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].id,
    trackList: state.tracks,
    isPlaying: state.isPlaying,
    playPreviousTrack,
    playNextTrack,
    currentTime: state.videoPlayer.currentTime,
    bpm: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].bpm,
  }
};

export default useVideoPlayer;
