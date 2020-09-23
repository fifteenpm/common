varying vec2 vUv;
uniform sampler2D map;
uniform float alpha;
uniform vec2 offset;

  void main() {
    vec2 offsetUV = fract(vUv + offset);
    vec4 color =  texture2D(map, offsetUV);
    gl_FragColor = vec4(color.rgb, alpha);
  }

// varying vec2 vUv;
// varying float noise;
// uniform sampler2D map;

// float random( vec3 scale, float seed ){
//   return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
// }

// void main() {

//   // get a random offset
//   // float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
//   // float r = .01 * random( vec3( 1.9898, 1.233, 1.7182 ), 1.0 );
//   // lookup vertically in the texture, using noise and offset
//   // to get the right RGB colour
//   // vec2 tPos = vec2( vUv.x, 1.3 * noise + r );
//   // vec2 tPos = vec2( vUv.x, vUv.y + noise);
//   vec4 color = texture2D( map, tPos );

//   gl_FragColor = vec4( color.rgb, 1.0 );

// }
