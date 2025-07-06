import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GridProps {
  // Add any props you might need for the grid
}

const Grid: React.FC<GridProps> = () => {
  const gridRef = useRef<THREE.GridHelper>(null!);
  const planeRef = useRef<THREE.Mesh>(null!);
  const gridMaterialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (gridMaterialRef.current) {
      gridMaterialRef.current.uniforms.time.value = time;
    }
    // Removed direct gridRef scrolling as shader handles it
    if (planeRef.current && planeRef.current.material instanceof THREE.ShaderMaterial) {
        (planeRef.current.material as THREE.ShaderMaterial).uniforms.cameraPosition.value.copy(camera.position);
    }
  });

  // Vertex Shader for the grid plane
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Fragment Shader for the grid plane
  const fragmentShader = `
    uniform float time;
    uniform vec3 gridColor;
    uniform vec3 glowColor;
    uniform vec3 backgroundColor;
    uniform vec3 cameraPosition; // For perspective calculations
    varying vec2 vUv;

    float line(vec2 uv, float thickness) {
      return smoothstep(thickness - 0.01, thickness, abs(uv.y));
    }

    void main() {
      float speed = 0.2;
      vec2 pUv = vUv; // perspective UV

      // Apply perspective transformation to y-coordinate
      // The further away (higher vUv.y), the more compressed the lines should be
      // and the faster they should appear to scroll.
      // This is a simplified perspective; a more accurate one would involve matrix math.
      float perspectiveStrength = 2.0; // How much perspective effect
      pUv.y = pow(vUv.y, perspectiveStrength);

      vec2 scrolledUv = vec2(vUv.x, pUv.y - time * speed);

      float hSpacing = 0.1; // Horizontal line spacing
      float vSpacing = 0.1; // Vertical line spacing

      // Horizontal lines with glow
      float hLines = 0.0;
      float hGlow = 0.0;
      for (float i = -10.0; i <= 10.0; i += 1.0) { // Draw more lines
          float yPos = i * hSpacing;
          hLines += smoothstep(0.005, 0.006, abs(mod(scrolledUv.y + yPos, hSpacing * 20.0) - hSpacing * 10.0) - 0.002); // thinner lines
          hGlow += smoothstep(0.01, 0.02, abs(mod(scrolledUv.y + yPos, hSpacing * 20.0) - hSpacing * 10.0) - 0.005) * 0.5; // wider glow
      }
      hLines = clamp(hLines, 0.0, 1.0);
      hGlow = clamp(hGlow, 0.0, 1.0);

      // Vertical lines with perspective and glow
      float vLines = 0.0;
      float vGlow = 0.0;
      for (float i = -10.0; i <= 10.0; i += 1.0) {
          float xPos = i * vSpacing;
          // Adjust x based on y for perspective (lines converge)
          float perspectiveX = (vUv.x - 0.5) * (1.0 - pUv.y * 0.8); // Squeeze x as y increases
          vLines += smoothstep(0.003, 0.004, abs(mod(perspectiveX + xPos + time * speed * 0.1, vSpacing * 20.0) - vSpacing * 10.0) - 0.001);
          vGlow += smoothstep(0.008, 0.015, abs(mod(perspectiveX + xPos + time * speed * 0.1, vSpacing * 20.0) - vSpacing * 10.0) - 0.003) * 0.5;
      }
      vLines = clamp(vLines, 0.0, 1.0);
      vGlow = clamp(vGlow, 0.0, 1.0);

      float grid = max(hLines, vLines);
      float glow = max(hGlow, vGlow);

      vec3 color = mix(backgroundColor, gridColor, grid);
      color = mix(color, glowColor, glow * 0.7); // Additive glow, adjust intensity

      // Fade to black at the horizon
      float fade = smoothstep(0.6, 0.9, vUv.y);
      color = mix(color, backgroundColor, fade);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      gridColor: { value: new THREE.Color(0xff00ff) }, // Brighter Purple/Magenta lines
      glowColor: { value: new THREE.Color(0xff40ff) }, // Lighter Magenta for glow
      backgroundColor: { value: new THREE.Color(0x0a000f) }, // Darker, more purple background
      cameraPosition: { value: new THREE.Vector3() },
    },
    vertexShader,
    fragmentShader,
    transparent: true, // Enable transparency for glow effects if needed
    side: THREE.DoubleSide,
  });


  return (
    <>
      {/* <gridHelper ref={gridRef} args={[100, 100, 0x880088, 0x440044]} rotation={[Math.PI / 2, 0, 0]} /> */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <primitive object={shaderMaterial} ref={gridMaterialRef} attach="material" />
      </mesh>
    </>
  );
};

const Stars: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null!);
  const [positions] = useState(() => {
    const pos = new Float32Array(5000 * 3); // 5000 stars
    for (let i = 0; i < pos.length; i += 3) {
      pos[i] = (Math.random() - 0.5) * 200; // x
      pos[i + 1] = (Math.random() - 0.5) * 100 + 5; // y (keep them above grid somewhat)
      pos[i + 2] = (Math.random() - 0.5) * 200; // z
    }
    return pos;
  });

  useFrame(({ clock, camera }) => {
    if (starsRef.current) {
      // Make stars scroll towards the camera, creating a sense of movement
      // The rate of scrolling can be adjusted.
      // Different layers of stars could scroll at different rates for better parallax.
      starsRef.current.position.z = (starsRef.current.position.z + 0.05) % 100; // Loop stars

      // Optional: slightly rotate stars for a bit more dynamism
      // starsRef.current.rotation.y += 0.0001;
    }
  });

  const starColors = useState(() => {
    const colors = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const c = new THREE.Color();
      // Mix of white, light blue, and light pink/purple for stars
      const randomColor = Math.random();
      if (randomColor < 0.7) c.set(0xffffff); // Mostly white
      else if (randomColor < 0.9) c.set(0xaaaaff); // Light blue
      else c.set(0xffaaff); // Light pink/purple
      c.toArray(colors, i * 3);
    }
    return colors;
  })[0];

  return (
    <points ref={starsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={starColors}
          count={starColors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" size={0.15} vertexColors sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

const Landscape: React.FC = () => {
  const mountainGroupRef = useRef<THREE.Group>(null!);

  const createMountainRange = (count: number, zOffset: number, scaleVariation: number, heightVariation: number) => {
    const mountains = [];
    for (let i = 0; i < count; i++) {
      const width = Math.random() * 20 + 10; // Wider, more varied mountains
      const height = Math.random() * heightVariation + 5;
      const depth = Math.random() * 15 + 5;

      // Using ConeGeometry for simpler, more stylized peaks
      const geometry = new THREE.ConeGeometry(width / 2, height, 4, 1); // 4 segments for pyramid-like
      geometry.rotateX(Math.PI); // Point upwards
      geometry.translate(0, height / 2, 0); // Base on the ground

      // Distribute along X, vary Z slightly for depth within the range
      const xPos = (Math.random() - 0.5) * 150;
      const zPos = zOffset + (Math.random() - 0.5) * 20;

      mountains.push(
        <mesh key={`mountain-${zOffset}-${i}`} position={[xPos, 0, zPos]} scale={[1, scaleVariation, 1]}>
          <primitive object={geometry} />
          <meshStandardMaterial
            color={new THREE.Color(0x200020).lerp(new THREE.Color(0x400040), Math.random())}
            wireframe
            emissive={0x550055}
            emissiveIntensity={0.3 + Math.random() * 0.3}
          />
        </mesh>
      );
    }
    return mountains;
  };

  const mountainRanges = [
    createMountainRange(8, -50, 1.2, 15), // Further back, slightly larger scale variation
    createMountainRange(10, -30, 1, 10),  // Middle range
    createMountainRange(12, -15, 0.8, 8),  // Closer, slightly smaller
  ];

  useFrame(({ clock }) => {
    if (mountainGroupRef.current) {
      // Scroll the entire group of mountains
      mountainGroupRef.current.position.z = (mountainGroupRef.current.position.z + 0.03) % 80; // Loop effect
    }
  });

  return <group ref={mountainGroupRef} rotation={[-Math.PI / 2, 0, 0]} position={[0,0,-30]}>{mountainRanges}</group>;
};


interface IntroSlideProps {
}

const IntroSlide: React.FC<IntroSlideProps> = ({}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    setAnimate(true);
  }, []);

  return (
    <section
      className="slide"
      style={{ background: "#050008", position: 'relative', overflow: 'hidden', height: '100vh', width: '100vw' }} // Slightly adjusted background for overall scene
    >
      <Canvas camera={{ position: [0, 2.5, 20], fov: 60, near: 0.1, far: 1000 }} shadows> {/* Adjusted camera, added shadows */}
        <ambientLight intensity={0.05} /> {/* Even lower ambient */}
        <pointLight position={[0, 15, -5]} intensity={2.5} color={0xe000ff} distance={100} decay={1.5} castShadow /> {/* Main scene light, casts shadow */}
        <directionalLight position={[-10, 10, 5]} intensity={0.3} color={0x8000ff} /> {/* Fill light from side */}
        <fog attach="fog" args={[0x050008, 20, 80]} /> {/* Adjusted fog to match background and scene depth */}
        <Grid />
        <Landscape />
        <Stars />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, color: 'white', textAlign: 'center', paddingTop: '50px' }}>
        <h1>Hi, I'm Nebu Pookins</h1>
        <h2>(And the cat's name is Marley)</h2>
        <div className="arrow">↓</div>
      </div>
      <img
        src="nebu-and-marley.png"
        alt="An Asian guy holding up a cat"
        className={`animated-image ${animate ? 'slide-in' : ''}`}
        style={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          width: '50vw',
          height: '50vh',
          objectFit: 'cover',
          zIndex: 2, // Ensure image is above the canvas content if needed, but below text
        }}
      />
    </section>
  );
};

export default IntroSlide;
