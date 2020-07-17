import React, { Children, cloneElement, useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';
import { useKeyPress } from '../Utils/hooks';

export function useObjectAlongTubeGeometry({ object, tubeGeometry, ...props }) {
    const [normal, binormal] = useMemo(() => {
        return [
            new THREE.Vector3(),
            new THREE.Vector3(),
        ]
    });
    // driving units
    const offset = useRef();
    const delta = useRef();
    const speed = useRef();
    const accelerationPressed = useKeyPress('ArrowUp');
    const slowDownPressed = useKeyPress('ArrowDown');
    const arrowLeftPressed = useKeyPress('ArrowLeft');
    const arrowRightPressed = useKeyPress('ArrowRight');
    useEffect(() => {
        if (!speed.current) speed.current = props.speed ? props.speed : 20;
        if (!delta.current) delta.current = props.delta ? props.speed : .005;
        if (!offset.current) offset.current = props.offset ? props.offset : 0;
    })
    function getCurTrajectory() {
        const t = (offset.current % speed.current) / speed.current;
        const pos = tubeGeometry.parameters.path.getPointAt(t);
        offset.current += delta.current;
        // interpolation
        const segments = tubeGeometry.tangents.length;
        const pickt = t * segments;
        const pick = Math.floor(pickt);
        const pickNext = (pick + 1) % segments;
        binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);//.add(up);
        const dir = tubeGeometry.parameters.path.getTangentAt(t);
        normal.copy(binormal); // most examples have .cross(dir) here but this will rotate the normal to the 'side' of the orientation we want to achieve 
        // We move on a offset on its binormal
        pos.add(normal.clone());
        return [pos, dir, t];
    }
    function updateCurTrajectory({ t, pos, dir }) {
        if (!object) return;
        object.position.copy(pos);
        // Using arclength for stablization in look ahead.
        const lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1);
        // Camera Orientation 2 - up orientation via normal
        lookAt.copy(pos).add(dir);
        object.matrix.lookAt(object.position, lookAt, normal);
        object.rotation.setFromRotationMatrix(object.matrix);
        // if (rotateOnZ) {
            object.rotation.z += Math.PI / 2; // TODO added code - can it be baked into matrix rotation?
        // }

    }
    const updateSpeed = () => {
        if (accelerationPressed) {
            if (delta.current < .05 && speed.current > 1) {
                speed.current -= .1;
            }
        }
        if (slowDownPressed) {
            if (delta.current >= 0) {
                speed.current += .1;
                delta.current -= .001;
            }
            if (delta.current < 0) {
                delta.current = 0;
            }

        }
    }
    // TODO http://jsfiddle.net/krw8nwLn/66/
    useFrame(() => {
        // updateSpeed();
        const [pos, dir, t] = getCurTrajectory();
        if (!arrowLeftPressed && !arrowRightPressed) {
            updateCurTrajectory({ t, pos, dir })
        }
    })
    return {
        offset,
        delta,
        speed,
        normal,
        binormal,
        arrowLeftPressed,
        arrowRightPressed,
        getCurTrajectory,
        updateCurTrajectory,
    }
}
