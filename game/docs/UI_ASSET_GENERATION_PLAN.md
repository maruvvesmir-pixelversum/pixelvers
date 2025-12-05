# UI Asset Generation System - Comprehensive Plan

## Overview
Create a complete UI asset generation system that produces **heavily pixelated, CRT monitor-themed interface elements** with realistic depth, 3D effects, and space-themed aesthetics. All assets will be procedurally generated using thousands of tiny pixels to create detailed, retro-futuristic textures.

## Design Philosophy

### Visual Style
- **Heavily Pixelated**: Every texture composed of thousands of tiny 0.5-1px pixels
- **CRT Monitor Aesthetic**: Scanlines, phosphor glow, screen curvature simulation
- **3D Depth**: Beveled edges, shadow layers, highlight layers, embossed details
- **Space Theme**: Control panels, status displays, tactical screens, holographic effects
- **Decorative Rich**: Corner embellishments, rivets, panel seams, warning stripes, LED indicators
- **Material Realism**: Metallic surfaces, glass screens, worn paint, scratches, dust

### Technical Specifications
- **Pixel Size**: 0.5-1px for maximum detail (configurable per asset type)
- **Color Palette**:
  - Panel metals: #1a1a2e (dark), #2a2a3e (mid), #3a3a4e (light), #4a4a5e (highlight)
  - CRT screens: #0a3a2a (dark green), #1a5a3a (green), #2a7a4a (bright green)
  - Accent colors: #ff6600 (warning orange), #ff0000 (alert red), #00ff00 (status green), #00aaff (info blue)
  - Holographic: #4488ff, #88ddff, #aaffff with alpha gradients
- **Resolution**: Adaptive based on screen size (supports 1080p, 1440p, 4K)
- **Performance**: Pre-generated and cached, <50ms load time per asset
- **Format**: Canvas-based generation → ImageBitmap conversion for GPU acceleration

---

## Part 1: Core UI Asset Generator Architecture

### File Structure
```
game/src/engine/ui/
├── UIAssetGenerator.js          # Main generator class
├── CRTMonitorGenerator.js       # CRT screen effects generator
├── PanelGenerator.js            # 3D panel/frame generator
├── ButtonGenerator.js           # Interactive button generator
├── IndicatorGenerator.js        # LED/status indicator generator
├── HUDElementGenerator.js       # HUD-specific components
├── decorative/
│   ├── RivetGenerator.js        # Panel rivets/bolts
│   ├── SeamGenerator.js         # Panel seams/joints
│   ├── WarningStripesGenerator.js
│   └── CornerEmbellishmentGenerator.js
└── effects/
    ├── ScanlineEffect.js        # CRT scanlines
    ├── PhosphorGlowEffect.js    # CRT glow
    ├── HolographicEffect.js     # Hologram shimmer
    └── StaticNoiseEffect.js     # Screen static/interference
```

### UIAssetGenerator.js - Core Class
```javascript
export class UIAssetGenerator {
  constructor() {
    this.pixelSize = 0.5;  // Tiny pixels for detail
    this.assetCache = new Map();

    // Sub-generators
    this.crtGen = new CRTMonitorGenerator();
    this.panelGen = new PanelGenerator();
    this.buttonGen = new ButtonGenerator();
    this.indicatorGen = new IndicatorGenerator();
    this.hudGen = new HUDElementGenerator();

    // Color palettes
    this.palettes = this.initializePalettes();
  }

  async generateAsset(type, config) {
    const cacheKey = `${type}_${JSON.stringify(config)}`;
    if (this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey);
    }

    let asset;
    switch(type) {
      case 'crt_monitor': asset = await this.crtGen.generate(config); break;
      case 'panel': asset = await this.panelGen.generate(config); break;
      case 'button': asset = await this.buttonGen.generate(config); break;
      case 'indicator': asset = await this.indicatorGen.generate(config); break;
      case 'hud_element': asset = await this.hudGen.generate(config); break;
      // ... more types
    }

    this.assetCache.set(cacheKey, asset);
    return asset;
  }

  // Pixel rendering helper - ensures tiny pixel precision
  fillPixelatedRect(ctx, x, y, w, h, color, pixelSize = 0.5) {
    ctx.fillStyle = color;
    for (let py = 0; py < h; py += pixelSize) {
      for (let px = 0; px < w; px += pixelSize) {
        ctx.fillRect(
          Math.floor(x + px),
          Math.floor(y + py),
          Math.ceil(pixelSize),
          Math.ceil(pixelSize)
        );
      }
    }
  }
}
```

---

## Part 2: CRT Monitor Generation (Screens & Displays)

### CRTMonitorGenerator.js
Generates authentic CRT monitor screens with:
- **Screen curvature** (subtle bulge simulation via gradients)
- **Phosphor glow** (green/amber screen glow)
- **Scanlines** (horizontal lines at 0.5px height, 2px spacing)
- **Screen flicker** (subtle brightness variation)
- **Glass reflection** (diagonal highlight streak)
- **Bezel frame** (3D beveled border with depth)

### Generation Steps:
1. **Base Frame** (3D beveled panel):
   ```
   Outer dark edge (shadow) → Mid-tone body → Highlight edge (light source)
   Add corner rivets, panel seams, manufacturer label
   ```

2. **Screen Glass Layer**:
   ```
   Dark inner bezel → Glass surface with curvature simulation
   Apply phosphor base color (#0a3a2a for green CRT)
   ```

3. **Scanline Overlay**:
   ```
   Horizontal lines every 2px, 0.5px height
   Color: rgba(0, 255, 0, 0.15) for green, alpha varies per line for authenticity
   ```

4. **Phosphor Glow**:
   ```
   Radial gradient from center: bright → dim at edges
   Center: rgba(0, 255, 0, 0.8), Edge: rgba(0, 255, 0, 0.3)
   ```

5. **Glass Reflection**:
   ```
   Diagonal streak (top-left to bottom-right)
   White with alpha gradient (0.4 → 0.0)
   ```

6. **Content Area**:
   ```
   Return safe rendering area coordinates (inset from bezel)
   Content rendered here will have scanlines/glow applied automatically
   ```

### Asset Variations:
- **Green monochrome** (classic terminal)
- **Amber monochrome** (IBM-style)
- **Color CRT** (RGB phosphor triad simulation)
- **Tactical display** (blue/cyan theme)
- **Warning display** (red/orange theme)

---

## Part 3: Panel Generation (Frames & Backgrounds)

### PanelGenerator.js
Creates 3D space-themed panels with:
- **Beveled edges** (3-layer depth: dark/mid/highlight)
- **Panel rivets** (corner and edge bolts with shadows)
- **Seams and joints** (connecting plates)
- **Warning stripes** (yellow/black diagonal)
- **Wear and tear** (scratches, paint chips)
- **Status LEDs** (corner indicators)

### Panel Types:

#### 1. Control Panel (Buttons & Switches)
```
┌─────────────────┐
│ ●  ■  ▲  ▼  ◄ ►│  ← Indicators at top
│                 │
│  [FIRE] [SHIELD]│  ← Large action buttons
│  [SCAN] [WARP]  │
│                 │
│  ⚡ 100%  🛡️ 85% │  ← Status readouts
└─────────────────┘
```

#### 2. Information Panel (Displays & Readouts)
```
┌─────────────────┐
│ ╔═════════════╗ │  ← CRT screen embedded
│ ║  TACTICAL   ║ │
│ ║   DISPLAY   ║ │
│ ╚═════════════╝ │
│                 │
│ [++++++------]  │  ← Progress bars
│ HULL: ████████  │
└─────────────────┘
```

#### 3. Decorative Panel (Background Filler)
```
┌─────────────────┐
│ ●            ● │  ← Corner rivets
│                 │
│   ═══════════   │  ← Decorative lines
│                 │
│ ●            ● │
└─────────────────┘
```

### Rendering Layers (Bottom to Top):
1. **Shadow Layer** (Dark outline, offset down-right)
2. **Base Panel** (Mid-tone color with pixelated texture)
3. **Bevel Highlight** (Top-left edges, bright)
4. **Bevel Shadow** (Bottom-right edges, dark)
5. **Rivets** (Corners and edges, with shadows)
6. **Seams** (Panel connections, subtle lines)
7. **Decorative Elements** (Stripes, labels, logos)
8. **Wear Layer** (Scratches, dirt, aging effects)

---

## Part 4: Button Generation (Interactive Elements)

### ButtonGenerator.js
Creates pressable buttons with states:
- **Normal** (raised, highlighted top-left)
- **Hover** (subtle glow, brighter highlight)
- **Pressed** (inverted shadow, appears sunken)
- **Disabled** (desaturated, no highlight)

### Button Styles:

#### 1. Rectangular Button (Primary Actions)
```
╔═══════╗  ← Highlight edge (2px)
║ FIRE  ║  ← Label centered
╚═══════╝  ← Shadow edge (2px)
```
- Size: 80x30px minimum
- Beveled edges with 3D depth
- LED indicator dot (top-right corner)
- Pixelated label font (8px height)

#### 2. Circular Button (Toggle/Switch)
```
   ╱───╲    ← Glass dome effect
  │  ●  │   ← LED indicator inside
   ╲───╱
```
- Diameter: 40px minimum
- Radial gradient for dome effect
- Inner LED changes color (green/red/amber)

#### 3. Icon Button (Small Actions)
```
┌───┐
│ ▶ │  ← Icon centered
└───┘
```
- Size: 24x24px
- Minimal bevel, more compact
- Used in toolbars

### Button Rendering:
```javascript
renderButton(type, state, label) {
  // 1. Base shape with bevel
  // 2. State-dependent shadows
  // 3. Label/icon rendering
  // 4. LED indicator (if applicable)
  // 5. Glass shine effect (top-left to bottom-right)
}
```

---

## Part 5: Indicator Generation (LEDs & Status Lights)

### IndicatorGenerator.js
Creates various indicator types:

#### 1. LED Indicator (Circular)
```
  ╱─╲      Outer bezel (dark)
 ( ● )     Inner LED (glowing)
  ╲─╱      Reflection (top highlight)
```
- Size: 8-16px diameter
- Colors: red, green, amber, blue
- Glow effect (radial gradient)
- Pulsing animation support

#### 2. Bar Graph (Horizontal/Vertical)
```
┌─────────────┐
│████████░░░░░│  ← Filled portion
└─────────────┘
```
- Segmented bars (8-12 segments)
- Color gradient (green → yellow → red)
- Pixelated fill pattern

#### 3. Seven-Segment Display (Numeric)
```
 ▀▀▀   ← Top segment
▐   ▌  ← Left/right
 ▀▀▀   ← Middle
▐   ▌
 ▀▀▀   ← Bottom
```
- Classic LED digit style
- Green/red/amber phosphor
- Subtle glow per segment

#### 4. Warning Light (Animated)
```
  /!\    ← Hazard symbol
 /███\   ← Flashing yellow
/█████\
```
- Triangle shape
- Alternating flash (yellow/black)
- Hazard stripe pattern

---

## Part 6: HUD Element Generation (In-Game Overlays)

### HUDElementGenerator.js
Creates in-game HUD components:

#### 1. Status Panel (Ship Systems)
```
╔══════════════════╗
║ HULL     ████░░░ ║  ← Health bar
║ SHIELDS  ██████░ ║  ← Shield bar
║ ENERGY   ███████ ║  ← Energy bar
╠══════════════════╣
║ SPEED:   450 m/s║  ← Numeric readouts
║ TEMP:    72 °C  ║
╚══════════════════╝
```
Features:
- Translucent background (alpha 0.7)
- CRT-style scanlines over entire panel
- Real-time value updates
- Color-coded bars (red/yellow/green)

#### 2. Minimap/Radar
```
┌──────────────┐
│  ┏━━━━━━━┓  │  ← Radar screen
│  ┃  ●    ┃  │  ← Player (center)
│  ┃ ○ ○   ┃  │  ← Enemies/objects
│  ┗━━━━━━━┛  │
│  [SCAN] 360°│  ← Range indicator
└──────────────┘
```
Features:
- Circular/square radar grid
- Rotating scan line
- Target markers with distance
- Green phosphor style

#### 3. Crosshair/Target Reticle
```
    │
────┼────  ← Crosshair lines
    │
  ┌───┐    ← Target box (enemy in range)
  │ ● │
  └───┘
```
Features:
- Animated lock-on sequence
- Color changes: gray → yellow → red (locked)
- Distance and threat level display

#### 4. Notification Toast
```
┌─────────────────────┐
│ ⚠ LOW FUEL WARNING │
└─────────────────────┘
```
Features:
- Slides in from top-right
- Auto-dismiss after 3 seconds
- Icon based on type (info/warning/error)
- Semi-transparent background

---

## Part 7: Scene-Specific Assets

### 7.1 Main Menu Scene
```
════════════════════════════════════
█████ PIXELVERS █████
════════════════════════════════════

  ┌─────────────┐
  │  NEW GAME   │  ← Large buttons
  └─────────────┘
  ┌─────────────┐
  │ LOAD GAME   │
  └─────────────┘
  ┌─────────────┐
  │  SETTINGS   │
  └─────────────┘
  ┌─────────────┐
  │   CREDITS   │
  └─────────────┘

════════════════════════════════════
v1.0.0            ●●●●●●●  [ONLINE]
════════════════════════════════════
```

Assets Needed:
- Title logo (large pixelated font with glow)
- 4x menu buttons (hover states)
- Background panel (decorative, low opacity)
- Version label
- Connection status indicator
- Animated starfield background

### 7.2 New Game Setup Scene
```
╔══════════════════════════════════╗
║     NEW GAME CONFIGURATION       ║
╠══════════════════════════════════╣
║                                  ║
║  COMMANDER NAME:                 ║
║  ┌────────────────────────────┐  ║
║  │ [Enter Name___________]   │  ║
║  └────────────────────────────┘  ║
║                                  ║
║  SHIP CLASS:                     ║
║  ○ Scout     ○ Explorer          ║
║  ○ Fighter   ○ Trader            ║
║  ○ Research  ○ Military          ║
║                                  ║
║  DIFFICULTY:                     ║
║  [────┼─────────────] Normal     ║
║                                  ║
║  GALAXY SEED: [Random]           ║
║  ┌────────────────────────────┐  ║
║  │ 1234567890____________    │  ║
║  └────────────────────────────┘  ║
║                                  ║
╠══════════════════════════════════╣
║  [START]            [BACK]       ║
╚══════════════════════════════════╝
```

Assets Needed:
- Large panel (600x500px)
- Text input fields (with cursor)
- Radio buttons (ship selection)
- Slider control (difficulty)
- Preview window (ship 3D render)
- Tooltip panels (hover descriptions)

### 7.3 Loading Scene
```
╔══════════════════════════════════╗
║   INITIALIZING WARP DRIVE...     ║
╠══════════════════════════════════╣
║                                  ║
║         ╱╲    ╱╲    ╱╲           ║
║        ╱══╲  ╱══╲  ╱══╲          ║
║       ╱════╲╱════╲╱════╲         ║
║                                  ║
║  [████████████░░░░░░░░] 65%      ║
║                                  ║
║  > Generating galaxy...          ║
║  > Creating star systems...      ║
║  > Spawning player...            ║
║                                  ║
╚══════════════════════════════════╝
```

Assets Needed:
- Loading panel (400x300px)
- Animated loading spinner/warp effect
- Progress bar (segmented, animated)
- Status text area (scrolling log)
- Background (animated hyperjump effect)

### 7.4 Settings Scene
```
╔══════════════════════════════════╗
║           SETTINGS               ║
╠══════════════════════════════════╣
║  ┌─────────┬──────────────────┐  ║
║  │ GRAPHICS│ Volume:          │  ║
║  │ AUDIO   │ [─────┼────] 75% │  ║
║  │ CONTROLS│                  │  ║
║  │ GAMEPLAY│ Music:           │  ║
║  │         │ [───┼──────] 50% │  ║
║  │         │                  │  ║
║  │         │ SFX:             │  ║
║  │         │ [────────┼─] 90% │  ║
║  │         │                  │  ║
║  │         │ [✓] Master       │  ║
║  │         │ [✓] Ambient      │  ║
║  │         │ [ ] Voice        │  ║
║  └─────────┴──────────────────┘  ║
╠══════════════════════════════════╣
║  [APPLY]  [DEFAULTS]  [BACK]     ║
╚══════════════════════════════════╝
```

Assets Needed:
- Tab buttons (vertical)
- Slider controls (horizontal)
- Checkboxes (checked/unchecked states)
- Dropdown menus
- Key binding display
- Reset confirmation modal

---

## Part 8: Implementation Plan

### Phase 1: Core Generator Framework (Week 1)
- [ ] Create UIAssetGenerator base class
- [ ] Implement pixel rendering helpers
- [ ] Set up color palette system
- [ ] Create asset caching mechanism
- [ ] Build testing/preview tool

### Phase 2: Basic Components (Week 2)
- [ ] PanelGenerator (3D frames)
- [ ] ButtonGenerator (all states)
- [ ] Basic LED indicators
- [ ] Simple CRT screen effect

### Phase 3: Advanced Components (Week 3)
- [ ] Full CRTMonitorGenerator
- [ ] HUDElementGenerator
- [ ] Advanced indicators (bars, segments)
- [ ] Decorative elements (rivets, seams)

### Phase 4: Scene Assets (Week 4)
- [ ] Main menu assets
- [ ] Loading screen assets
- [ ] Settings screen assets
- [ ] New game setup assets

### Phase 5: HUD Integration (Week 5)
- [ ] In-game status panels
- [ ] Minimap/radar
- [ ] Crosshair/targeting
- [ ] Notification system

### Phase 6: Polish & Optimization (Week 6)
- [ ] Animation system
- [ ] Responsive sizing
- [ ] Performance optimization
- [ ] Asset preloading
- [ ] Theme variations

---

## Part 9: Usage Examples

### Example 1: Generate Main Menu Button
```javascript
const uiGen = new UIAssetGenerator();

const fireButton = await uiGen.generateAsset('button', {
  type: 'rectangular',
  label: 'FIRE',
  width: 80,
  height: 30,
  state: 'normal',
  color: 'red',
  ledIndicator: true,
  ledColor: 'green'
});

// Use in render loop
ctx.drawImage(fireButton.canvas, x, y);
```

### Example 2: Generate HUD Status Panel
```javascript
const statusPanel = await uiGen.generateAsset('hud_element', {
  type: 'status_panel',
  width: 200,
  height: 150,
  transparency: 0.7,
  components: [
    { type: 'bar', label: 'HULL', value: 0.8, color: 'green' },
    { type: 'bar', label: 'SHIELDS', value: 0.6, color: 'blue' },
    { type: 'bar', label: 'ENERGY', value: 0.9, color: 'cyan' }
  ]
});
```

### Example 3: Generate CRT Tactical Display
```javascript
const tacticalDisplay = await uiGen.generateAsset('crt_monitor', {
  width: 400,
  height: 300,
  phosphorColor: 'green',
  bezelStyle: 'military',
  scanlineIntensity: 0.3,
  curveAmount: 0.05
});

// Render content into display
const contentCtx = tacticalDisplay.getContentContext();
contentCtx.drawImage(radarMap, 0, 0);
```

---

## Part 10: Performance Considerations

### Optimization Strategies:
1. **Pre-generation**: Generate all static assets during loading screen
2. **Caching**: Cache generated ImageBitmaps, never regenerate
3. **Lazy Loading**: Generate assets only when scene is loaded
4. **Resolution Scaling**: Generate lower-res assets for smaller screens
5. **Sprite Atlases**: Combine small assets into single texture
6. **State Variants**: Pre-generate button states (normal/hover/pressed)

### Memory Management:
- Max cache size: 50MB
- LRU eviction for unused assets
- Cleanup on scene transitions
- Shared base textures (same panel, different labels)

### Rendering Performance:
- Use `drawImage()` for cached assets (GPU accelerated)
- Minimize live canvas operations
- Batch UI updates (max 60fps)
- Use requestAnimationFrame for animations

---

## Part 11: Accessibility & Customization

### User Options:
- **Scanline Intensity**: 0-100% (disable for readability)
- **Phosphor Glow**: On/Off
- **Panel Opacity**: 50-100%
- **Color Themes**: Green CRT, Amber, Blue, Color
- **Text Size**: Small/Medium/Large
- **High Contrast Mode**: Boosts colors, removes decorative elements

### Colorblind Support:
- Alternative color schemes
- Icon-based indicators (not just color)
- Pattern overlays on bars

---

## Success Criteria

### Visual Quality:
- ✓ All textures composed of thousands of visible tiny pixels
- ✓ Authentic CRT monitor appearance with scanlines and glow
- ✓ Clear 3D depth on all panels and buttons
- ✓ Rich decorative details (rivets, seams, wear)
- ✓ Smooth animations (60fps)

### Technical Performance:
- ✓ All assets load in <2 seconds total
- ✓ No frame drops during UI rendering
- ✓ Memory usage <100MB for all UI assets
- ✓ Responsive to all screen sizes (720p-4K)

### User Experience:
- ✓ Intuitive button interactions (clear hover/press feedback)
- ✓ Readable text at all resolutions
- ✓ Accessibility options work correctly
- ✓ Theme variations are visually distinct
- ✓ HUD elements don't obscure gameplay

---

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Create prototype** of single component (e.g., button)
3. **Validate visual style** against concept art
4. **Begin Phase 1 implementation**
5. **Set up automated testing** for asset generation
6. **Create style guide** for consistent asset creation

---

*Document Version: 1.0*
*Last Updated: 2025-12-05*
*Status: Awaiting Implementation*
