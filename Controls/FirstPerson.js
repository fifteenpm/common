
import React, { useRef, useEffect, useState } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

extend({ FirstPersonControls });


export default function FirstPerson({ curCamera, passthroughRef, ...props }) {
    curCamera = curCamera ? curCamera : useThree().camera;
    const controls = passthroughRef ? passthroughRef : useRef();
    const { gl } = useThree();    
    const delta = props.delta ? props.delta : .1;
    useFrame(() => { controls.current && controls.current.update(delta) });
    useFrame(() => {
        console.log("FirstPerson.curCamera.position:", curCamera.position)
    })
    return (
        <firstPersonControls
            ref={controls}
            args={[curCamera, gl.domElement]}
            {...props}
        />
    );
}
