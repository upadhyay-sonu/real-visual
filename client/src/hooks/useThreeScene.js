import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const useThreeScene = (canvasRef, modelUrl, savedCameraState, onCameraChange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqAnimationRef = useRef(null);

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current || !modelUrl) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827); // Tailwind gray-900 equivalent
    sceneRef.current = scene;

    // 2. Setup Camera
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    // Apply saved state or defaults
    if (savedCameraState?.position) {
      camera.position.set(savedCameraState.position.x, savedCameraState.position.y, savedCameraState.position.z);
    } else {
      camera.position.set(0, 0, 5);
    }
    cameraRef.current = camera;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      preserveDrawingBuffer: true // Required for taking screenshots
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 4. Setup Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 5. Setup Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    if (savedCameraState?.target) {
      controls.target.set(savedCameraState.target.x, savedCameraState.target.y, savedCameraState.target.z);
    } else {
      controls.target.set(0, 0, 0);
    }
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 6. Load Model
    const loader = new GLTFLoader();
    setLoading(true);
    setError(null);

    loader.load(
      modelUrl,
      (gltf) => {
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.x += (gltf.scene.position.x - center.x);
        gltf.scene.position.y += (gltf.scene.position.y - center.y);
        gltf.scene.position.z += (gltf.scene.position.z - center.z);
        
        scene.add(gltf.scene);
        setLoading(false);
      },
      (xhr) => {
        // Optional: track progress here
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (err) => {
        console.error(`GLB Load Error [${modelUrl}]:`, err);
        setError('Failed to load the 3D model. Please check your connection or file integrity.');
        setLoading(false);
      }
    );

    // 7. Handle Resizing
    const handleResize = () => {
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    const animate = () => {
      reqAnimationRef.current = requestAnimationFrame(animate);
      controls.update(); // required if damping enabled
      renderer.render(scene, camera);
    };
    animate();

    // 9. Camera change tracking (debounced)
    let timeoutId;
    const onControlChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (onCameraChange) {
          onCameraChange({
            position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
            target: { x: controls.target.x, y: controls.target.y, z: controls.target.z }
          });
        }
      }, 1000); // 1 second debounce
    };
    controls.addEventListener('change', onControlChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', onControlChange);
      clearTimeout(timeoutId);
      if (reqAnimationRef.current) cancelAnimationFrame(reqAnimationRef.current);
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [canvasRef, modelUrl]); // Only re-run if canvas or URL changes

  // Methods exposed to the component
  const resetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  const toggleAutoRotate = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    }
  }, []);

  const takeScreenshot = useCallback(() => {
    if (rendererRef.current) {
      return rendererRef.current.domElement.toDataURL('image/png');
    }
    return null;
  }, []);

  return { loading, error, resetCamera, toggleAutoRotate, takeScreenshot };
};
