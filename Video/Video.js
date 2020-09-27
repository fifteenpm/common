// import React, { useMemo, useRef, useResource } from "react";
// import * as THREE from "three";
// import videojs from 'video.js'


// // TODO (jeremy) useVideoTexture so that play can be set in a different
// // component more easily...
// export function useVideoTexture({ src, play }) {
//   const video = document.createElement("video");
//   document.body.appendChild(video);
//   video.src = src;
//   const player = videojs(video)
//   // play video
//   if (play) {
//     console.log("PLAY player:", player)
//     // video.play();
//     player.play()
//   }
//   // create material from video texture
//   let texture = new THREE.VideoTexture(video);
//   texture.minFilter = THREE.LinearFilter;
//   texture.format = THREE.RGBFormat;
//   return {
//     texture,
//   }
// };
