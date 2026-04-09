import { useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function useScene() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById('network-canvas') as HTMLCanvasElement;
    const heroText = document.getElementById('hero-text');
    const problemText = document.getElementById('problem-text');
    const visualiseTitle = document.getElementById('visualise-title');
    const visualiseText = document.getElementById('visualise-text');
    const profileText = document.getElementById('profile-text');
    const nodesContainer = document.getElementById('nodes-container');
    const sectionMask = document.getElementById('section-mask');
    const nodeDavid = document.getElementById('node-david');
    const nodeElena = document.getElementById('node-elena');
    const nodeMarcus = document.getElementById('node-marcus');

    let scrollProgress = 0;
    let time = 0;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let terrain: THREE.Mesh;
    let terrainMaterial: THREE.ShaderMaterial;
    let masterTl: gsap.core.Timeline;
    let animationFrameId: number;

    const sceneState = {
      cameraX: 0,
      cameraY: 720,
      cameraZ: 1430,
      rotationX: -0.86,
      rotationY: 0,
      rotationZ: -0.18,
      planeRotationZ: -0.42,
      planeScale: 1,
      heightScale: 400,
      panX: 0,
      panY: 0
    };

    const profileSwoop = {
      startX: 0,
      startY: 720,
      startZ: 1430,
      endX: -300,
      endY: 560,
      endZ: 1080
    };

    const profileMotionStart = 0.99;

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
      float lateralEase = 1.0;
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

    function updateOpacityState() {
      const p = scrollProgress;
      if (heroText) heroText.style.opacity = Math.max(0, 1 - p * 4).toString();
      if (problemText) problemText.style.opacity = Math.max(0, Math.min(1, smoothstep(0.28, 0.36, p) * (1 - smoothstep(0.58, 0.66, p)))).toString();
      if (visualiseTitle) visualiseTitle.style.opacity = Math.max(0, Math.min(1, smoothstep(0.65, 0.72, p) * (1 - smoothstep(0.92, 0.98, p)))).toString();
      if (visualiseText) visualiseText.style.opacity = Math.max(0, Math.min(1, smoothstep(0.65, 0.72, p) * (1 - smoothstep(0.92, 0.98, p)))).toString();

      if (nodesContainer) {
        // Reveal visualise nodes in the same fade-in window as the visualise text.
        const nodeOpacity = smoothstep(0.65, 0.72, p);
        nodesContainer.style.opacity = nodeOpacity.toString();
      }

      if (profileText) {
        // Profile section: "It all starts with you"
        const profileIn = smoothstep(profileMotionStart, 1.08, p);
        const profileOut = 1 - smoothstep(1.25, 1.32, p);
        profileText.style.opacity = Math.max(0, Math.min(1, profileIn * profileOut)).toString();
      }

      const canvas = document.getElementById('network-canvas');
      if (canvas) {
        // Keep canvas visible until the workflow section takeover
        const fadeOutCanvas = smoothstep(1.28, 1.38, p);
        canvas.style.opacity = (1 - fadeOutCanvas).toFixed(4);
      }

      applySectionMaskState();
      updateNodeStageState();
      updateWorkflowState();

      const inboxSection = document.getElementById('inbox-section');
      if (inboxSection) {
        const inboxIn = smoothstep(1.48, 1.50, p);
        inboxSection.style.opacity = Math.max(0, Math.min(1, inboxIn)).toFixed(4);
        inboxSection.style.transform = `translateY(${(1 - inboxIn) * 30}px)`;
      }
    }

    function clamp01(value: number) {
      return Math.max(0, Math.min(1, value));
    }

    function smoothstep(edge0: number, edge1: number, x: number) {
      const t = clamp01((x - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    }

    function applySectionMaskState() {
      if (!sectionMask) return;
      const p = clamp01(scrollProgress / 1.5); // Normalize to 0-1 for mask logic

      const slideProgress = smoothstep(0.15, 0.30, p);
      const leftMaskCenter = 20 - 45 * slideProgress;
      const rightMaskCenter = 120 - 45 * slideProgress;
      // Fade out slide mask for Visualize
      const slideOpacity = (1.0 - smoothstep(0.40, 0.50, p)) * (1.0 - smoothstep(0.85, 1.0, p));

      const visualiseIn = smoothstep(0.45, 0.55, p) * (1.0 - smoothstep(0.85, 0.92, p));

      // Delay blackout until the Workflow takeover (around p=0.86 on 0-1 scale, which is 1.30 on 1.5 scale)
      const blackout = smoothstep(0.86, 0.92, p);
      const ellipseMask = Math.max(0, visualiseIn * (1 - blackout));

      sectionMask.style.setProperty('--left-mask-center', `${leftMaskCenter.toFixed(2)}%`);
      sectionMask.style.setProperty('--right-mask-center', `${rightMaskCenter.toFixed(2)}%`);
      sectionMask.style.setProperty('--slide-opacity', Math.max(0, slideOpacity).toFixed(4));
      sectionMask.style.setProperty('--ellipse-mask', ellipseMask.toFixed(4));
      sectionMask.style.setProperty('--blackout', blackout.toFixed(4));
    }

    function updateNodeStageState() {
      const isPhone = window.innerWidth < 640;
      const hideOthers = smoothstep(1.05, 1.15, scrollProgress);
      const workflowTakeover = smoothstep(1.28, 1.38, scrollProgress);

      if (nodeElena) nodeElena.style.opacity = ((1 - hideOthers) * (1 - workflowTakeover)).toFixed(4);
      if (nodeMarcus) nodeMarcus.style.opacity = ((1 - hideOthers) * (1 - workflowTakeover)).toFixed(4);

      if (nodeDavid) {
        const reveal = smoothstep(profileMotionStart, 1.18, scrollProgress);

        // Keep David and camera motion coupled with a single diagonal progress curve.
        const xMotion = clamp01((sceneState.cameraX - profileSwoop.startX) / (profileSwoop.endX - profileSwoop.startX));
        const compensatedLeft = (isPhone ? 41 : 45) + xMotion * (isPhone ? 24.0 : 30.0);
        // Downward and sideways movement happen simultaneously for a clean diagonal.
        const compensatedTop = (isPhone ? 48 : 46) + xMotion * (isPhone ? 1.2 : 1.8);
        nodeDavid.style.left = `${compensatedLeft.toFixed(3)}%`;
        nodeDavid.style.top = `${compensatedTop.toFixed(3)}%`;

        nodeDavid.style.transform = `translate(-50%, -50%) scale(1)`;
        nodeDavid.style.opacity = (1 - workflowTakeover).toFixed(4);
        nodeDavid.setAttribute('data-large', reveal > 0 ? 'true' : 'false');
      }
    }

    function updateWorkflowState() {
      const workflowSection = document.getElementById('workflow-section');
      if (!workflowSection) return;

      const viewportWidth = window.innerWidth;
      const isPhone = viewportWidth < 640;
      const isCompact = viewportWidth < 1140;
      const layout = {
        // Compact mode (<1140px) uses a vertical flow with a horizontal bottom row.
        davidTop: isCompact ? (isPhone ? 33 : 32) : 66,
        davidLeft: isCompact ? 50 : 19.5,
        statsTop: isCompact ? (isPhone ? 55 : 55) : 66,
        statsLeft: 50,
        sarahStartTop: isCompact ? (isPhone ? 83 : 78) : 42,
        elenaStartTop: isCompact ? (isPhone ? 83 : 78) : 66,
        michaelStartTop: isCompact ? (isPhone ? 83 : 78) : 90,
        sarahStartLeft: isCompact ? (isPhone ? 21 : 24) : 85,
        elenaStartLeft: isCompact ? 50 : 85,
        michaelStartLeft: isCompact ? (isPhone ? 79 : 76) : 85,
        sarahEndTop: isCompact ? (isPhone ? 45 : 35) : 32,
        elenaEndTop: isCompact ? (isPhone ? 54 : 44) : 42,
        michaelEndTop: isCompact ? (isPhone ? 65 : 53) : 52,
        sarahArcLift: isCompact ? (isPhone ? 10 : 12) : 20,
        elenaArcLift: isCompact ? (isPhone ? 8 : 10) : 15,
        michaelArcLift: isCompact ? (isPhone ? 6 : 8) : 10,
        inboxTargetLeft: 50,
        scaleGain: isCompact ? (isPhone ? 0.08 : 0.10) : 0.15
      };

      const p = Math.min(1.5, Math.max(0, scrollProgress));
      const sectionIn = smoothstep(1.30, 1.38, scrollProgress);
      workflowSection.style.opacity = Math.max(0, Math.min(1, sectionIn)).toFixed(4);

      const statsGlow = document.getElementById('wf-stats-mobile-glow');
      if (statsGlow && isPhone) {
        // Mobile-only: draw a clockwise glow around stats from 12 o'clock through workflow progress.
        const glowP = smoothstep(1.30, 1.50, scrollProgress);
        statsGlow.style.setProperty('--wf-glow-progress', glowP.toFixed(4));
        statsGlow.style.opacity = (0.35 + glowP * 0.65).toFixed(4);
      }

      const wfNodes = [
        { id: 'david', delay: 0.00 },
        { id: 'stats', delay: 0.15 },
        { id: 'elena', delay: 0.35 },
        { id: 'sarah', delay: 1.00 },
        { id: 'michael', delay: 1.00 }
      ];

      wfNodes.forEach(node => {
        const el = document.getElementById(`wf-node-${node.id}`);
        if (el) {
          if (isPhone && node.id !== 'stats') {
            el.style.opacity = '0';
            return;
          }
          const pop = smoothstep(0.91 + node.delay * 0.04, 0.96 + node.delay * 0.04, p);
          el.style.opacity = pop.toFixed(4);
          el.style.transform = `translate(-50%, -50%) scale(${(0.85 + 0.15 * pop).toFixed(4)})`;
        }
      });


      // Fade out specific workflow background elements during inbox transition
      const outP = smoothstep(1.48, 1.50, scrollProgress);
      const bgOpacity = (1.0 - outP).toFixed(4);

      const grid = document.getElementById('wf-bg-grid');
      const textDiv = document.getElementById('wf-bg-text');
      const lines = document.getElementById('workflow-lines');

      if (grid) {
        // Apply a visibility multiplier (0.1 is dim but visible)
        grid.style.opacity = (parseFloat(bgOpacity) * 0.1).toFixed(4);
      }
      if (textDiv) textDiv.style.opacity = bgOpacity;

      // Handle the main background fill of the workflow section
      const bgFill = document.getElementById('wf-bg-fill');
      if (bgFill) bgFill.style.opacity = bgOpacity;

      // Fade in the physical inbox tray as we transition
      const tray = document.getElementById('physical-inbox');
      if (tray) {
        const trayIn = smoothstep(1.48, 1.50, scrollProgress);
        tray.style.opacity = trayIn.toFixed(4);
      }

      if (lines) {
        // Fade lines out during the INBOX transition (1.42 onwards)
        const linesOut = smoothstep(1.44, 1.47, scrollProgress);
        lines.style.opacity = isPhone ? '0' : (1.0 - linesOut).toFixed(4);
      }

      // Handle the nodes (David and Stats image fade out during inbox transition)
      const davidNode = document.getElementById('wf-node-david');
      const statsNode = document.getElementById('wf-node-stats');
      if (davidNode) {
        davidNode.style.top = `${layout.davidTop}%`;
        davidNode.style.left = `${layout.davidLeft}%`;
      }
      if (statsNode) {
        statsNode.style.top = `${layout.statsTop}%`;
        statsNode.style.left = `${layout.statsLeft}%`;
      }
      if (davidNode && scrollProgress > 1.02) {
        davidNode.style.opacity = isPhone ? '0' : bgOpacity;
      }
      if (statsNode && scrollProgress > 1.02) statsNode.style.opacity = bgOpacity;

      const inboxMotionStart = 1.48;
      const inboxMotionEnd = 1.50;
      const pInbox = smoothstep(inboxMotionStart, inboxMotionEnd, scrollProgress);

      // Animate the 3 cards across arc 
      const sarah = document.getElementById('wf-node-sarah');
      const michael = document.getElementById('wf-node-michael');
      const elena = document.getElementById('wf-node-elena');

      const targetScale = 1.0 + (layout.scaleGain * pInbox);

      if (michael && scrollProgress > inboxMotionStart) {
        const startTop = layout.michaelStartTop;
        const endTop = layout.michaelEndTop;
        const startLeft = layout.michaelStartLeft;
        const endLeft = layout.inboxTargetLeft;
        const arcTop = startTop + (endTop - startTop) * pInbox - Math.sin(pInbox * Math.PI) * layout.michaelArcLift;
        const arcLeft = startLeft + (endLeft - startLeft) * pInbox;
        michael.style.top = `${arcTop}%`;
        michael.style.left = `${arcLeft}%`;
        michael.style.transform = `translate(-50%, -50%) scale(${targetScale})`;
        michael.style.zIndex = "32";
        michael.style.opacity = "1";
      } else if (michael) {
        michael.style.top = `${layout.michaelStartTop}%`;
        michael.style.left = `${layout.michaelStartLeft}%`;
        michael.style.zIndex = "30";
        if (isPhone) michael.style.opacity = '0';
      }

      if (elena && scrollProgress > inboxMotionStart) {
        const startTop = layout.elenaStartTop;
        const endTop = layout.elenaEndTop;
        const startLeft = layout.elenaStartLeft;
        const endLeft = layout.inboxTargetLeft;
        const arcTop = startTop + (endTop - startTop) * pInbox - Math.sin(pInbox * Math.PI) * layout.elenaArcLift;
        const arcLeft = startLeft + (endLeft - startLeft) * pInbox;
        elena.style.top = `${arcTop}%`;
        elena.style.left = `${arcLeft}%`;
        elena.style.transform = `translate(-50%, -50%) scale(${targetScale})`;
        elena.style.zIndex = "31";
        elena.style.opacity = "1";
      } else if (elena) {
        elena.style.top = `${layout.elenaStartTop}%`;
        elena.style.left = `${layout.elenaStartLeft}%`;
        elena.style.zIndex = "30";
        if (isPhone) elena.style.opacity = '0';
      }

      if (sarah && scrollProgress > inboxMotionStart) {
        const startTop = layout.sarahStartTop;
        const endTop = layout.sarahEndTop;
        const startLeft = layout.sarahStartLeft;
        const endLeft = layout.inboxTargetLeft;
        const arcTop = startTop + (endTop - startTop) * pInbox - Math.sin(pInbox * Math.PI) * layout.sarahArcLift;
        const arcLeft = startLeft + (endLeft - startLeft) * pInbox;
        sarah.style.top = `${arcTop}%`;
        sarah.style.left = `${arcLeft}%`;
        sarah.style.transform = `translate(-50%, -50%) scale(${targetScale})`;
        sarah.style.zIndex = "30";
        sarah.style.opacity = "1";
      } else if (sarah) {
        sarah.style.top = `${layout.sarahStartTop}%`;
        sarah.style.left = `${layout.sarahStartLeft}%`;
        sarah.style.zIndex = "30";
        if (isPhone) sarah.style.opacity = '0';
      }

      // Remove the bottom-node connector dots as inbox takeover begins.
      const dotOut = smoothstep(1.44, 1.50, scrollProgress);
      ['elena', 'sarah', 'michael'].forEach(id => {
        const dot = document.getElementById(`wf-dot-${id}`);
        if (dot) dot.style.opacity = (1.0 - dotOut).toFixed(4);
      });

      // Handle Priority Tags (fade in after arrival in the tray)
      const tagP = smoothstep(1.48, 1.55, scrollProgress);
      ['elena', 'sarah', 'michael'].forEach(id => {
        const tag = document.getElementById(`priority-tag-${id}`);
        if (tag) tag.style.opacity = tagP.toFixed(4);
      });

      const paths = [
        { id: 'path-david-stats-1', src: 'david', tgt: 'stats', tgtAlt: 'stats', srcOff: -0.25, tgtOff: -0.25 },
        { id: 'path-david-stats-2', src: 'david', tgt: 'stats', tgtAlt: 'stats', srcOff: 0, tgtOff: 0 },
        { id: 'path-david-stats-3', src: 'david', tgt: 'stats', tgtAlt: 'stats', srcOff: 0.25, tgtOff: 0.25 },
        { id: 'path-stats-elena-1', src: 'stats', tgt: 'elena', tgtAlt: 'sarah', srcOff: -0.25, tgtOff: 0 },
        { id: 'path-stats-elena-2', src: 'stats', tgt: 'elena', tgtAlt: 'elena', srcOff: 0, tgtOff: 0 },
        { id: 'path-stats-elena-3', src: 'stats', tgt: 'elena', tgtAlt: 'michael', srcOff: 0.25, tgtOff: 0 }
      ];

      const svgNode = document.getElementById('workflow-lines');
      if (svgNode) {
        if (isPhone) {
          svgNode.style.opacity = '0';
          return;
        }
        const svgRect = svgNode.getBoundingClientRect();
        paths.forEach((c, i) => {
          const path = document.getElementById(c.id) as unknown as SVGPathElement;
          if (!path) return;

          const src = document.getElementById(`wf-node-${c.src}`);
          const targetNodeId = isCompact && c.tgtAlt ? c.tgtAlt : c.tgt;
          const tgt = document.getElementById(`wf-node-${targetNodeId}`);

          if (src && tgt) {
            const srcRect = src.getBoundingClientRect();
            const tgtRect = tgt.getBoundingClientRect();
            if (isCompact) {
              // In compact mode, routes flow downward: bottom of source to top of target.
              const srcCenterX = srcRect.left + srcRect.width * 0.5 - svgRect.left;
              const tgtCenterX = tgtRect.left + tgtRect.width * 0.5 - svgRect.left;

              let x1: number;
              let y1: number;
              let x2: number;
              let y2: number;

              if (c.src === 'david' && c.tgt === 'stats') {
                x1 = srcCenterX + srcRect.width * c.srcOff * 0.40;
                y1 = srcRect.bottom - svgRect.top;
                x2 = tgtCenterX + tgtRect.width * c.tgtOff * 0.40;
                y2 = tgtRect.top - svgRect.top;
              } else {
                x1 = srcCenterX + srcRect.width * c.srcOff * 0.42;
                y1 = srcRect.bottom - svgRect.top;
                x2 = tgtCenterX;
                y2 = tgtRect.top - svgRect.top;
              }

              const dy = Math.max(24, Math.abs(y2 - y1) * 0.45);
              path.setAttribute('d', `M ${x1} ${y1} C ${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`);
            } else {
              const x1 = srcRect.right - svgRect.left;
              const y1 = srcRect.top + srcRect.height * (0.5 + c.srcOff) - svgRect.top;

              let x2 = tgtRect.left - svgRect.left;
              let y2 = tgtRect.top + tgtRect.height * (0.5 + c.tgtOff) - svgRect.top;

              if (c.tgtAlt && c.tgt !== c.tgtAlt) {
                const splitProgress = smoothstep(1.26, 1.34, p);
                const tgtAlt = document.getElementById(`wf-node-${c.tgtAlt}`);
                if (tgtAlt) {
                  const altRect = tgtAlt.getBoundingClientRect();
                  const altX2 = altRect.left - svgRect.left;
                  const altY2 = altRect.top + altRect.height * (0.5 + c.tgtOff) - svgRect.top;

                  x2 = x2 + (altX2 - x2) * splitProgress;
                  y2 = y2 + (altY2 - y2) * splitProgress;
                }
              }

              const dx = Math.max(30, (x2 - x1) * 0.4);
              path.setAttribute('d', `M ${x1} ${y1} C ${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`);
            }

            // Lines complete before inbox takeover starts.
            const currentP = smoothstep(1.26 + i * 0.02, 1.34 + i * 0.02, p);

            const len = path.getTotalLength() || 1000;
            path.style.strokeDasharray = `${len}`;
            path.style.strokeDashoffset = `${len * (1 - clamp01(currentP))}`;
          }
        });
      }
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

    function buildTerrain() {
      if (!scene || !renderer) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const extent = Math.max(width, height) * 2.0;
      const segments = 512;
      const lineDensity = (extent * 2.0) / 12.0;

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

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function buildScrollTimeline() {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (masterTl) masterTl.kill();

      masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.55,
          fastScrollEnd: 3000,
          onUpdate: (self) => {
            scrollProgress = self.progress * 1.5;
            updateOpacityState();
          }
        }
      });

      masterTl.addLabel('section-hero', 0);
      masterTl.addLabel('section-problem', 0.35);
      masterTl.addLabel('section-visualise', 0.70);
      // Hold camera state throughout visualise section (no interpolation toward profile tween)
      masterTl.to(sceneState, { duration: 0.29, onUpdate: applySceneState }, 0.70);

      masterTl.addLabel('section-profile', profileMotionStart);
      // Earlier profile onset plus stronger left/down/in swoop.
      masterTl.to(sceneState, { cameraX: profileSwoop.endX, cameraY: profileSwoop.endY, cameraZ: profileSwoop.endZ, rotationX: -0.94, rotationZ: -0.20, duration: 0.35, ease: 'power2.inOut', onUpdate: applySceneState }, profileMotionStart);

      masterTl.addLabel('section-workflow', 1.35);
      masterTl.addLabel('section-workflow-end', 1.40);
      masterTl.addLabel('section-inbox', 1.50);
    }

    function initThree() {
      if (!canvas) return;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 1);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 8000);
      camera.rotation.order = 'YXZ';
      camera.position.set(sceneState.cameraX, sceneState.cameraY, sceneState.cameraZ);
      camera.rotation.set(sceneState.rotationX, sceneState.rotationY, sceneState.rotationZ);

      buildTerrain();
      applySceneState();
    }

    function frame() {
      const progress = Math.min(1, Math.max(0, scrollProgress));
      const speedFactor = 1 - progress * 0.75;
      time += 0.0004 * speedFactor;

      if (terrainMaterial) {
        terrainMaterial.uniforms.iTime.value = time;
        terrainMaterial.uniforms.scrollProgress.value = scrollProgress;
      }
      if (renderer && scene && camera) renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(frame);
    }

    function resize() {
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

    // initialize after brief timeout so elements exist
    const timer = setTimeout(() => {
      initThree();
      updateOpacityState();
      buildScrollTimeline();
      frame();
    }, 100);

    window.addEventListener('resize', resize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (masterTl) masterTl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (renderer) renderer.dispose();
    };
  }, []);
}
