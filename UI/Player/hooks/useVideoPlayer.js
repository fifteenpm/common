import { useContext, useEffect } from 'react';
import { VideoPlayerContext } from "../VideoPlayerContext";


const useVideoPlayer = () => {

  const [state, setState] = useContext(VideoPlayerContext);

  function playTrack(index) {
    // TODO (jeremy) add back this switch ?
    // if (index === state.currentTrackIndex && state.videoElement)
    //   togglePlay();
    if (state.isPlaying) state.videoPlayer.pause();
    const promise = state.videoPlayer.play();
    setState(state => ({ ...state, currentTrackIndex: index, isPlaying: true }));
  }

  function togglePlay() {
    if (state.isPlaying) {
      state.videoPlayer.pause();
    } else {
      state.videoPlayer.play();
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
    isPlaying: !state.videoElement.paused,
    playPreviousTrack,
    playNextTrack,
    currentTime: state.videoElement.currentTime,
    bpm: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].bpm,
    videoTexture: state.videoTexture,
  }
};

export default useVideoPlayer;
