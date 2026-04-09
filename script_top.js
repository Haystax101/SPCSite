/**
 * script.js — Isometric Diagonal Abstract Mountains
 *
 * An elegant screen-space rendering approach. Instead of calculating a 3D matrix,
 * we draw perfectly parallel lines across the screen tilted at a 25-degree angle 
 * (running from bottom-left to top-right). 
 * 
 * We sample 2D noise along these angled lines and offset the screen Y-axis 
 * strictly upwards. By drawing from the back of the screen to the front,
 * the black fills perfectly occlude the lines behind them, resulting in flawless
 * 3D isometric perspective.
 */

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('graph-container');

// ── Config ────────────────────────────────────────────────────────────────────
// Visual angles and styling
let CURRENT_ANGLE_DEG = -15; // Tilted to go from bottom-left up to top-right
let CURRENT_SPACING = 18;    // Distance between lines (depth precision) - optimized for performance
let CURRENT_RESOLUTION = 10; // Distance between points on a line (horizontal precision) - optimized for performance

// Noise configuration
let CURRENT_NOISE_SCALE = 0.0035; // Broadness of the mountains
let CURRENT_HEIGHT_SCALE = 400;   // Height scalar
let CAMERA_OFFSET_X = 0;          // Offset for panning camera into points
let CAMERA_OFFSET_Y = 0;

let W, H;

// ── Perlin Noise ──────────────────────────────────────────────────────────────
const _p = new Uint8Array(512);
(function buildPerm() {
  const src = new Uint8Array(256);
  // Fixed seed to maintain a static, curated composition
  let seed = 42;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  for (let i = 0; i < 256; i++) src[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [src[i], src[j]] = [src[j], src[i]];
  }
  for (let i = 0; i < 512; i++) _p[i] = src[i & 255];
})();

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }

function grad3(hash, x, y, z) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function perlin3(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);

  const A = _p[X] + Y, AA = _p[A] + Z, AB = _p[A + 1] + Z;
  const B = _p[X + 1] + Y, BA = _p[B] + Z, BB = _p[B + 1] + Z;

  return lerp(
    lerp(
      lerp(grad3(_p[AA], x, y, z), grad3(_p[BA], x - 1, y, z), u),
      lerp(grad3(_p[AB], x, y - 1, z), grad3(_p[BB], x - 1, y - 1, z), u), v
    ),
    lerp(
      lerp(grad3(_p[AA + 1], x, y, z - 1), grad3(_p[BA + 1], x - 1, y, z - 1), u),
      lerp(grad3(_p[AB + 1], x, y - 1, z - 1), grad3(_p[BB + 1], x - 1, y - 1, z - 1), u), v
    ), w
  );
}

// ── Terrain Generation ────────────────────────────────────────────────────────
// Smooth fractal noise for non-jagged mountains
function smoothTerrain(x, y, z) {
  let v = 0;

  // 3 octaves for gentle rolling hills with some defined edges
  v += perlin3(x, y, z) * 1.0;
  v += perlin3(x * 2.1, y * 2.1, z * 2.1) * 0.4;
  v += perlin3(x * 4.3, y * 4.3, z * 4.3) * 0.15;

  // Normalise roughly to 0 -> 1
  v = (v / 1.55) * 0.5 + 0.5;

  // Create the "flat plain extruding into mountains" effect
  // pow() ensures values near 0 stay completely flat, 
  // while values nearer 1 aggressively extrude upwards smoothly.
  v = Math.pow(v, 3.5);

  return v;
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, W, H);

  // Baseline dark background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  ctx.lineJoin = 'round';

  // Convert angle to vectors
  const rad = (CURRENT_ANGLE_DEG * Math.PI) / 180;
  const dx = Math.cos(rad); // Direction along the line (x)
  const dy = Math.sin(rad); // Direction along the line (y)

  // Perpendicular vector dictating the parallel shift (depth)
  // Moving directly perpendicular to our dx/dy line ensures flawless occlusion
  const px = Math.cos(rad + Math.PI / 2);
  const py = Math.sin(rad + Math.PI / 2);

  // ── Optimization: Extend bounds to avoid edge gaps
  const EXTENT = Math.max(W, H) * 2.0; // Pushed out further for deep zooming
  const BUCKET_COUNT = 12; // Choropleth color bands

  // Draw lines from the "back" of the screen to the "front"
  for (let offset = -EXTENT; offset < EXTENT; offset += CURRENT_SPACING) {

    ctx.beginPath();
    let started = false;

    // Cache points for color-banding later
    const linePoints = [];

    // Traverse along the line's length
    for (let t = -EXTENT; t < EXTENT; t += CURRENT_RESOLUTION) {

      // 1. Calculate the flat plane center 
      //    We add pan offsets so we can smoothly "drive" the camera
      const baseX = t * dx + offset * px + CAMERA_OFFSET_X;
      const baseY = t * dy + offset * py + CAMERA_OFFSET_Y;

      // Create a meandering Lissajous curve for dynamic, non-linear panning
      // Keeping this extremely subtle so it just lightly shifts
      // Reduce lateral drift to 0 as we scroll down into the 'visualise' section
      const lateralEase = 1 - Math.min(1, Math.max(0, scrollProgress * 2));
      const driftX = Math.sin(time * 0.5) * 0.5 * lateralEase;
      const driftY = Math.cos(time * 0.4) * 0.5 * lateralEase;

      // Centre the noise sampling and translate terrain slightly to feel organic
      const sampleX = (baseX + W / 2) * CURRENT_NOISE_SCALE + driftX;
      const sampleY = (baseY + H / 2) * CURRENT_NOISE_SCALE + driftY;

      // Use time as the Z-axis in 3D noise so the terrain morphs and boils in-place!
      const sampleZ = time * 0.8;

      // 2. Fetch the elevation
      const h = smoothTerrain(sampleX, sampleY, sampleZ);

      // 3. Extrude the coordinate strictly upwards (subtract from screen Y)
      // Stop flattening the peaks; we remove the flattenEase so peaks stay tall.
      const finalX = t * dx + offset * px + W / 2; // Notice we don't apply the offset to X/Y final screen coords here... wait, yes we do if we zoom.
      // Actually the camera panning in final space: we are sliding the underlying plane 
      // so final screen position shouldn't move, just the sample coordinates. 
      const finalY = t * dy + offset * py + H / 2 - (h * CURRENT_HEIGHT_SCALE);

      linePoints.push({ x: finalX, y: finalY, h: h });

      if (!started) {
        // Drop a massive anchor to the bottom left for the fill polygon
        ctx.moveTo(-EXTENT, H + EXTENT);
        ctx.lineTo(finalX, finalY);
        started = true;
      } else {
        ctx.lineTo(finalX, finalY);
      }
    }

    // Close the path far below the screen to mask lines drawn behind this one
    ctx.lineTo(W + EXTENT, H + EXTENT);

    // Solid Black Fill 
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Calculate a depth-fade effect so backend lines fade atmosferically
    const depthRatio = (offset + EXTENT) / (EXTENT * 2);
    // Keep the alpha constant instead of fading out entirely
    const alpha = (0.4 + (depthRatio * 0.6)); // Increased brightness/opacity

    ctx.lineWidth = 1.2 + (depthRatio * 0.8); // Slightly thicker lines for visibility

    // Calculate choropleth colors for this specific depth layer
    const gradientColors = [];
    for (let b = 0; b < BUCKET_COUNT; b++) {
      const ratio = b / (BUCKET_COUNT - 1);

      // Linear intensity ensures the gradient spreads smoothly from the valleys to the peaks
      const peakIntensity = ratio;

      // Interpolate from White [255,255,255] to subtle Pastel Dark Yellow [200, 165, 60]
      const r = Math.round(255 - peakIntensity * (255 - 200));
      const g = Math.round(255 - peakIntensity * (255 - 165));
      const b_val = Math.round(255 - peakIntensity * (255 - 60));

      gradientColors.push(`rgba(${r}, ${g}, ${b_val}, ${alpha.toFixed(2)})`);
    }

    // Group segments by height to dramatically minimize stroke() calls
    for (let b = 0; b < BUCKET_COUNT; b++) {
      ctx.beginPath();

      for (let j = 0; j < linePoints.length - 1; j++) {
        const p1 = linePoints[j];
        const p2 = linePoints[j + 1];

        // Grab the max height of the segment to determine bucket
        // Multiply by 2.2 because the procedural noise rarely naturally maxes out above 0.45.
        const visualHeight = Math.max(p1.h, p2.h) * 2.2;
        let bucketIdx = Math.floor(visualHeight * BUCKET_COUNT);
        if (bucketIdx >= BUCKET_COUNT) bucketIdx = BUCKET_COUNT - 1;

        if (bucketIdx === b) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }

      ctx.strokeStyle = gradientColors[b];
      ctx.stroke();
    }
  }
}

