import { useContext, useEffect } from 'react';
import { VideoPlayerContext } from "../VideoPlayerContext";


const useVideoPlayer = () => {

  const [state, setState] = useContext(VideoPlayerContext);

  function playTrack(index) {
    if (index === state.currentTrackIndex && state.videoPlayer.media) {
      togglePlay();
    } else {
      state.videoPlayer.pause();
      
      
      
      console.log("LOADING VIDEO MESH:", state.videoMesh)
      state.videoPlayer.media = state.videoMesh.userData.media;
      // state.videoPlayer.media.visible = false;
      state.videoPlayer.media.addEventListener("canplay", () => {
        // state.videoPlayer.media.playsinline = true;
        state.videoPlayer.media.play();
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
    videoMesh: state.videoMesh,
  }
};

export default useVideoPlayer;
