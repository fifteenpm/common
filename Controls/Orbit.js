import React, { useRef, useEffect, useState } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

extend({ OrbitControls });


export default function Orbit({ curCamera, passthroughRef, ...props }) {
    curCamera = curCamera ? curCamera : useThree().camera;
    const controls = passthroughRef ? passthroughRef : useRef();
    const { gl } = useThree();    
    
    
    const delta = props.delta ? props.delta : .1;
    useFrame(() => { controls.current && controls.current.update(delta) });
    useEffect(() => {
        controls.current.domElement = gl.domElement
        console.log("TOUCHES", controls.current.touches)
        controls.current.touches.TWO = THREE.TOUCH.ROTATE
        console.log("THREE.TOUCH", THREE.TOUCH)
    }, [gl.domElement])
    return (
        <orbitControls
            ref={controls}
            args={[curCamera, gl.domElement]}
            {...props}
        />
    );
}
