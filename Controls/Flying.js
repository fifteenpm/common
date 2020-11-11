import React, { useRef } from 'react';
import { useThree, extend, useFrame } from 'react-three-fiber';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

extend({ FlyControls })

export default function Flying(props) {
    const { gl } = useThree()
    const controls = props.passthroughRef? props.passthroughRef : useRef();
    const camera = props.camera ? props.camera : useThree().camera
    const delta = props.delta ? props.delta : .001;
    useFrame(() => { controls.current && controls.current.update(delta) });
    return (<flyControls
        ref={controls}
        args={[camera, gl.domElement]}
        movementSpeed={props.movementSpeed ? props.movmenetSpeed : 50}
        rollSpeed={props.rollSpeed ? props.rollSpeed : Math.PI * .5}
    />)
}
