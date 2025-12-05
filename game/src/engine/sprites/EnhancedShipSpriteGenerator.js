/**
 * EnhancedShipSpriteGenerator - Procedurally generates detailed spaceship sprites
 *
 * Features:
 * - Heavily pixelated retro aesthetic
 * - Modular components: hull, engines, weapons, antennas, solar panels
 * - Multiple ship classes and types
 * - Detailed turrets, thrusters, and equipment
 */

export class EnhancedShipSpriteGenerator {
  constructor() {
    this.spriteCache = new Map();
    this.shipTypes = {
      // Player ships
      fighter: { size: 32, components: ['hull', 'cockpit', 'wings', 'engines', 'weapons'] },
      interceptor: { size: 28, components: ['hull', 'cockpit', 'wings', 'engines'] },
      corvette: { size: 48, components: ['hull', 'cockpit', 'engines', 'weapons', 'turrets'] },
      frigate: { size: 64, components: ['hull', 'bridge', 'engines', 'weapons', 'turrets', 'antenna'] },
      destroyer: { size: 96, components: ['hull', 'bridge', 'engines', 'weapons', 'turrets', 'antenna', 'solar'] },
      cruiser: { size: 128, components: ['hull', 'bridge', 'engines', 'weapons', 'turrets', 'antenna', 'solar', 'reactor'] },
      battleship: { size: 160, components: ['hull', 'bridge', 'engines', 'weapons', 'turrets', 'antenna', 'solar', 'reactor', 'armor'] },

      // Civilian ships
      trader: { size: 56, components: ['hull', 'cargo', 'engines', 'antenna'] },
      transport: { size: 80, components: ['hull', 'cargo', 'engines', 'antenna', 'solar'] },
      mining: { size: 64, components: ['hull', 'drill', 'cargo', 'engines', 'antenna'] },

      // Alien ships
      alien_scout: { size: 40, components: ['organic_hull', 'bio_engines'] },
      alien_fighter: { size: 52, components: ['organic_hull', 'bio_engines', 'bio_weapons'] },
      alien_cruiser: { size: 96, components: ['organic_hull', 'bio_engines', 'bio_weapons', 'bio_armor'] }
    };
  }

  /**
   * Generate a detailed spaceship sprite
   */
  async generateShipSprite(config) {
    const {
      type = 'fighter',
      variant = 0,
      seed = Math.random() * 10000,
      pixelSize = 0.5
    } = config;

    const shipConfig = this.shipTypes[type] || this.shipTypes.fighter;
    const size = shipConfig.size;

    // Create high-res canvas for tiny pixels
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;  // Extra space for components
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');

    // Seeded random
    const rng = this.seededRandom(seed);

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate ship based on type
    if (type.startsWith('alien_')) {
      this.renderAlienShip(ctx, size, shipConfig.components, rng, pixelSize);
    } else {
      this.renderHumanShip(ctx, size, shipConfig.components, rng, pixelSize, variant);
    }

    // Convert to ImageBitmap for better performance
    const imageBitmap = await createImageBitmap(canvas);

    return {
      name: `ship_${type}_${variant}`,
      image: imageBitmap,
      width: canvas.width,
      height: canvas.height,
      frameWidth: canvas.width,
      frameHeight: canvas.height,
      frameCount: 1,
      frames: [{
        index: 0,
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
      }]
    };
  }

  /**
   * Render human/standard spaceship with modular components
   */
  renderHumanShip(ctx, size, components, rng, pixelSize, variant) {
    const centerX = size;
    const centerY = size;

    // Color schemes based on variant
    const colorSchemes = [
      { primary: '#3a4f6f', secondary: '#5a7fa0', accent: '#88ccff', engine: '#4488ff' },
      { primary: '#4f3a3a', secondary: '#7a5a5a', accent: '#ff8844', engine: '#ff6622' },
      { primary: '#3a4f3a', secondary: '#5a7a5a', accent: '#88ff88', engine: '#44ff44' },
      { primary: '#4f4f3a', secondary: '#7a7a5a', accent: '#ffcc44', engine: '#ffaa22' }
    ];
    const colors = colorSchemes[variant % colorSchemes.length];

    ctx.save();
    ctx.translate(centerX, centerY);

    // Main hull - heavily pixelated
    if (components.includes('hull')) {
      this.renderPixelatedHull(ctx, size, colors, pixelSize, rng);
    }

    // Cockpit/Bridge
    if (components.includes('cockpit') || components.includes('bridge')) {
      this.renderCockpit(ctx, size, colors, pixelSize);
    }

    // Wings (for smaller ships)
    if (components.includes('wings')) {
      this.renderWings(ctx, size, colors, pixelSize);
    }

    // Engines with detailed thrust ports
    if (components.includes('engines')) {
      this.renderEngines(ctx, size, colors, pixelSize);
    }

    // Weapons and turrets
    if (components.includes('weapons')) {
      this.renderWeapons(ctx, size, colors, pixelSize, rng);
    }

    if (components.includes('turrets')) {
      this.renderTurrets(ctx, size, colors, pixelSize, rng);
    }

    // Equipment
    if (components.includes('antenna')) {
      this.renderAntenna(ctx, size, colors, pixelSize);
    }

    if (components.includes('solar')) {
      this.renderSolarPanels(ctx, size, colors, pixelSize);
    }

    if (components.includes('reactor')) {
      this.renderReactor(ctx, size, colors, pixelSize);
    }

    // Cargo/mining equipment
    if (components.includes('cargo')) {
      this.renderCargoBay(ctx, size, colors, pixelSize);
    }

    if (components.includes('drill')) {
      this.renderMiningDrill(ctx, size, colors, pixelSize);
    }

    ctx.restore();
  }

  /**
   * Render heavily pixelated hull with details
   */
  renderPixelatedHull(ctx, size, colors, pixelSize) {
    const hullWidth = size * 0.8;
    const hullHeight = size * 0.6;

    // Main hull shape - diamond/arrow shape
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.moveTo(hullWidth * 0.4, 0);  // Front point
    ctx.lineTo(-hullWidth * 0.3, -hullHeight * 0.3);  // Top left
    ctx.lineTo(-hullWidth * 0.4, 0);  // Back left
    ctx.lineTo(-hullWidth * 0.3, hullHeight * 0.3);  // Bottom left
    ctx.closePath();
    ctx.fill();

    // Hull panels (pixelated details)
    ctx.fillStyle = colors.secondary;
    for (let y = -hullHeight * 0.25; y < hullHeight * 0.25; y += pixelSize * 4) {
      ctx.fillRect(-hullWidth * 0.35, y, hullWidth * 0.6, pixelSize * 2);
    }

    // Armor plating
    ctx.fillStyle = colors.accent;
    ctx.fillRect(-hullWidth * 0.3, -hullHeight * 0.15, pixelSize * 2, hullHeight * 0.3);
    ctx.fillRect(hullWidth * 0.1, -hullHeight * 0.1, pixelSize * 2, hullHeight * 0.2);
  }

  /**
   * Render detailed cockpit with windows
   */
  renderCockpit(ctx, size, colors, pixelSize) {
    const cockpitWidth = size * 0.3;
    const cockpitHeight = size * 0.2;

    // Cockpit frame
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(size * 0.15, -cockpitHeight / 2, cockpitWidth, cockpitHeight);

    // Window (glowing blue)
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(size * 0.2, -cockpitHeight / 3, cockpitWidth * 0.6, cockpitHeight * 0.6);

    // Window reflection
    ctx.fillStyle = '#88ccff';
    ctx.fillRect(size * 0.22, -cockpitHeight / 4, pixelSize * 3, pixelSize * 2);
  }

  /**
   * Render ship wings
   */
  renderWings(ctx, size, colors, pixelSize) {
    const wingLength = size * 0.4;
    const wingWidth = size * 0.15;

    // Top wing
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(-wingLength * 0.5, -size * 0.4, wingLength, wingWidth);

    // Bottom wing
    ctx.fillRect(-wingLength * 0.5, size * 0.25, wingLength, wingWidth);

    // Wing tips
    ctx.fillStyle = colors.accent;
    ctx.fillRect(wingLength * 0.3, -size * 0.4, pixelSize * 3, wingWidth);
    ctx.fillRect(wingLength * 0.3, size * 0.25, pixelSize * 3, wingWidth);
  }

  /**
   * Render detailed engine ports
   */
  renderEngines(ctx, size, colors, pixelSize) {
    const engineSize = size * 0.15;

    // Main engines (2-4 depending on size)
    const enginePositions = [
      { x: -size * 0.35, y: -size * 0.2 },
      { x: -size * 0.35, y: size * 0.2 }
    ];

    if (size > 60) {
      enginePositions.push(
        { x: -size * 0.3, y: -size * 0.1 },
        { x: -size * 0.3, y: size * 0.1 }
      );
    }

    enginePositions.forEach(pos => {
      // Engine housing
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(pos.x - engineSize, pos.y - engineSize / 2, engineSize * 1.5, engineSize);

      // Engine core
      ctx.fillStyle = colors.engine;
      ctx.fillRect(pos.x - engineSize * 0.8, pos.y - engineSize / 3, engineSize * 0.8, engineSize * 0.6);

      // Engine glow
      ctx.fillStyle = colors.accent;
      ctx.fillRect(pos.x - engineSize * 0.6, pos.y - engineSize / 4, pixelSize * 2, engineSize * 0.5);
    });
  }

  /**
   * Render weapon hardpoints
   */
  renderWeapons(ctx, size, colors, pixelSize, rng) {
    const weaponPositions = [
      { x: size * 0.25, y: -size * 0.15 },
      { x: size * 0.25, y: size * 0.15 }
    ];

    weaponPositions.forEach(pos => {
      // Weapon mount
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(pos.x, pos.y - pixelSize * 3, size * 0.15, pixelSize * 6);

      // Weapon barrel
      ctx.fillStyle = '#666666';
      ctx.fillRect(pos.x + size * 0.15, pos.y - pixelSize * 2, size * 0.1, pixelSize * 4);

      // Weapon tip
      ctx.fillStyle = colors.accent;
      ctx.fillRect(pos.x + size * 0.24, pos.y - pixelSize, pixelSize * 2, pixelSize * 2);
    });
  }

  /**
   * Render rotating turrets
   */
  renderTurrets(ctx, size, colors, pixelSize, rng) {
    const turretPositions = [
      { x: 0, y: -size * 0.25 },
      { x: 0, y: size * 0.25 },
      { x: -size * 0.15, y: 0 }
    ];

    turretPositions.forEach(pos => {
      // Turret base
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(pos.x - pixelSize * 4, pos.y - pixelSize * 4, pixelSize * 8, pixelSize * 8);

      // Turret gun
      ctx.fillStyle = '#555555';
      ctx.fillRect(pos.x - pixelSize * 2, pos.y - pixelSize, pixelSize * 8, pixelSize * 2);

      // Turret barrel tip
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(pos.x + pixelSize * 6, pos.y - pixelSize * 0.5, pixelSize * 2, pixelSize);
    });
  }

  /**
   * Render communication antenna
   */
  renderAntenna(ctx, size, colors, pixelSize) {
    // Antenna mast
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(-size * 0.1, -size * 0.35, pixelSize * 2, size * 0.15);

    // Antenna dish
    ctx.fillStyle = colors.accent;
    ctx.fillRect(-size * 0.15, -size * 0.37, pixelSize * 8, pixelSize * 3);

    // Dish details
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-size * 0.13, -size * 0.36, pixelSize, pixelSize);
  }

  /**
   * Render solar panels
   */
  renderSolarPanels(ctx, size, colors, pixelSize) {
    const panelWidth = size * 0.3;
    const panelHeight = size * 0.15;

    // Left solar panel
    ctx.fillStyle = '#2244aa';
    ctx.fillRect(-size * 0.3, -size * 0.45, panelWidth, panelHeight);

    // Right solar panel
    ctx.fillRect(-size * 0.3, size * 0.3, panelWidth, panelHeight);

    // Solar cells (grid pattern)
    ctx.fillStyle = '#3355cc';
    for (let x = 0; x < panelWidth; x += pixelSize * 4) {
      for (let y = 0; y < panelHeight; y += pixelSize * 4) {
        ctx.fillRect(-size * 0.3 + x, -size * 0.45 + y, pixelSize * 3, pixelSize * 3);
        ctx.fillRect(-size * 0.3 + x, size * 0.3 + y, pixelSize * 3, pixelSize * 3);
      }
    }
  }

  /**
   * Render reactor core
   */
  renderReactor(ctx, size, colors, pixelSize) {
    const reactorSize = size * 0.2;

    // Reactor housing
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-size * 0.25, -reactorSize / 2, reactorSize, reactorSize);

    // Reactor core (glowing)
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(-size * 0.22, -reactorSize / 3, reactorSize * 0.7, reactorSize * 0.6);

    // Reactor vents
    ctx.fillStyle = '#ff6600';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(-size * 0.23 + i * pixelSize * 4, -reactorSize / 4, pixelSize, reactorSize * 0.5);
    }
  }

  /**
   * Render cargo bay
   */
  renderCargoBay(ctx, size, colors, pixelSize) {
    const cargoWidth = size * 0.4;
    const cargoHeight = size * 0.5;

    // Cargo hull (bulky)
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(-size * 0.3, -cargoHeight / 2, cargoWidth, cargoHeight);

    // Cargo door panels
    ctx.fillStyle = colors.primary;
    for (let y = -cargoHeight / 2; y < cargoHeight / 2; y += pixelSize * 6) {
      ctx.fillRect(-size * 0.25, y, cargoWidth * 0.8, pixelSize * 4);
    }
  }

  /**
   * Render mining drill
   */
  renderMiningDrill(ctx, size, colors, pixelSize) {
    // Drill mount
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(size * 0.2, -size * 0.1, size * 0.15, size * 0.2);

    // Drill bit
    ctx.fillStyle = '#888888';
    ctx.fillRect(size * 0.35, -size * 0.05, size * 0.2, size * 0.1);

    // Drill teeth
    ctx.fillStyle = '#aaaaaa';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(size * 0.35 + i * pixelSize * 3, -size * 0.05, pixelSize * 2, size * 0.1);
    }
  }

  /**
   * Render alien/organic ship
   */
  renderAlienShip(ctx, size, components, rng, pixelSize) {
    const centerX = size;
    const centerY = size;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Organic hull with bio-luminescence
    ctx.fillStyle = '#442244';

    // Curved organic shape
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bio-luminescent patterns
    ctx.fillStyle = '#aa44aa';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.3;
      const y = Math.sin(angle) * size * 0.2;
      ctx.fillRect(x, y, pixelSize * 3, pixelSize * 3);
    }

    // Bio engines (pulsating)
    ctx.fillStyle = '#ff44ff';
    ctx.fillRect(-size * 0.4, -size * 0.15, size * 0.15, size * 0.1);
    ctx.fillRect(-size * 0.4, size * 0.05, size * 0.15, size * 0.1);

    ctx.restore();
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
