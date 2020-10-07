import React, { useRef, useEffect, useState } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });


export default function Orbit({ curCamera, passthroughRef, ...props }) {
    curCamera = curCamera ? curCamera : useThree().camera;
    const controls = passthroughRef ? passthroughRef : useRef();
    const { gl } = useThree();    
    
    
    const delta = props.delta ? props.delta : .1;
    useFrame(() => { controls.current && controls.current.update(delta) });
    useEffect(() => {
        console.log("THINGS HAVE CHANGED")
        controls.current.domElement = gl.domElement
    }, [gl.domElement])
    return (
        <orbitControls
            ref={controls}
            args={[curCamera, gl.domElement]}
            {...props}
        />
    );
}
