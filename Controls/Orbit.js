import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls, FlyControls });


export default function Orbit({ curCamera, passthroughRef, ...props }) {
    curCamera = curCamera || useThree().camera;
    const controls = passthroughRef ? passthroughRef : useRef();
    const { gl } = useThree();
    const delta = props.delta ? props.delta : .1;
    useFrame(() => { controls.current && controls.current.update(delta) });
    return (
        <orbitControls
            ref={controls}
            args={[curCamera, gl.domElement]}
            {...props}
        />
    );
}
