import { format } from 'path';
import React, { useState, useMemo } from 'react';
import { formatSoundcloudSrc } from "../../Audio/SoundcloudUtils"

const AudioPlayerContext = React.createContext([{}, () => {}]);

const AudioPlayerProvider = ({tracks, ...props}) => {
  const loadedTracks = useMemo(() => {
    return tracks.map(track => {
      let url = undefined
      if (track.type == "s3"){
        url = track.url
      } else if(track.type=="soundcloud") {
        url = formatSoundcloudSrc(track.id, track.secretToken)
      }
      return {
        url: url,
        ...track
      }
    })
  })
  const [state, setState] = useState({
    audioPlayer: new Audio(),
    tracks: loadedTracks,
    currentTrackIndex: null,
    currentTrackName: null,
    isPlaying: false,
  });
  
  return (
    <AudioPlayerContext.Provider value={[state, setState]}>
      {props.children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext, AudioPlayerProvider };
