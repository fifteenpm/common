import React, { useEffect, useMemo, useState } from 'react';
import InfoIcon from './InfoIcon';
import Logo from './Logo';
import Navigation from './Navigation';
import Overlay from './Overlay/Overlay';
import Player from './Player/Player';
import './UI.css';
import usePlayer from './Player/hooks/usePlayer';
import { useKeyPress } from '../Utils/hooks';

export default function UI({
    content,
    contentReady = true,
    loadWithLogo = true,
    loadWithNavigation = true,
    loadWithOverlay = true,
    loadWithInfoIcon = false,
    loadWithPlayer = false,
    // A common pattern is to manage initial scene state
    // around overlay being closed the first time.
    onOverlayHasBeenClosed = () => { },
}) {
    const [showUI, toggleUI] = useState(true);
    const [logo, _] = useState(loadWithLogo);
    const [navigation, __] = useState(loadWithNavigation);
    const [player, togglePlayer] = useState(loadWithPlayer);
    const [infoIcon, toggleInfoIcon] = useState(loadWithInfoIcon);
    const [overlay, toggleOverlay] = useState(loadWithOverlay);
    const [overlayHasBeenClosed, setOverlayHasBeenClosed] = useState(!loadWithOverlay);
    const [firstTrackTriggered, setFirstTrackTriggered] = useState(false);
    const hasTracks = useMemo(() => content.tracks ? true : false);
    // make playTrack available for pages with tracks
    const { playTrack } = hasTracks && usePlayer(content.tracks[0].mediaType);

    useEffect(() => {
        if (!overlay && !overlayHasBeenClosed) {
            setOverlayHasBeenClosed(true);
            onOverlayHasBeenClosed();
        }
    }, [overlay])

    useEffect(() => {
        if (!overlayHasBeenClosed) return;
        toggleInfoIcon(loadWithInfoIcon || overlayHasBeenClosed);
        togglePlayer(loadWithPlayer || overlayHasBeenClosed && hasTracks);
    }, [overlayHasBeenClosed])
    
    const minusPressed = useKeyPress('-');
    useEffect(()=> {
      if (!overlayHasBeenClosed) return;
      if (minusPressed && showUI) {
        toggleUI(false)
      } else if (minusPressed && !showUI) {
        toggleUI(true)
      }
    }, [minusPressed])

    return (showUI &&
          <>
            {logo && <Logo fillColor={content.colors.logo}/>}
            {navigation && <Navigation color={content.colors.navigation} lastIdx={content.lastIdx || -1} />}
            {overlay && <Overlay
                hasBeenClosed={overlayHasBeenClosed}
                contentReady={contentReady}
                message={content.message}
                instructions={content.instructions}
                purchaseLink={content.purchaseLink}
                purchaseLinkText={content.purchaseLinkText}
                overlayColor={content.colors.overlay}
                overlayContentColor={content.colors.overlayContent}
                onToggle={(e) => {
                    e.preventDefault();
                    toggleOverlay(!overlay);
                    if (!firstTrackTriggered && hasTracks) {
                        playTrack(0);
                        setFirstTrackTriggered(true);
                    }
                }}
            />}
            <div className="footer">
                {player && <Player
                    artist={content.artist}
                    playerColor={content.colors.player}
                    selectedColor={content.colors.onHover}
                    tracks={content.tracks}
                />}
                {infoIcon && <InfoIcon
                    color={content.colors.info}
                    hasPlayer={player}
                    hasTrackList={player && content.tracks.length > 1}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleOverlay(!overlay);
                    }}
                />}
            </div>
        </>
    );
}
