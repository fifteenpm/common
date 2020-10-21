// https://sanket.info/?p=5
// 
import * as THREE from 'three';
THREE.CylinderCurvedSurfaceGeometry = function(radius, height, startAngle, endAngle, horizontalSegments, verticalSegments) {
    var width = radius * 2 * Math.PI;
    var plane = new THREE.PlaneGeometry(width, height, horizontalSegments, verticalSegments);
    var index = 0;

    for(var i=0; i<=verticalSegments; i++) {
        for(var j=0; j<=horizontalSegments; j++) {
            var angle = startAngle + (j/horizontalSegments)*(endAngle - startAngle);
            plane.vertices[index].z = radius * Math.cos(angle);
            plane.vertices[index].x = radius * Math.sin(angle);
            index++;
        }
    }

    return plane;
}

