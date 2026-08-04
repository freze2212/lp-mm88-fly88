/* ============================================================
   Animated 3D wireframe globe background (Three.js).
   Champagne-gold <-> emerald flowing shader, orbital rings,
   star field and a drifting shooting star. Renders into
   #globe-stage as a fixed, masked atmospheric backdrop.
   ============================================================ */
import * as THREE from "three";

const stage = document.getElementById("globe-stage");
if (stage) {
  try {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Renderer / scene / camera
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setClearColor(0x000000, 0);
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      stage.clientWidth / stage.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 11);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xf5e6c8, 1.4);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    // Root group
    const system = new THREE.Group();
    scene.add(system);

    // Star field
    function makeStars(count = 1400, radius = 80) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = radius * (0.6 + Math.random() * 0.4);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.18,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      return new THREE.Points(geo, mat);
    }
    system.add(makeStars());

    // Shooting star
    const shootingStar = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf5e6c8 })
    );
    shootingStar.position.set(120, 0, -40);
    system.add(shootingStar);
    function resetShootingStar() {
      shootingStar.position.set(
        100 + Math.random() * 50,
        Math.random() * 80 - 40,
        -50 - Math.random() * 50
      );
    }

    // Orbital rings (Saturn-like)
    function ring(radius, thickness, color, rotation, opacity) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, thickness, 10, 160),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
        })
      );
      m.rotation.set(...rotation);
      return m;
    }
    system.add(ring(4.6, 0.018, 0xd4b36a, [Math.PI / 2 + 0.32, 0, 0.22], 0.55));
    system.add(ring(5.35, 0.014, 0x7dd3c0, [Math.PI / 2 - 0.42, 0.28, -0.16], 0.4));
    system.add(ring(6.1, 0.01, 0xe2c98a, [Math.PI / 2 + 0.55, -0.12, 0.4], 0.25));

    // Globe wireframe: flowing champagne-gold <-> emerald shader
    const flowingMat = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_colorA: { value: new THREE.Color("#d8b36a") },
        u_colorB: { value: new THREE.Color("#34d399") },
      },
      vertexShader: `
        varying vec3 v_position;
        void main() {
          v_position = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec3 u_colorA;
        uniform vec3 u_colorB;
        varying vec3 v_position;
        void main() {
          float pulse = sin((v_position.x + v_position.y + v_position.z) * 4.2 + u_time * 1.6);
          pulse = smoothstep(0.7, 1.0, pulse);
          float mixT = 0.5 + 0.5 * sin(u_time * 0.52);
          vec3 color = mix(u_colorA, u_colorB, mixT);
          float depth = smoothstep(-3.0, 3.0, v_position.z);
          color = mix(color, color * 1.3, depth);
          gl_FragColor = vec4(color * pulse, pulse);
          gl_FragColor.a = smoothstep(0.0, 0.1, gl_FragColor.a);
        }
      `,
      transparent: true,
      wireframe: true,
    });

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(3.4, 36, 36),
      flowingMat
    );
    globe.rotation.z = 0.15;
    system.add(globe);

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();

      globe.rotation.y += 0.0022;
      flowingMat.uniforms.u_time.value += delta;

      shootingStar.position.x -= 0.18;
      shootingStar.position.y -= 0.08;
      if (shootingStar.position.x < -100) resetShootingStar();

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    if (reducedMotion) {
      renderer.render(scene, camera); // static frame, no perpetual motion
    } else {
      animate();
    }

    // Resize
    window.addEventListener("resize", () => {
      const w = stage.clientWidth,
        h = stage.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    // Pause when tab is hidden to save the GPU
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clock.stop();
      else clock.start();
    });
  } catch (err) {
    // WebGL unavailable or blocked: fail silently, page still works
    console.warn("Globe scene disabled:", err);
  }
}
