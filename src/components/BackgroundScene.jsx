import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture } from "three";

// Theme colors (same as index.css variables)
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const PURPLE = "#d2a8ff";
const ORANGE = "#ffa657";

// Camera page ke scroll ke saath neeche jaata hai: 0 (top) -> TRAVEL (bottom)
const TRAVEL = 35;

// Scroll ke hisaab se zones (y neeche ki taraf negative):
//   hero      : y  +3 .. -4   -> wireframe shapes + galaxy stars
//   about etc : y  -6 .. -16  -> network graph
//   middle    : y -17 .. -27  -> code rain
//   contact   : y -28 .. -35  -> wireframe terrain
// Galaxy stars poore page par camera ke saath rehte hain.

const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- 1. Hero: wireframe shapes ---------- */
const SHAPES = [
  { type: "ico", color: GREEN, pos: [3.9, 1.1, -1], scale: 1.5, speed: 0.18 },
  { type: "oct", color: PURPLE, pos: [-4.2, -0.2, -2], scale: 1.1, speed: 0.14 },
  { type: "torus", color: BLUE, pos: [0.6, 2.3, -3], scale: 0.8, speed: 0.1, opacity: 0.28 },
];

function Geometry({ type }) {
  switch (type) {
    case "oct": return <octahedronGeometry args={[1, 0]} />;
    case "torus": return <torusGeometry args={[1, 0.28, 12, 32]} />;
    default: return <icosahedronGeometry args={[1, 1]} />;
  }
}

function Shape({ type, color, pos, scale, speed, opacity = 0.32 }) {
  const ref = useRef();
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += dt * speed;
    m.rotation.y += dt * speed * 1.4;
    m.position.y = pos[1] + Math.sin(state.clock.elapsedTime * speed * 2 + pos[1]) * 0.25;
  });
  return (
    <mesh ref={ref} position={pos} scale={scale}>
      <Geometry type={type} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

/* ---------- 2. Galaxy / warp stars (poore page par) ---------- */
function Stars({ count, motion }) {
  const group = useRef();
  const geo = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = rand(-14, 14);
      a[i * 3 + 1] = rand(-9, 9);
      a[i * 3 + 2] = rand(-34, 5);
    }
    return a;
  }, [count]);

  useFrame((state, dt) => {
    if (!group.current || !geo.current) return;
    group.current.position.y = state.camera.position.y; // stars camera ke saath chalte hain
    // scroll tez => taare tez aate hain (warp feel)
    const speed = 1.4 + Math.min(8, motion.current.vel * 600);
    const step = speed * Math.min(dt, 0.05);
    for (let i = 0; i < count; i++) {
      const k = i * 3 + 2;
      positions[k] += step;
      if (positions[k] > 5) {
        positions[k] = -34;
        positions[k - 2] = rand(-14, 14);
        positions[k - 1] = rand(-9, 9);
      }
    }
    geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry ref={geo}>
          <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#9ecbff" size={0.04} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
      </points>
    </group>
  );
}

/* ---------- 3. Network graph (nodes + lines) ---------- */
function Network({ y, count }) {
  const group = useRef();
  const { nodes, lines } = useMemo(() => {
    const pts = Array.from({ length: count }, () => [rand(-7, 7), rand(-5, 5), rand(-5, -1)]);
    const seg = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        if (dx * dx + dy * dy + dz * dz < 12) seg.push(...pts[i], ...pts[j]);
      }
    }
    return { nodes: new Float32Array(pts.flat()), lines: new Float32Array(seg) };
  }, [count]);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.35;
  });

  return (
    <group ref={group} position={[0, y, 0]}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={lines} count={lines.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={BLUE} transparent opacity={0.28} />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodes} count={nodes.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={GREEN} size={0.11} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
    </group>
  );
}

/* ---------- 4. Code rain (girte hue code characters) ---------- */
const GLYPHS = ["0", "1", "{", "}", "<", "/", "$", ";"];

function glyphTexture(ch) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.font = "bold 52px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ch, 32, 36);
  return new CanvasTexture(c);
}

// Har column ki apni speed hoti hai, to ek hi column ke characters saath girte hain
const colSpeed = (col) => 1.1 + ((col * 7919) % 100) / 100 * 2.2;

function GlyphLayer({ ch, count, yTop, yBottom, opacity }) {
  const geo = useRef();
  const tex = useMemo(() => glyphTexture(ch), [ch]);
  const { positions, speeds } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const col = Math.floor(rand(-14, 14));
      p[i * 3] = col * 0.55;
      p[i * 3 + 1] = rand(yBottom, yTop);
      p[i * 3 + 2] = rand(-5, -1.5);
      s[i] = colSpeed(col);
    }
    return { positions: p, speeds: s };
  }, [count, yTop, yBottom]);

  useFrame((_, dt) => {
    if (!geo.current) return;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < count; i++) {
      const k = i * 3 + 1;
      positions[k] -= speeds[i] * d;
      if (positions[k] < yBottom) positions[k] = yTop;
    }
    geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        color={GREEN}
        size={0.6}
        sizeAttenuation
        transparent
        alphaTest={0.05}
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function CodeRain({ yTop, yBottom, perLayer }) {
  return GLYPHS.map((ch, i) => (
    <GlyphLayer key={ch} ch={ch} count={perLayer} yTop={yTop} yBottom={yBottom} opacity={0.35 + (i % 3) * 0.2} />
  ));
}

/* ---------- 5. Wireframe terrain (synthwave) ---------- */
function Terrain({ y }) {
  const geo = useRef();
  useFrame((state) => {
    const g = geo.current;
    if (!g) return;
    const p = g.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const v = p.getY(i);
      p.setZ(i, Math.sin(x * 0.55 + t * 0.4) * 0.5 + Math.cos(v * 0.7 - t * 0.6) * 0.5 + Math.sin((x + v) * 0.3 - t * 0.2) * 0.4);
    }
    p.needsUpdate = true;
  });
  return (
    <mesh position={[0, y, -9]} rotation={[-1.3, 0, 0]} frustumCulled={false}>
      <planeGeometry ref={geo} args={[34, 18, 36, 22]} />
      <meshBasicMaterial color={PURPLE} wireframe transparent opacity={0.17} />
    </mesh>
  );
}

/* ---------- Camera: scroll + mouse/touch parallax ---------- */
function CameraRig({ scroll, pointer, motion }) {
  const last = useRef(0);
  useFrame((state) => {
    const cam = state.camera;
    motion.current.vel = lerp(motion.current.vel, Math.abs(scroll.current - last.current), 0.1);
    last.current = scroll.current;
    const targetY = -scroll.current * TRAVEL - pointer.current.y * 0.3;
    const targetX = pointer.current.x * 0.6;
    cam.position.x = lerp(cam.position.x, targetX, 0.05);
    cam.position.y = lerp(cam.position.y, targetY, 0.08);
  });
  return null;
}

export default function BackgroundScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const motion = useRef({ vel: 0 });

  // Phone par kam objects, taaki smooth chale
  const mobile = useMemo(() => window.matchMedia("(max-width: 700px)").matches, []);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="bg3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <CameraRig scroll={scroll} pointer={pointer} motion={motion} />
        <Stars count={mobile ? 350 : 800} motion={motion} />
        {SHAPES.map((s, i) => <Shape key={i} {...s} />)}
        <Network y={-11} count={mobile ? 26 : 44} />
        <CodeRain yTop={-14} yBottom={-28} perLayer={mobile ? 16 : 34} />
        <Terrain y={-36} />
      </Canvas>
    </div>
  );
}
