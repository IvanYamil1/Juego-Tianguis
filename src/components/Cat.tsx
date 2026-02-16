"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useTianguis, Collider } from "@/contexts/TianguisContext";

const WALK_SPEED = 2;
const RUN_SPEED = 5;
const ROTATION_SPEED = 3;
const WALK_ANIM_SPEED = 1.8;
const RUN_ANIM_SPEED = 2;
const JUMP_FORCE = 4.5;
const GRAVITY = 12;

// Vectores reutilizables
const _direction = new THREE.Vector3();
const _newPosition = new THREE.Vector3();
const _behindOffset = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _catLookAt = new THREE.Vector3();
const _yAxis = new THREE.Vector3(0, 1, 0);
const _smoothLookAt = new THREE.Vector3();
const _lookOffset = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

// Función para lerp basado en delta-time
function damp(current: number, target: number, lambda: number, delta: number): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));
}

// Función para verificar colisión AABB (Axis-Aligned Bounding Box)
function checkCollision(
  pos1: [number, number, number],
  size1: [number, number, number],
  pos2: [number, number, number],
  size2: [number, number, number]
): boolean {
  // Calcular los límites de cada bounding box
  const min1 = {
    x: pos1[0] - size1[0] / 2,
    y: pos1[1] - size1[1] / 2,
    z: pos1[2] - size1[2] / 2,
  };
  const max1 = {
    x: pos1[0] + size1[0] / 2,
    y: pos1[1] + size1[1] / 2,
    z: pos1[2] + size1[2] / 2,
  };

  const min2 = {
    x: pos2[0] - size2[0] / 2,
    y: pos2[1] - size2[1] / 2,
    z: pos2[2] - size2[2] / 2,
  };
  const max2 = {
    x: pos2[0] + size2[0] / 2,
    y: pos2[1] + size2[1] / 2,
    z: pos2[2] + size2[2] / 2,
  };

  // Verificar superposición en los tres ejes
  return (
    min1.x <= max2.x &&
    max1.x >= min2.x &&
    min1.y <= max2.y &&
    max1.y >= min2.y &&
    min1.z <= max2.z &&
    max1.z >= min2.z
  );
}

interface CatModelProps {
  isMoving: boolean;
  isRunning: boolean;
  turnDirection: number;
}

function CatModel({ isMoving, isRunning, turnDirection }: CatModelProps) {
  const { scene, animations } = useGLTF("/models/cat.gltf");
  const modelRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);
  const currentTilt = useRef(0);
  const idleTime = useRef(0);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const runAction = actions["run"];
    if (runAction && isMoving) {
      /* eslint-disable react-hooks/immutability */
      runAction.paused = false;
      runAction.timeScale = isRunning ? RUN_ANIM_SPEED : WALK_ANIM_SPEED;
      /* eslint-enable react-hooks/immutability */
      runAction.reset().fadeIn(0.2).play();
    }
  }, [isMoving, actions, isRunning]);

  useEffect(() => {
    const runAction = actions["run"];
    if (runAction && isMoving) {
      const targetSpeed = isRunning ? RUN_ANIM_SPEED : WALK_ANIM_SPEED;
      /* eslint-disable-next-line react-hooks/immutability */
      runAction.timeScale = targetSpeed;
    }
  }, [isRunning, actions, isMoving]);

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    const targetTilt = turnDirection * 0.15;
    currentTilt.current += (targetTilt - currentTilt.current) * 0.1;

    let idleRotX = 0;
    let idleY = 0;
    if (!isMoving) {
      idleTime.current += delta;
      idleRotX = Math.sin(idleTime.current * 2) * 0.02;
      idleY = Math.sin(idleTime.current * 3) * 0.005;
    } else {
      idleTime.current = 0;
    }

    modelRef.current.rotation.set(
      idleRotX,
      Math.PI / 2,
      currentTilt.current
    );
    modelRef.current.position.y = idleY;

    const runAction = actions["run"];
    if (runAction && !isMoving) {
      const duration = runAction.getClip().duration;
      const targetTime = duration * 0.75;

      /* eslint-disable react-hooks/immutability */
      runAction.paused = false;
      runAction.timeScale = 0;

      const diff = targetTime - runAction.time;
      if (Math.abs(diff) > 0.01) {
        runAction.time += diff * 0.1;
      } else {
        runAction.time = targetTime;
      }
      /* eslint-enable react-hooks/immutability */
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.015}
      position={[0, 0, 0]}
    />
  );
}

function CatPlaceholder() {
  return (
    <mesh castShadow>
      <boxGeometry args={[0.4, 0.3, 0.6]} />
      <meshStandardMaterial color="#ff8844" />
    </mesh>
  );
}

export function Cat() {
  const groupRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [turnDirection, setTurnDirection] = useState(0);
  const { setCatPosition, colliders } = useTianguis();

  // Variables para el salto
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const jumpPressed = useRef(false);

  // Mouse tracking para desktop
  const mousePosition = useRef({ x: 0, y: 0 });
  const smoothMousePosition = useRef({ x: 0, y: 0 });

  // Audio del maullido
  const meowAudio = useRef<HTMLAudioElement | null>(null);

  // Inicializar _smoothLookAt
  useEffect(() => {
    _smoothLookAt.set(0, 0.2, 8);
  }, []);

  // Inicializar audio del maullido
  useEffect(() => {
    meowAudio.current = new Audio("/Miau.mp3");
    meowAudio.current.volume = 0.4;

    return () => {
      if (meowAudio.current) {
        meowAudio.current.pause();
        meowAudio.current = null;
      }
    };
  }, []);

  // Maullido aleatorio
  useEffect(() => {
    let meowTimeout: NodeJS.Timeout | null = null;

    const playMeow = () => {
      if (meowAudio.current) {
        meowAudio.current.currentTime = 0;
        meowAudio.current.play().catch(() => {});
        setTimeout(() => {
          if (meowAudio.current) {
            meowAudio.current.pause();
            meowAudio.current.currentTime = 0;
          }
        }, 2000);
      }
    };

    const scheduleMeow = () => {
      const randomDelay = 15000 + Math.random() * 30000;
      meowTimeout = setTimeout(() => {
        playMeow();
        scheduleMeow();
      }, randomDelay);
    };

    const initialTimeout = setTimeout(() => {
      scheduleMeow();
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      if (meowTimeout) clearTimeout(meowTimeout);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const catPos = groupRef.current.position;
    const catRot = groupRef.current.rotation.y;
    _catLookAt.set(catPos.x, catPos.y + 0.2, catPos.z);

    // Controles de teclado
    const keyboardControls = getKeys();
    const forward = keyboardControls.forward;
    const backward = keyboardControls.backward;
    const left = keyboardControls.left;
    const right = keyboardControls.right;
    const run = keyboardControls.run;
    const jump = keyboardControls.jump;

    const moving = forward || backward || left || right;

    if (moving !== isMoving) setIsMoving(moving);
    if (run !== isRunning) setIsRunning(run);

    // Lógica de salto
    if (jump && isGrounded.current && !jumpPressed.current) {
      velocityY.current = JUMP_FORCE;
      isGrounded.current = false;
      jumpPressed.current = true;
    }
    if (!jump) {
      jumpPressed.current = false;
    }

    const currentSpeed = run ? RUN_SPEED : WALK_SPEED;
    const newTurnDir = left ? 1 : right ? -1 : 0;
    if (newTurnDir !== turnDirection) setTurnDirection(newTurnDir);

    if (left) groupRef.current.rotation.y += ROTATION_SPEED * delta;
    if (right) groupRef.current.rotation.y -= ROTATION_SPEED * delta;

    // Movimiento adelante/atrás
    if (forward || backward) {
      _direction.set(0, 0, forward ? -1 : 1);
      _direction.applyQuaternion(groupRef.current.quaternion);
      _direction.multiplyScalar(currentSpeed * delta);

      _newPosition.copy(groupRef.current.position).add(_direction);

      // Límites del tianguis
      const limit = 12;
      _newPosition.x = THREE.MathUtils.clamp(_newPosition.x, -limit, limit);
      _newPosition.z = THREE.MathUtils.clamp(_newPosition.z, -limit, limit);

      // Tamaño del collider del gato (aproximado)
      const catSize: [number, number, number] = [0.6, 0.5, 0.8];

      // Verificar colisión con todos los objetos
      let hasCollision = false;
      for (const collider of colliders) {
        if (checkCollision(
          [_newPosition.x, _newPosition.y, _newPosition.z],
          catSize,
          collider.position,
          collider.size
        )) {
          hasCollision = true;
          break;
        }
      }

      // Solo mover si no hay colisión
      if (!hasCollision) {
        groupRef.current.position.x = _newPosition.x;
        groupRef.current.position.z = _newPosition.z;
      }
    }

    // Aplicar gravedad y actualizar posición Y
    if (!isGrounded.current) {
      velocityY.current -= GRAVITY * delta;
      groupRef.current.position.y += velocityY.current * delta;

      if (groupRef.current.position.y <= 0) {
        groupRef.current.position.y = 0;
        velocityY.current = 0;
        isGrounded.current = true;
      }
    } else {
      groupRef.current.position.y = 0;
    }

    // Actualizar posición del gato en el contexto
    setCatPosition([catPos.x, catPos.y, catPos.z]);

    // Calcular posición de cámara detrás del gato
    _behindOffset.set(0, 1.5, 3);
    _behindOffset.applyAxisAngle(_yAxis, catRot);

    _camTarget.set(
      catPos.x + _behindOffset.x,
      catPos.y + _behindOffset.y,
      catPos.z + _behindOffset.z
    );

    // Suavizar posición del mouse
    const mouseLambda = 3;
    smoothMousePosition.current.x = damp(smoothMousePosition.current.x, mousePosition.current.x, mouseLambda, delta);
    smoothMousePosition.current.y = damp(smoothMousePosition.current.y, mousePosition.current.y, mouseLambda, delta);

    // Calcular lookAt con offset del mouse
    _lookOffset.set(smoothMousePosition.current.x * 1.0, smoothMousePosition.current.y * -0.5, 0);
    _lookOffset.applyAxisAngle(_yAxis, catRot);
    _targetLookAt.copy(_catLookAt).add(_lookOffset);

    // Interpolación suave de cámara
    const camLambda = 6;
    state.camera.position.x = damp(state.camera.position.x, _camTarget.x, camLambda, delta);
    state.camera.position.y = damp(state.camera.position.y, _camTarget.y, camLambda, delta);
    state.camera.position.z = damp(state.camera.position.z, _camTarget.z, camLambda, delta);

    // Interpolar el lookAt
    const lookLambda = 4;
    _smoothLookAt.x = damp(_smoothLookAt.x, _targetLookAt.x, lookLambda, delta);
    _smoothLookAt.y = damp(_smoothLookAt.y, _targetLookAt.y, lookLambda, delta);
    _smoothLookAt.z = damp(_smoothLookAt.z, _targetLookAt.z, lookLambda, delta);

    state.camera.lookAt(_smoothLookAt);
  });

  return (
    <group ref={groupRef} position={[0, 0, 8]}>
      <Suspense fallback={<CatPlaceholder />}>
        <CatModel isMoving={isMoving} isRunning={isRunning} turnDirection={turnDirection} />
      </Suspense>
      <pointLight position={[0, 2, 0]} intensity={5} distance={6} color="#ffffff" />
    </group>
  );
}

useGLTF.preload("/models/cat.gltf");
