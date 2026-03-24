"use client"
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// Simple SVG path parser (supports M, C, L, Z commands)
// ----------------------------------------------------------------------
function parsePathToShapes(pathData: string): THREE.Shape[] {
  const shapes: THREE.Shape[] = [];
  let currentShape: THREE.Shape | null = null;
  let lastPoint: THREE.Vector2 | null = null;

  const commands = pathData.match(/[MLCZ][^MLCZ]*/g);
  if (!commands) return shapes;

  for (const cmd of commands) {
    const type = cmd[0];
    const args = cmd.slice(1).trim().split(/[,\s]+/).filter(s => s !== '').map(Number);

    switch (type) {
      case 'M': {
        if (currentShape) shapes.push(currentShape);
        currentShape = new THREE.Shape();
        const x = args[0];
        const y = args[1];
        currentShape.moveTo(x, y);
        lastPoint = new THREE.Vector2(x, y);
        break;
      }
      case 'C': {
        if (!currentShape || !lastPoint) break;
        const [x1, y1, x2, y2, x, y] = args;
        currentShape.bezierCurveTo(x1, y1, x2, y2, x, y);
        lastPoint.set(x, y);
        break;
      }
      case 'L': {
        if (!currentShape || !lastPoint) break;
        for (let i = 0; i < args.length; i += 2) {
          const x = args[i];
          const y = args[i + 1];
          currentShape.lineTo(x, y);
          lastPoint.set(x, y);
        }
        break;
      }
      case 'Z': {
        if (currentShape) {
          currentShape.closePath();
          shapes.push(currentShape);
          currentShape = null;
          lastPoint = null;
        }
        break;
      }
    }
  }
  if (currentShape) shapes.push(currentShape);
  return shapes;
}

// ----------------------------------------------------------------------
// Extrude a set of shapes into a 3D mesh with given color
// ----------------------------------------------------------------------
const ExtrudedPath: React.FC<{
  pathData: string;
  color: string;
  emissive?: string;
  metalness?: number;
  roughness?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({ pathData, color, emissive = '#000000', metalness = 0.7, roughness = 0.3, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const geometry = useMemo(() => {
    const shapes = parsePathToShapes(pathData);
    if (shapes.length === 0) return null;

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 1,
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4,
    };

    const geom = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    geom.computeVertexNormals();
    geom.center();
    return geom;
  }, [pathData]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} emissive={emissive} emissiveIntensity={0.15} />
    </mesh>
  );
};

// ----------------------------------------------------------------------
// The icon – two extruded shapes (no animation)
// ----------------------------------------------------------------------
const AttractIcon3D: React.FC = () => {
  const darkPath = "M300.397 31.2312C308.86 20.477 313.091 15.0998 312.933 10.9104C312.796 7.27465 310.933 3.92241 307.917 1.88646C304.443 -0.459554 297.642 0.295166 284.041 1.80461L45.1248 28.3192C17.9567 31.3343 4.37265 32.8418 1.80754 36.4784C-0.393585 39.5989 -0.600662 43.7081 1.27559 47.0341C3.46212 50.9102 16.8258 53.7757 43.5531 59.5068L174.844 87.6592C182.507 89.3023 186.338 90.1238 188.881 92.0481C192.263 94.6069 194.342 98.5279 194.564 102.763C194.731 105.948 193.262 109.58 190.324 116.846C179.221 144.308 173.669 158.039 175.057 162.072C176.903 167.435 182.408 170.627 187.979 169.565C192.17 168.766 201.329 157.127 219.647 133.848L300.397 31.2312Z";
  const redPath = "M104.8 94.5801C97.5486 92.992 93.9231 92.1979 91.7465 93.3021C89.9351 94.221 88.6254 95.897 88.1716 97.8768C87.6264 100.256 89.2733 103.582 92.5673 110.234L116.361 158.285C122.579 170.843 125.688 177.122 129.739 178.862C133.106 180.307 136.949 180.133 140.17 178.388C144.047 176.288 146.574 169.753 151.628 156.683L164.96 122.205C166.753 117.567 167.649 115.249 167.33 113.227C167.061 111.527 166.223 109.969 164.954 108.807C163.445 107.425 161.016 106.893 156.16 105.829L104.8 94.5801Z";

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050b1a' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ffffff']} />

        {/* Main group – no Float animation */}
        <group>
          {/* Main title: "Attract Group" – metallic silver */}
          <Center position={[0, -0.5, 0]}>
            <Text3D
              font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
              size={0.5}
              height={0.1}
              curveSegments={8}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelSegments={5}
            >
              Attract Group
              <meshStandardMaterial
                color="#222222"
                metalness={0.85}
                roughness={0.3}
                emissive="#224466"
                emissiveIntensity={0.1}
              />
            </Text3D>
          </Center>

          {/* Dark teal shape */}
          <group position={[0, 0.5, 0]} rotation={[0, 3.15, 0]}>
            <ExtrudedPath
              pathData={darkPath}
              color="#081E24"
              emissive="#112233"
              metalness={0.8}
              roughness={0.8}
              scale={-0.007}
            />
          </group>

          {/* Red accent shape */}
          <group position={[-0.5, 0.5, 0]} rotation={[0, 3.15, -0.05]}>
            <ExtrudedPath
              pathData={redPath}
              color="#F01159"
              emissive="#660022"
              metalness={0.8}
              roughness={0.8}
              scale={-0.0075}
            />
          </group>
        </group>

        <OrbitControls
          enablePan
          enableZoom
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={1.2}
          zoomSpeed={1.2}
          minDistance={1.5}
          maxDistance={6}
          autoRotate={false}
        />
        <Environment preset="dawn" background={false} />
      </Canvas>
    </div>
  );
};

export default AttractIcon3D;