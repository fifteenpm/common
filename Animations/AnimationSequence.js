
import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'

export function useAnimationSequence({ animationName }) {
    const actions = useRef()
    const [prevAction, setPrevAction] = useState()
    const [curAction, setCurAction] = useState()

    const [mixer] = useState(() => new THREE.AnimationMixer())

    useFrame((state, delta) => mixer.update(delta))

    useEffect(() => {
        if (!actions.current || !animationName) return
        setPrevAction(curAction)
        setCurAction(actions.current[animationName])
    }, [animationName])

    useEffect(() => {
        if (!curAction) return
        if (prevAction) prevAction.stop()
        curAction.play()
    }, [curAction])
    return { actions, mixer }
}
