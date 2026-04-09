const canvas = document.getElementById('network-canvas');
const graphWrapper = document.getElementById('graph-wrapper');
const container = document.getElementById('graph-container');
const heroText = document.getElementById('hero-text');
const problemText = document.getElementById('problem-text');
const visualiseTitle = document.getElementById('visualise-title');
const visualiseText = document.getElementById('visualise-text');
const profileText = document.getElementById('profile-text');
const workflowSection = document.getElementById('workflow-section');
const workflowDavidCard = document.getElementById('workflow-david-card');
const workflowDavidMatch = document.getElementById('workflow-david-match');
const workflowDavidDot = document.getElementById('workflow-david-dot');
const workflowCenter = document.getElementById('workflow-center');
const workflowElenaCard = document.getElementById('workflow-elena-card');
const workflowLinesSvg = document.getElementById('workflow-lines');
const workflowLeftLines = [
  document.getElementById('workflow-left-line-top'),
  document.getElementById('workflow-left-line-middle'),
  document.getElementById('workflow-left-line-bottom')
];
const workflowRightLines = [
  document.getElementById('workflow-right-line-top'),
  document.getElementById('workflow-right-line-middle'),
  document.getElementById('workflow-right-line-bottom')
];
const workflowLeftDots = [
  document.getElementById('workflow-dot-left-top'),
  document.getElementById('workflow-dot-left-middle'),
  document.getElementById('workflow-dot-left-bottom')
];
const workflowRightDots = [
  document.getElementById('workflow-dot-right-top'),
  document.getElementById('workflow-dot-right-middle'),
  document.getElementById('workflow-dot-right-bottom')
];
const nodesContainer = document.getElementById('nodes-container');
const sectionMask = document.getElementById('section-mask');
const canvasNode = document.getElementById('network-canvas');
const nodeDavid = document.getElementById('node-david');
const nodeElena = document.getElementById('node-elena');
const nodeMarcus = document.getElementById('node-marcus');

let scrollProgress = 0;
let time = 0;
let renderer;
let scene;
let camera;
let terrain;
let terrainMaterial;
let masterTl;

const sceneState = {
  cameraX: 0,
  cameraY: 620,
  cameraZ: 1180,
  rotationX: -0.86,
  rotationY: 0,
  rotationZ: -0.18,
  planeRotationZ: -0.42,
  planeScale: 1,
  heightScale: 400,
  panX: 0,
  panY: 0
};

const vertexShader = `
uniform float iTime;
uniform float heightScale;
uniform float noiseScale;
uniform float panX;
uniform float panY;
uniform float scrollProgress;
uniform float extent;

varying float vHeight;
varying float vDepth;
varying vec2 vUv;

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

float terrainNoise(vec3 p) {
  float v = 0.0;
  v += cnoise(p) * 1.0;
  v += cnoise(p * 2.1) * 0.4;
  v += cnoise(p * 4.3) * 0.15;
  v = (v / 1.55) * 0.5 + 0.5;
  return pow(v, 3.5);
}

void main() {
  vUv = uv;

  vec3 pos = position;
  vec2 samplePos = pos.xy + vec2(panX, panY);
  float lateralEase = 1.0 - clamp(scrollProgress * 2.0, 0.0, 1.0);
  float driftX = sin(iTime * 0.5) * 0.5 * lateralEase;
  float driftY = cos(iTime * 0.4) * 0.5 * lateralEase;

  float h = terrainNoise(vec3((samplePos.x + extent * 0.5) * noiseScale + driftX, (samplePos.y + extent * 0.5) * noiseScale + driftY, iTime * 0.8));
  vHeight = h;
  vDepth = clamp((pos.y + extent) / (extent * 2.0), 0.0, 1.0);

  pos.z += h * heightScale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `

uniform float lineDensity;
varying float vHeight;
varying float vDepth;
varying vec2 vUv;

void main() {
  float peakIntensity = clamp(vHeight * 2.2, 0.0, 1.0);
  vec3 lowColor = vec3(1.0, 1.0, 1.0);
  vec3 highColor = vec3(0.784, 0.647, 0.235);
  vec3 lineColor = mix(lowColor, highColor, peakIntensity);

  float alpha = 0.4 + (vDepth * 0.6);
  float thicknessMultiplier = 1.2 + (vDepth * 0.8);

  float gridY = vUv.y * lineDensity;
  float lineY = fract(gridY);
  float dist = min(lineY, 1.0 - lineY);
  float fw = fwidth(gridY);
  if (fw == 0.0) fw = 0.05;

  float line = 1.0 - smoothstep(0.0, fw * thicknessMultiplier * 1.2, dist);
  vec3 finalColor = mix(vec3(0.0), lineColor * alpha, line);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function setWrapperLayout() {
  if (!graphWrapper || !canvas) return;

  graphWrapper.style.width = '100vw';
  graphWrapper.style.height = '100vh';
  graphWrapper.style.left = '0px';
  graphWrapper.style.top = '0px';
  graphWrapper.style.right = 'auto';
  graphWrapper.style.transform = 'none';

  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
}

function applySceneState() {
  if (!camera || !terrain) return;

  camera.position.set(sceneState.cameraX, sceneState.cameraY, sceneState.cameraZ);
  camera.rotation.set(sceneState.rotationX, sceneState.rotationY, sceneState.rotationZ);
  terrain.rotation.z = sceneState.planeRotationZ;
  terrain.scale.setScalar(sceneState.planeScale);

  if (terrainMaterial) {
    terrainMaterial.uniforms.heightScale.value = sceneState.heightScale;
    terrainMaterial.uniforms.panX.value = sceneState.panX;
    terrainMaterial.uniforms.panY.value = sceneState.panY;
  }
}

function updateOpacityState() {
  if (heroText) {
    heroText.style.opacity = Math.max(0, 1 - scrollProgress * 8).toString();
  }

  if (problemText) {
    const problemOpacity = 1 - Math.abs(scrollProgress - 0.333) * 6;
    problemText.style.opacity = Math.max(0, Math.min(1, problemOpacity)).toString();
  }

  if (visualiseTitle) {
    const visualiseOpacity = 1 - Math.abs(scrollProgress - 0.666) * 6;
    visualiseTitle.style.opacity = Math.max(0, Math.min(1, visualiseOpacity)).toString();
  }

  if (visualiseText) {
    const visualiseOpacity = 1 - Math.abs(scrollProgress - 0.666) * 6;
    visualiseText.style.opacity = Math.max(0, Math.min(1, visualiseOpacity)).toString();
  }

  if (nodesContainer) {
    const nodeOpacity = Math.min(1, (scrollProgress - 0.5) * 6);
    nodesContainer.style.opacity = Math.max(0, nodeOpacity).toString();
  }

  if (profileText) {
    const profileIn = smoothstep(0.78, 0.85, scrollProgress);
    const profileOut = 1 - smoothstep(0.92, 0.985, scrollProgress);
    profileText.style.opacity = Math.max(0, Math.min(1, profileIn * profileOut)).toString();
  }

  applySectionMaskState();
  updateNodeStageState();
  updateWorkflowState();
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function applySectionMaskState() {
  if (!sectionMask) return;

  const p = clamp01(scrollProgress);

  const heroIn = 1.0 - smoothstep(0.28, 0.37, p);
  const problemIn = smoothstep(0.26, 0.36, p) * (1.0 - smoothstep(0.60, 0.70, p));
  const visualiseIn = smoothstep(0.58, 0.68, p) * (1.0 - smoothstep(0.80, 0.90, p));
  const blackout = smoothstep(0.82, 1.0, p);

  const leftMask = Math.max(0, heroIn * (1 - blackout));
  const rightMask = Math.max(0, problemIn * (1 - blackout));
  const ellipseMask = Math.max(0, visualiseIn * (1 - blackout));

  sectionMask.style.setProperty('--left-mask', leftMask.toFixed(4));
  sectionMask.style.setProperty('--right-mask', rightMask.toFixed(4));
  sectionMask.style.setProperty('--ellipse-mask', ellipseMask.toFixed(4));
  sectionMask.style.setProperty('--blackout', blackout.toFixed(4));
}

function updateNodeStageState() {
  const reveal = smoothstep(0.76, 0.96, scrollProgress);
  const hideOthers = smoothstep(0.72, 0.9, scrollProgress);
  const workflowTakeover = smoothstep(0.86, 0.94, scrollProgress);

  if (nodeElena) {
    nodeElena.style.opacity = ((1 - hideOthers) * (1 - workflowTakeover)).toFixed(4);
  }

  if (nodeMarcus) {
    nodeMarcus.style.opacity = ((1 - hideOthers) * (1 - workflowTakeover)).toFixed(4);
  }

  if (nodeDavid) {
    const startLeft = 35;
    const endLeft = 72;
    const startTop = 46;
    const endTop = 50;
    const nextLeft = startLeft + (endLeft - startLeft) * reveal;
    const nextTop = startTop + (endTop - startTop) * reveal;

    nodeDavid.style.left = `${nextLeft.toFixed(3)}%`;
    nodeDavid.style.top = `${nextTop.toFixed(3)}%`;
    nodeDavid.style.opacity = (1 - workflowTakeover).toFixed(4);
  }
}

function setWorkflowLineProgress(path, progress) {
  if (!path) return;
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length.toFixed(2)}`;
  path.style.strokeDashoffset = `${(length * (1 - clamp01(progress))).toFixed(2)}`;
}

function setWorkflowDotPosition(dot, x, y) {
  if (!dot) return;
  dot.setAttribute('cx', x.toFixed(2));
  dot.setAttribute('cy', y.toFixed(2));
}

function updateWorkflowLineGeometry() {
  if (!workflowLinesSvg || !workflowDavidCard || !workflowElenaCard || !workflowCenter) return;

  const svgRect = workflowLinesSvg.getBoundingClientRect();
  const davidRect = workflowDavidCard.getBoundingClientRect();
  const elenaRect = workflowElenaCard.getBoundingClientRect();
  const centerRect = workflowCenter.getBoundingClientRect();

  if (svgRect.width <= 0 || svgRect.height <= 0 || centerRect.width <= 0) return;

  const toSvg = (px, py) => ({
    x: ((px - svgRect.left) / svgRect.width) * 1000,
    y: ((py - svgRect.top) / svgRect.height) * 420
  });

  const leftEdgeX = davidRect.right + 1;
  const rightEdgeX = elenaRect.left - 1;
  const leftCenterX = centerRect.left;
  const rightCenterX = centerRect.right;

  const davidCy = (davidRect.top + davidRect.bottom) * 0.5;
  const elenaCy = (elenaRect.top + elenaRect.bottom) * 0.5;
  const centerCy = (centerRect.top + centerRect.bottom) * 0.5;

  const cardOffset = 24;
  const centerOffset = 56;
  const bends = [-16, 0, 16];
  const rows = [-1, 0, 1];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];

    const lStart = toSvg(leftEdgeX, davidCy + row * cardOffset);
    const lEnd = toSvg(leftCenterX, centerCy + row * centerOffset);
    const rStart = toSvg(rightCenterX, centerCy + row * centerOffset);
    const rEnd = toSvg(rightEdgeX, elenaCy + row * cardOffset);

    const lCurve = bends[i];
    const rCurve = bends[i];
    const lDx = Math.max(45, (lEnd.x - lStart.x) * 0.35);
    const rDx = Math.max(45, (rEnd.x - rStart.x) * 0.35);

    if (workflowLeftLines[i]) {
      workflowLeftLines[i].setAttribute(
        'd',
        `M ${lStart.x.toFixed(2)} ${lStart.y.toFixed(2)} C ${(lStart.x + lDx).toFixed(2)} ${(lStart.y + lCurve).toFixed(2)} ${(lEnd.x - lDx).toFixed(2)} ${(lEnd.y - lCurve).toFixed(2)} ${lEnd.x.toFixed(2)} ${lEnd.y.toFixed(2)}`
      );
    }

    if (workflowRightLines[i]) {
      workflowRightLines[i].setAttribute(
        'd',
        `M ${rStart.x.toFixed(2)} ${rStart.y.toFixed(2)} C ${(rStart.x + rDx).toFixed(2)} ${(rStart.y + rCurve).toFixed(2)} ${(rEnd.x - rDx).toFixed(2)} ${(rEnd.y - rCurve).toFixed(2)} ${rEnd.x.toFixed(2)} ${rEnd.y.toFixed(2)}`
      );
    }

    setWorkflowDotPosition(workflowLeftDots[i], lEnd.x, lEnd.y);
    setWorkflowDotPosition(workflowRightDots[i], rStart.x, rStart.y);
  }
}

function updateWorkflowState() {
  if (!workflowSection) return;

  const sectionIn = smoothstep(0.90, 0.97, scrollProgress);
  const sectionOpacity = clamp01(sectionIn);

  workflowSection.style.opacity = sectionOpacity.toFixed(4);

  if (workflowDavidCard) {
    const slide = smoothstep(0.90, 0.97, scrollProgress);
    const translateX = -8 + slide * 6;
    workflowDavidCard.style.transform = `translateY(-50%) translateX(${translateX.toFixed(3)}vw)`;
  }

  if (workflowDavidMatch) {
    const hideMatch = smoothstep(0.88, 0.94, scrollProgress);
    workflowDavidMatch.style.opacity = (1 - hideMatch).toFixed(4);
  }

  if (workflowDavidDot) {
    const attach = smoothstep(0.89, 0.95, scrollProgress);
    const rightPx = -26 + 18 * attach;
    workflowDavidDot.style.right = `${rightPx.toFixed(2)}px`;
  }

  const centerReveal = smoothstep(0.91, 0.96, scrollProgress);
  if (workflowCenter) {
    workflowCenter.style.opacity = centerReveal.toFixed(4);
    workflowCenter.style.transform = `translate(-50%, -50%) scale(${(0.94 + centerReveal * 0.06).toFixed(4)})`;
  }

  if (workflowElenaCard) {
    const elenaReveal = smoothstep(0.94, 0.99, scrollProgress);
    workflowElenaCard.style.opacity = elenaReveal.toFixed(4);
    workflowElenaCard.style.transform = `translateY(-50%) translateX(${(4 - 4 * elenaReveal).toFixed(3)}vw)`;
  }

  updateWorkflowLineGeometry();

  const leftLineProgressTop = smoothstep(0.90, 0.95, scrollProgress);
  const leftLineProgressMiddle = smoothstep(0.905, 0.955, scrollProgress);
  const leftLineProgressBottom = smoothstep(0.91, 0.96, scrollProgress);
  const rightLineProgressTop = smoothstep(0.92, 0.97, scrollProgress);
  const rightLineProgressMiddle = smoothstep(0.925, 0.975, scrollProgress);
  const rightLineProgressBottom = smoothstep(0.93, 0.985, scrollProgress);

  setWorkflowLineProgress(workflowLeftLines[0], leftLineProgressTop);
  setWorkflowLineProgress(workflowLeftLines[1], leftLineProgressMiddle);
  setWorkflowLineProgress(workflowLeftLines[2], leftLineProgressBottom);
  setWorkflowLineProgress(workflowRightLines[0], rightLineProgressTop);
  setWorkflowLineProgress(workflowRightLines[1], rightLineProgressMiddle);
  setWorkflowLineProgress(workflowRightLines[2], rightLineProgressBottom);
}

function buildTerrain() {
  if (!scene || !renderer) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const extent = Math.max(width, height) * 2.0;
  const segments = 512;
  const lineSpacing = 18.0;
  const lineDensity = (extent * 2.0) / lineSpacing;

  if (terrain) {
    scene.remove(terrain);
    terrain.geometry.dispose();
    terrainMaterial.dispose();
  }

  terrainMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      iTime: { value: time },
      heightScale: { value: sceneState.heightScale },
      noiseScale: { value: 0.0035 },
      panX: { value: sceneState.panX },
      panY: { value: sceneState.panY },
      scrollProgress: { value: scrollProgress },
      extent: { value: extent },
      lineDensity: { value: lineDensity }
    },
    extensions: { derivatives: true },
    depthTest: true,
    depthWrite: true,
    transparent: false,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(extent * 2, extent * 2, segments, segments);
  terrain = new THREE.Mesh(geometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2;
  terrain.rotation.z = sceneState.planeRotationZ;
  scene.add(terrain);

  terrainMaterial.uniforms.extent.value = extent;
  terrainMaterial.uniforms.lineDensity.value = lineDensity;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function initThree() {
  if (!canvas || typeof THREE === 'undefined') return;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 1);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 8000);
  camera.rotation.order = 'YXZ';
  camera.position.set(sceneState.cameraX, sceneState.cameraY, sceneState.cameraZ);
  camera.rotation.set(sceneState.rotationX, sceneState.rotationY, sceneState.rotationZ);

  setWrapperLayout();
  buildTerrain();
  applySceneState();
}

function buildScrollTimeline() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  if (masterTl) {
    masterTl.kill();
  }

  masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.55,
      fastScrollEnd: 3000,
      snap: ScrollTrigger.isTouch ? false : {
        snapTo: 'labelsDirectional',
        duration: { min: 0.18, max: 0.45 },
        delay: 0.12,
        ease: 'power2.inOut'
      },
      onUpdate: (self) => {
        scrollProgress = self.progress;
        updateOpacityState();
      }
    }
  });

  masterTl.addLabel('section-hero', 0);
  masterTl.to(sceneState, {
    cameraX: -80,
    cameraY: 700,
    cameraZ: 1160,
    rotationX: -0.92,
    rotationZ: -0.24,
    planeRotationZ: -0.46,
    duration: 0.333,
    ease: 'power1.inOut',
    onUpdate: applySceneState
  }, 0);

  masterTl.addLabel('section-problem', 0.333);
  masterTl.to(sceneState, {
    cameraX: 0,
    cameraY: 640,
    cameraZ: 980,
    rotationX: -0.84,
    rotationZ: -0.16,
    planeRotationZ: -0.34,
    duration: 0.333,
    ease: 'power1.inOut',
    onUpdate: applySceneState
  }, 0.333);

  masterTl.addLabel('section-visualise', 0.666);
  masterTl.to(sceneState, {
    cameraX: 160,
    cameraY: 520,
    cameraZ: 760,
    rotationX: -0.66,
    rotationZ: -0.06,
    planeRotationZ: -0.14,
    heightScale: 100,
    duration: 0.334,
    ease: 'power2.inOut',
    onUpdate: applySceneState
  }, 0.666);
  masterTl.addLabel('section-profile', 0.86);
  masterTl.addLabel('section-workflow', 0.98);
}

function frame() {
  const progress = Math.min(1, Math.max(0, scrollProgress));
  const speedFactor = 1 - progress * 0.75;
  time += 0.0015 * speedFactor;

  if (terrainMaterial) {
    terrainMaterial.uniforms.iTime.value = time;
    terrainMaterial.uniforms.scrollProgress.value = scrollProgress;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(frame);
}

function resize() {
  setWrapperLayout();

  if (renderer && camera) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  buildTerrain();
  buildScrollTimeline();
  applySceneState();
  updateWorkflowState();
}

window.addEventListener('load', () => {
  initThree();
  updateOpacityState();
  buildScrollTimeline();
  frame();
});

window.addEventListener('resize', resize);


