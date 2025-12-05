/**
 * StructureSpriteGenerator - Procedurally generates space stations and structures
 *
 * Features:
 * - Space stations (trading, military, research)
 * - Dockyards and shipyards
 * - Satellites and communication arrays
 * - Megastructures (ring worlds, Dyson spheres)
 * - Wrecks and debris fields
 */

export class StructureSpriteGenerator {
  constructor() {
    this.spriteCache = new Map();
  }

  /**
   * Generate space station sprite
   */
  async generateStationSprite(config) {
    const {
      type = 'trading',  // trading, military, research, dockyard
      size = 128,
      seed = Math.random() * 10000,
      pixelSize = 0.5,
      animationFrames = 8  // Slow rotation
    } = config;

    // Create high-res sprite sheet for animation
    const frameSize = size * 3;  // Extra space for structures
    const canvas = document.createElement('canvas');
    canvas.width = frameSize * animationFrames;
    canvas.height = frameSize;
    const ctx = canvas.getContext('2d');

    const rng = this.seededRandom(seed);

    // Generate each rotation frame
    for (let frame = 0; frame < animationFrames; frame++) {
      const rotation = (frame / animationFrames) * Math.PI * 2;
      const offsetX = frame * frameSize + frameSize / 2;
      const offsetY = frameSize / 2;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.rotate(rotation);

      // Render station based on type
      switch (type) {
        case 'trading':
          this.renderTradingStation(ctx, size, rng, pixelSize);
          break;
        case 'military':
          this.renderMilitaryStation(ctx, size, rng, pixelSize);
          break;
        case 'research':
          this.renderResearchStation(ctx, size, rng, pixelSize);
          break;
        case 'dockyard':
          this.renderDockyard(ctx, size, rng, pixelSize);
          break;
        default:
          this.renderTradingStation(ctx, size, rng, pixelSize);
      }

      ctx.restore();
    }

    const imageBitmap = await createImageBitmap(canvas);

    return {
      name: `station_${type}_${seed}`,
      image: imageBitmap,
      width: canvas.width,
      height: canvas.height,
      frameWidth: frameSize,
      frameHeight: frameSize,
      frameCount: animationFrames,
      frames: Array.from({ length: animationFrames }, (_, i) => ({
        index: i,
        x: i * frameSize,
        y: 0,
        width: frameSize,
        height: frameSize
      }))
    };
  }

  /**
   * Render trading station - circular hub with docking arms
   */
  renderTradingStation(ctx, size, rng, pixelSize) {
    // Central hub
    ctx.fillStyle = '#4a5a6a';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Hub details (windows and panels)
    ctx.fillStyle = '#88ccff';
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.35;
      const y = Math.sin(angle) * size * 0.35;
      ctx.fillRect(x - pixelSize, y - pixelSize, pixelSize * 2, pixelSize * 2);
    }

    // Docking arms (4 arms)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);

      // Arm structure
      ctx.fillStyle = '#5a6a7a';
      ctx.save();
      ctx.rotate(angle);
      ctx.fillRect(size * 0.35, -size * 0.08, size * 0.5, size * 0.16);

      // Docking port at end
      ctx.fillStyle = '#3a4a5a';
      ctx.fillRect(size * 0.8, -size * 0.12, size * 0.15, size * 0.24);

      // Docking lights
      ctx.fillStyle = '#44ff44';
      ctx.fillRect(size * 0.85, -size * 0.08, pixelSize * 3, pixelSize * 3);
      ctx.fillRect(size * 0.85, size * 0.05, pixelSize * 3, pixelSize * 3);

      ctx.restore();
    }

    // Central antenna
    ctx.fillStyle = '#8a9aaa';
    ctx.fillRect(-pixelSize * 2, -size * 0.6, pixelSize * 4, size * 0.25);

    // Antenna dish
    ctx.fillStyle = '#6a7a8a';
    ctx.fillRect(-size * 0.1, -size * 0.65, size * 0.2, size * 0.1);
  }

  /**
   * Render military station - fortified with weapons
   */
  renderMilitaryStation(ctx, size, rng, pixelSize) {
    // Main hull (hexagonal)
    ctx.fillStyle = '#3a3a4a';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.45;
      const y = Math.sin(angle) * size * 0.45;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Armor plating
    ctx.fillStyle = '#4a4a5a';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.4;
      const y = Math.sin(angle) * size * 0.4;
      ctx.fillRect(x - pixelSize * 4, y - pixelSize * 4, pixelSize * 8, pixelSize * 8);
    }

    // Weapon turrets (8 turrets)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.5;
      const y = Math.sin(angle) * size * 0.5;

      // Turret base
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(x - pixelSize * 5, y - pixelSize * 5, pixelSize * 10, pixelSize * 10);

      // Turret barrel
      ctx.fillStyle = '#555555';
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillRect(0, -pixelSize * 2, size * 0.15, pixelSize * 4);
      ctx.restore();

      // Barrel tip (red)
      ctx.fillStyle = '#ff4444';
      const barrelX = x + Math.cos(angle) * size * 0.15;
      const barrelY = y + Math.sin(angle) * size * 0.15;
      ctx.fillRect(barrelX - pixelSize, barrelY - pixelSize, pixelSize * 2, pixelSize * 2);
    }

    // Central command center
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render research station - modular with labs
   */
  renderResearchStation(ctx, size, rng, pixelSize) {
    // Central ring
    ctx.strokeStyle = '#5a7a9a';
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // Research modules (6 modules around ring)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.4;
      const y = Math.sin(angle) * size * 0.4;

      // Module housing
      ctx.fillStyle = '#4a6a8a';
      ctx.fillRect(x - size * 0.12, y - size * 0.08, size * 0.24, size * 0.16);

      // Module windows (glowing)
      ctx.fillStyle = '#88ccff';
      for (let j = 0; j < 4; j++) {
        ctx.fillRect(x - size * 0.1 + j * pixelSize * 5, y - pixelSize * 2, pixelSize * 3, pixelSize * 4);
      }
    }

    // Solar panel arrays
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);

      // Panel array
      ctx.fillStyle = '#2244aa';
      ctx.fillRect(size * 0.55, -size * 0.25, size * 0.3, size * 0.5);

      // Solar cells
      ctx.fillStyle = '#3355cc';
      for (let x = 0; x < size * 0.3; x += pixelSize * 4) {
        for (let y = 0; y < size * 0.5; y += pixelSize * 4) {
          ctx.fillRect(size * 0.55 + x, -size * 0.25 + y, pixelSize * 3, pixelSize * 3);
        }
      }

      ctx.restore();
    }

    // Central lab core
    ctx.fillStyle = '#88ff88';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render dockyard - shipyard with construction bays
   */
  renderDockyard(ctx, size, rng, pixelSize) {
    // Main structure (rectangular)
    ctx.fillStyle = '#5a5a4a';
    ctx.fillRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6);

    // Construction bays (3 bays)
    for (let i = 0; i < 3; i++) {
      const y = -size * 0.4 + i * size * 0.4;

      // Bay opening
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(-size * 0.5, y - size * 0.15, size * 0.8, size * 0.3);

      // Bay framework
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = pixelSize * 2;
      ctx.strokeRect(-size * 0.5, y - size * 0.15, size * 0.8, size * 0.3);

      // Ship under construction (partial)
      if (i === 1) {
        ctx.fillStyle = '#4a6a8a';
        ctx.fillRect(-size * 0.3, y - size * 0.08, size * 0.4, size * 0.16);
      }
    }

    // Crane arms
    for (let i = 0; i < 2; i++) {
      const x = -size * 0.4 + i * size * 0.8;

      // Crane structure
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(x - pixelSize * 3, -size * 0.5, pixelSize * 6, size);

      // Crane hook
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(x - pixelSize * 5, -size * 0.3, pixelSize * 10, pixelSize * 8);
    }

    // Control tower
    ctx.fillStyle = '#6a6a5a';
    ctx.fillRect(-size * 0.1, -size * 0.5, size * 0.2, size * 0.3);

    // Tower windows
    ctx.fillStyle = '#88ccff';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(-size * 0.05, -size * 0.45 + i * pixelSize * 8, pixelSize * 4, pixelSize * 4);
    }
  }

  /**
   * Generate satellite sprite
   */
  async generateSatelliteSprite(config) {
    const {
      type = 'comm',  // comm, spy, defense, mining
      size = 32,
      seed = Math.random() * 10000,
      pixelSize = 0.5
    } = config;

    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');

    const rng = this.seededRandom(seed);

    ctx.save();
    ctx.translate(size, size);

    // Main body
    ctx.fillStyle = '#4a5a6a';
    ctx.fillRect(-size * 0.25, -size * 0.3, size * 0.5, size * 0.6);

    // Solar panels (extending from sides)
    ctx.fillStyle = '#2244aa';
    ctx.fillRect(-size * 0.8, -size * 0.15, size * 0.5, size * 0.3);
    ctx.fillRect(size * 0.3, -size * 0.15, size * 0.5, size * 0.3);

    // Solar cells
    ctx.fillStyle = '#3355cc';
    for (let x = -size * 0.8; x < -size * 0.3; x += pixelSize * 4) {
      for (let y = -size * 0.15; y < size * 0.15; y += pixelSize * 4) {
        ctx.fillRect(x, y, pixelSize * 3, pixelSize * 3);
        ctx.fillRect(x + size * 1.1, y, pixelSize * 3, pixelSize * 3);
      }
    }

    // Equipment based on type
    if (type === 'comm') {
      // Communication dish
      ctx.fillStyle = '#6a7a8a';
      ctx.beginPath();
      ctx.arc(0, -size * 0.4, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'spy') {
      // Camera lens
      ctx.fillStyle = '#333333';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4488ff';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'defense') {
      // Laser weapon
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(-size * 0.05, -size * 0.5, size * 0.1, size * 0.3);
    }

    // Antenna
    ctx.fillStyle = '#8a9aaa';
    ctx.fillRect(-pixelSize, size * 0.3, pixelSize * 2, size * 0.2);

    ctx.restore();

    const imageBitmap = await createImageBitmap(canvas);

    return {
      name: `satellite_${type}_${seed}`,
      image: imageBitmap,
      width: canvas.width,
      height: canvas.height,
      frameWidth: canvas.width,
      frameHeight: canvas.height,
      frameCount: 1
    };
  }

  /**
   * Generate wreckage sprite
   */
  async generateWreckageSprite(config) {
    const {
      sourceType = 'ship',  // ship, station
      size = 64,
      seed = Math.random() * 10000,
      pixelSize = 0.5,
      damageLevel = 0.7  // 0-1, how destroyed it is
    } = config;

    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');

    const rng = this.seededRandom(seed);

    ctx.save();
    ctx.translate(size, size);

    // Damaged hull pieces
    ctx.fillStyle = '#3a3a3a';

    // Randomized broken pieces
    const pieceCount = Math.floor(5 + rng() * 5);
    for (let i = 0; i < pieceCount; i++) {
      const x = (rng() - 0.5) * size * 0.8;
      const y = (rng() - 0.5) * size * 0.8;
      const w = size * (0.1 + rng() * 0.2);
      const h = size * (0.1 + rng() * 0.2);
      const rotation = rng() * Math.PI * 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Damage marks (burn marks)
      ctx.fillStyle = '#2a2a1a';
      ctx.fillRect(-w / 3, -h / 3, w * 0.6, h * 0.6);
      ctx.restore();
    }

    // Exposed internal structure
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = pixelSize * 2;
    for (let i = 0; i < 3; i++) {
      const x1 = (rng() - 0.5) * size * 0.6;
      const y1 = (rng() - 0.5) * size * 0.6;
      const x2 = (rng() - 0.5) * size * 0.6;
      const y2 = (rng() - 0.5) * size * 0.6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Sparking electronics
    if (rng() > 0.5) {
      ctx.fillStyle = '#ffff00';
      const sparkX = (rng() - 0.5) * size * 0.5;
      const sparkY = (rng() - 0.5) * size * 0.5;
      ctx.fillRect(sparkX, sparkY, pixelSize * 3, pixelSize * 3);
    }

    ctx.restore();

    const imageBitmap = await createImageBitmap(canvas);

    return {
      name: `wreckage_${sourceType}_${seed}`,
      image: imageBitmap,
      width: canvas.width,
      height: canvas.height,
      frameWidth: canvas.width,
      frameHeight: canvas.height,
      frameCount: 1
    };
  }

  /**
   * Seeded random number generator
   */
  seededRandom(seed) {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
}
