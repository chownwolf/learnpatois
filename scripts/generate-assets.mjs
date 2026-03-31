import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, '../assets');

// Jamaica colors
const GREEN = '#007A3D';
const GOLD = '#FED100';
const BLACK = '#000000';
const WHITE = '#FFFFFF';

// ─── App Icon SVG (1024×1024) ───────────────────────────────────────────────
// Jamaican flag diagonal saltire with a white circle + "P" monogram
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <clipPath id="round">
      <rect width="1024" height="1024" rx="230" ry="230"/>
    </clipPath>
  </defs>

  <g clip-path="url(#round)">
    <!-- Green background -->
    <rect width="1024" height="1024" fill="${GREEN}"/>

    <!-- Gold diagonal saltire (Jamaican flag cross) -->
    <polygon points="0,0 1024,0 1024,145 652,512 1024,879 1024,1024 0,1024 0,879 372,512 0,145"
             fill="${GOLD}"/>

    <!-- Black left triangle -->
    <polygon points="0,0 0,1024 372,512" fill="${BLACK}"/>
    <!-- Black right triangle -->
    <polygon points="1024,0 1024,1024 652,512" fill="${BLACK}"/>

    <!-- Gold saltire arms (thicker bars) -->
    <polygon points="0,0 145,0 512,367 879,0 1024,0 1024,145 657,512 1024,879 1024,1024 879,1024 512,657 145,1024 0,1024 0,879 367,512 0,145"
             fill="${GOLD}"/>

    <!-- White glow behind circle -->
    <circle cx="512" cy="512" r="222" fill="white" opacity="0.15"/>
    <!-- White circle -->
    <circle cx="512" cy="512" r="205" fill="${WHITE}"/>

    <!-- "P" monogram in Jamaica green -->
    <text
      x="512" y="595"
      font-family="Georgia, 'Times New Roman', serif"
      font-size="270"
      font-weight="bold"
      text-anchor="middle"
      fill="${GREEN}"
    >P</text>

    <!-- Subtle inner shadow ring -->
    <circle cx="512" cy="512" r="205" fill="none" stroke="${GREEN}" stroke-width="6" opacity="0.3"/>
  </g>
</svg>
`.trim();

// ─── Adaptive Icon (Android foreground, 1024×1024 transparent bg) ────────────
// Same design but on transparent — safe zone is centre 66% (672px)
const adaptiveSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- Transparent background -->

  <!-- Outer green circle as base -->
  <circle cx="512" cy="512" r="480" fill="${GREEN}"/>

  <!-- Gold diagonal saltire clipped to circle -->
  <clipPath id="circ">
    <circle cx="512" cy="512" r="480"/>
  </clipPath>
  <g clip-path="url(#circ)">
    <polygon points="0,0 1024,0 1024,145 652,512 1024,879 1024,1024 0,1024 0,879 372,512 0,145"
             fill="${GOLD}"/>
    <polygon points="0,0 0,1024 372,512" fill="${BLACK}"/>
    <polygon points="1024,0 1024,1024 652,512" fill="${BLACK}"/>
    <polygon points="0,0 145,0 512,367 879,0 1024,0 1024,145 657,512 1024,879 1024,1024 879,1024 512,657 145,1024 0,1024 0,879 367,512 0,145"
             fill="${GOLD}"/>
  </g>

  <!-- White circle + P -->
  <circle cx="512" cy="512" r="205" fill="${WHITE}"/>
  <text x="512" y="595"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="270" font-weight="bold"
    text-anchor="middle" fill="${GREEN}">P</text>
</svg>
`.trim();

// ─── Splash Icon SVG (centred logo on transparent, 512×512) ──────────────────
// Expo centres this over the splash backgroundColor
const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Outer green circle -->
  <circle cx="256" cy="256" r="256" fill="${GREEN}"/>

  <clipPath id="c">
    <circle cx="256" cy="256" r="256"/>
  </clipPath>
  <g clip-path="url(#c)">
    <!-- Gold saltire -->
    <polygon points="0,0 512,0 512,72 326,256 512,440 512,512 0,512 0,440 186,256 0,72"
             fill="${GOLD}"/>
    <polygon points="0,0 0,512 186,256" fill="${BLACK}"/>
    <polygon points="512,0 512,512 326,256" fill="${BLACK}"/>
    <polygon points="0,0 72,0 256,184 440,0 512,0 512,72 328,256 512,440 512,512 440,512 256,328 72,512 0,512 0,440 184,256 0,72"
             fill="${GOLD}"/>
  </g>

  <!-- White circle + P -->
  <circle cx="256" cy="256" r="130" fill="${WHITE}"/>
  <text x="256" y="315"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="160" font-weight="bold"
    text-anchor="middle" fill="${GREEN}">P</text>

  <!-- Subtle ring -->
  <circle cx="256" cy="256" r="130" fill="none" stroke="${GREEN}" stroke-width="4" opacity="0.25"/>
</svg>
`.trim();

// ─── Favicon SVG (32×32) ─────────────────────────────────────────────────────
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="16" cy="16" r="16" fill="${GREEN}"/>
  <clipPath id="fc"><circle cx="16" cy="16" r="16"/></clipPath>
  <g clip-path="url(#fc)">
    <polygon points="0,0 32,0 32,5 21,16 32,27 32,32 0,32 0,27 11,16 0,5" fill="${GOLD}"/>
    <polygon points="0,0 0,32 11,16" fill="${BLACK}"/>
    <polygon points="32,0 32,32 21,16" fill="${BLACK}"/>
    <polygon points="0,0 5,0 16,11 27,0 32,0 32,5 21,16 32,27 32,32 27,32 16,21 5,32 0,32 0,27 11,16 0,5" fill="${GOLD}"/>
  </g>
  <circle cx="16" cy="16" r="9" fill="${WHITE}"/>
  <text x="16" y="21" font-family="Georgia,serif" font-size="13" font-weight="bold" text-anchor="middle" fill="${GREEN}">P</text>
</svg>
`.trim();

async function generate() {
  console.log('Generating app assets...\n');

  const tasks = [
    {
      name: 'icon.png (1024×1024)',
      svg: iconSvg,
      out: `${assetsDir}/icon.png`,
      size: 1024,
    },
    {
      name: 'adaptive-icon.png (1024×1024)',
      svg: adaptiveSvg,
      out: `${assetsDir}/adaptive-icon.png`,
      size: 1024,
    },
    {
      name: 'splash-icon.png (512×512)',
      svg: splashSvg,
      out: `${assetsDir}/splash-icon.png`,
      size: 512,
    },
    {
      name: 'favicon.png (32×32)',
      svg: faviconSvg,
      out: `${assetsDir}/favicon.png`,
      size: 32,
    },
  ];

  for (const task of tasks) {
    await sharp(Buffer.from(task.svg))
      .resize(task.size, task.size)
      .png()
      .toFile(task.out);
    console.log(`  ✓ ${task.name}`);
  }

  console.log('\nAll assets generated in /assets/');
}

generate().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
