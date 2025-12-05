/**
 * EnhancedEffectsSystem - Advanced visual effects
 *
 * Features:
 * - Realistic engine thrust with pixelated particles
 * - Side thrusters for maneuvering
 * - Fluid, energetic shield effects
 * - Enhanced explosions with debris
 * - Weapon effects (lasers, projectiles, impacts)
 * - Hull damage effects
 */

export class EnhancedEffectsSystem {
  constructor(game) {
    this.game = game;
    this.particles = [];
    this.shieldEffects = [];
    this.explosions = [];
    this.debrisParticles = [];
    this.weaponEffects = [];

    // Performance limits
    this.maxParticles = 2000;
    this.maxShieldEffects = 100;
    this.maxExplosions = 50;
    this.maxDebris = 500;
  }

  /**
   * Update all effects
   */
  update(dt) {
    // Update engine particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.98;  // Slow down
      p.vy *= 0.98;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update shield effects
    for (let i = this.shieldEffects.length - 1; i >= 0; i--) {
      const s = this.shieldEffects[i];
      s.life -= dt;
      s.phase += dt * 10;  // Animation speed
      s.alpha = Math.max(0, s.life / s.maxLife);

      if (s.life <= 0) {
        this.shieldEffects.splice(i, 1);
      }
    }

    // Update explosions
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const e = this.explosions[i];
      e.life -= dt;
      e.radius += e.expansion * dt;
      e.alpha = Math.max(0, e.life / e.maxLife);

      if (p.life <= 0) {
        this.explosions.splice(i, 1);
      }
    }

    // Update debris
    for (let i = this.debrisParticles.length - 1; i >= 0; i--) {
      const d = this.debrisParticles[i];
      d.life -= dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += dt * 50;  // Gravity (if in atmosphere)
      d.rotation += d.rotationSpeed * dt;
      d.alpha = Math.max(0, d.life / d.maxLife);

      if (d.life <= 0) {
        this.debrisParticles.splice(i, 1);
      }
    }

    // Update weapon effects
    for (let i = this.weaponEffects.length - 1; i >= 0; i--) {
      const w = this.weaponEffects[i];
      w.life -= dt;
      w.x += w.vx * dt;
      w.y += w.vy * dt;

      if (w.life <= 0) {
        this.weaponEffects.splice(i, 1);
      }
    }
  }

  /**
   * Create realistic engine thrust effect
   */
  createEngineThrustEffect(x, y, angle, power = 1.0, color = '#4488ff') {
    if (this.particles.length >= this.maxParticles) return;

    const particleCount = Math.floor(5 * power);

    for (let i = 0; i < particleCount; i++) {
      const spread = 0.3;  // Cone spread
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      const speed = 150 + Math.random() * 100;

      this.particles.push({
        x,
        y,
        vx: -Math.cos(particleAngle) * speed * power,
        vy: -Math.sin(particleAngle) * speed * power,
        size: 1 + Math.random() * 2,  // Pixelated particles
        color,
        alpha: 1.0,
        life: 0.3 + Math.random() * 0.2,
        maxLife: 0.5,
        type: 'engine'
      });
    }
  }

  /**
   * Create side thruster effect for maneuvering
   */
  createSideThrusterEffect(x, y, angle, direction, power = 1.0) {
    if (this.particles.length >= this.maxParticles) return;

    const thrusterAngle = angle + direction;  // +/- 90 degrees for side thrusters
    const particleCount = Math.floor(3 * power);

    for (let i = 0; i < particleCount; i++) {
      const spread = 0.4;
      const particleAngle = thrusterAngle + (Math.random() - 0.5) * spread;
      const speed = 100 + Math.random() * 50;

      this.particles.push({
        x,
        y,
        vx: Math.cos(particleAngle) * speed * power,
        vy: Math.sin(particleAngle) * speed * power,
        size: 0.5 + Math.random(),
        color: '#88ccff',
        alpha: 0.8,
        life: 0.2 + Math.random() * 0.15,
        maxLife: 0.35,
        type: 'thruster'
      });
    }
  }

  /**
   * Create fluid, energetic shield effect
   */
  createShieldEffect(x, y, radius, type = 'active') {
    if (this.shieldEffects.length >= this.maxShieldEffects) return;

    const effect = {
      x,
      y,
      radius,
      type,  // 'active', 'hit', 'charging'
      phase: 0,
      alpha: 0.6,
      life: type === 'hit' ? 0.5 : 2.0,
      maxLife: type === 'hit' ? 0.5 : 2.0,
      color: type === 'hit' ? '#ff8844' : '#4488ff',
      ripples: type === 'hit' ? 3 : 0,
      flowSpeed: 2.0
    };

    this.shieldEffects.push(effect);
  }

  /**
   * Create shield hit ripple effect
   */
  createShieldHitEffect(x, y, impactX, impactY, radius) {
    // Main hit point
    this.createShieldEffect(impactX, impactY, radius * 0.3, 'hit');

    // Energy ripples spreading from hit
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const rippleRadius = radius * (0.5 + i * 0.2);
        this.shieldEffects.push({
          x,
          y,
          radius: rippleRadius,
          type: 'ripple',
          phase: 0,
          alpha: 0.4,
          life: 0.3,
          maxLife: 0.3,
          color: '#ff8844',
          impactX,
          impactY
        });
      }, i * 50);
    }
  }

  /**
   * Create massive explosion with multiple stages
   */
  createExplosion(x, y, size = 1.0, type = 'normal') {
    if (this.explosions.length >= this.maxExplosions) return;

    // Main explosion flash
    this.explosions.push({
      x,
      y,
      radius: 20 * size,
      expansion: 150 * size,
      alpha: 1.0,
      life: 0.5,
      maxLife: 0.5,
      color: '#ffff88',
      type: 'flash'
    });

    // Secondary explosion wave
    setTimeout(() => {
      this.explosions.push({
        x,
        y,
        radius: 30 * size,
        expansion: 100 * size,
        alpha: 0.8,
        life: 0.8,
        maxLife: 0.8,
        color: '#ff6600',
        type: 'wave'
      });
    }, 100);

    // Fireball
    setTimeout(() => {
      this.explosions.push({
        x,
        y,
        radius: 40 * size,
        expansion: 50 * size,
        alpha: 0.6,
        life: 1.2,
        maxLife: 1.2,
        color: '#aa2200',
        type: 'fireball'
      });
    }, 200);

    // Particle burst
    const particleCount = Math.floor(50 * size);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: i % 3 === 0 ? '#ffff00' : (i % 3 === 1 ? '#ff8800' : '#ff4400'),
        alpha: 1.0,
        life: 0.5 + Math.random() * 0.8,
        maxLife: 1.3,
        type: 'explosion'
      });
    }
  }

  /**
   * Create debris from destroyed object
   */
  createDebris(x, y, objectType = 'ship', size = 1.0) {
    const debrisCount = Math.floor(20 * size);

    for (let i = 0; i < debrisCount; i++) {
      if (this.debrisParticles.length >= this.maxDebris) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      const debrisSize = 3 + Math.random() * 8;

      this.debrisParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: debrisSize,
        height: debrisSize * (0.5 + Math.random() * 0.5),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 5,
        color: objectType === 'ship' ? '#555555' : '#666666',
        alpha: 1.0,
        life: 3 + Math.random() * 2,
        maxLife: 5,
        type: objectType,
        burning: Math.random() > 0.7  // Some pieces are on fire
      });
    }
  }

  /**
   * Create hull damage sparks
   */
  createHullDamageSparks(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 120;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random(),
        color: Math.random() > 0.5 ? '#ffaa00' : '#ff6600',
        alpha: 1.0,
        life: 0.3 + Math.random() * 0.3,
        maxLife: 0.6,
        type: 'spark'
      });
    }
  }

  /**
   * Create laser weapon effect
   */
  createLaserEffect(x1, y1, x2, y2, color = '#ff0000') {
    this.weaponEffects.push({
      x1,
      y1,
      x2,
      y2,
      color,
      alpha: 1.0,
      life: 0.1,
      maxLife: 0.1,
      type: 'laser',
      thickness: 2
    });

    // Laser glow
    this.particles.push({
      x: x2,
      y: y2,
      vx: 0,
      vy: 0,
      size: 5,
      color,
      alpha: 0.8,
      life: 0.2,
      maxLife: 0.2,
      type: 'glow'
    });
  }

  /**
   * Create projectile weapon effect
   */
  createProjectileEffect(x, y, angle, speed, color = '#ffaa00') {
    this.weaponEffects.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3,
      color,
      alpha: 1.0,
      life: 3.0,
      maxLife: 3.0,
      type: 'projectile',
      trail: true
    });
  }

  /**
   * Render all effects
   */
  render(ctx, camX, camY) {
    // Render engine/thruster particles
    this.particles.forEach(p => {
      const screenX = p.x - camX;
      const screenY = p.y - camY;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(screenX - p.size / 2, screenY - p.size / 2, p.size, p.size);
    });

    // Render shield effects
    this.shieldEffects.forEach(s => {
      const screenX = s.x - camX;
      const screenY = s.y - camY;

      ctx.save();
      ctx.globalAlpha = s.alpha;

      if (s.type === 'active' || s.type === 'charging') {
        // Flowing hexagonal energy shield
        this.renderFluidShield(ctx, screenX, screenY, s.radius, s.phase, s.color);
      } else if (s.type === 'hit') {
        // Impact ripple
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenX, screenY, s.radius + Math.sin(s.phase) * 5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (s.type === 'ripple') {
        // Expanding ripple from impact
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.impactX - camX, s.impactY - camY, s.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Render explosions
    this.explosions.forEach(e => {
      const screenX = e.x - camX;
      const screenY = e.y - camY;

      ctx.save();
      ctx.globalAlpha = e.alpha;

      if (e.type === 'flash') {
        // Bright flash
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, e.radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, e.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, e.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Regular explosion wave
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, e.radius);
        gradient.addColorStop(0, e.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, e.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Render debris
    this.debrisParticles.forEach(d => {
      const screenX = d.x - camX;
      const screenY = d.y - camY;

      ctx.save();
      ctx.globalAlpha = d.alpha;
      ctx.translate(screenX, screenY);
      ctx.rotate(d.rotation);

      // Debris piece
      ctx.fillStyle = d.color;
      ctx.fillRect(-d.width / 2, -d.height / 2, d.width, d.height);

      // Fire if burning
      if (d.burning) {
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(-d.width / 3, -d.height / 3, d.width * 0.6, d.height * 0.6);
      }

      ctx.restore();
    });

    // Render weapon effects
    this.weaponEffects.forEach(w => {
      ctx.globalAlpha = w.alpha;

      if (w.type === 'laser') {
        // Laser beam
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.thickness;
        ctx.beginPath();
        ctx.moveTo(w.x1 - camX, w.y1 - camY);
        ctx.lineTo(w.x2 - camX, w.y2 - camY);
        ctx.stroke();

        // Laser glow
        ctx.shadowColor = w.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (w.type === 'projectile') {
        const screenX = w.x - camX;
        const screenY = w.y - camY;

        // Projectile
        ctx.fillStyle = w.color;
        ctx.fillRect(screenX - w.size / 2, screenY - w.size / 2, w.size, w.size);

        // Trail
        if (w.trail) {
          ctx.fillStyle = w.color + '66';
          ctx.fillRect(screenX - w.size, screenY - w.size / 2, w.size, w.size);
        }
      }
    });

    ctx.globalAlpha = 1.0;
  }

  /**
   * Render flowing, energetic shield
   */
  renderFluidShield(ctx, x, y, radius, phase, color) {
    const segments = 32;
    const flowSpeed = 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Flowing energy pattern
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const flow = Math.sin(angle * 3 + phase * flowSpeed) * 3;
      const r = radius + flow;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Inner energy layer
    ctx.strokeStyle = color + '66';
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const flow = Math.sin(angle * 5 - phase * flowSpeed * 1.5) * 5;
      const r = radius * 0.9 + flow;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
}
