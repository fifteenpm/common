import { useContext, useEffect } from 'react';
import { VideoPlayerContext } from "../VideoPlayerContext";


const useVideoPlayer = () => {

  const [state, setState] = useContext(VideoPlayerContext);

  function playTrack(index) {
    if (index === state.currentTrackIndex && state.videoPlayer.media) {
      togglePlay();
    } else {
      state.videoElement.pause();
      state.videoElement.addEventListener("canplay", () => {
        state.videoElement.play();
      });
      state.videoElement.play();
      setState(state => ({ ...state, currentTrackIndex: index, isPlaying: true }));
    }
  }

  function togglePlay() {
    if (state.isPlaying) {
      state.videoElement.pause();
    } else {
      state.videoElement.visible = true;
      state.videoElement.play();
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
    videoElement: state.videoElement,
    playTrack,
    togglePlay,
    currentTrackName: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].name,
    currentTrackId: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].id,
    trackList: state.tracks,
    isPlaying: state.isPlaying,
    playPreviousTrack,
    playNextTrack,
    currentTime: state.videoElement.currentTime,
    bpm: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].bpm,
    videoTexture: state.videoTexture,
  }
};

export default useVideoPlayer;
