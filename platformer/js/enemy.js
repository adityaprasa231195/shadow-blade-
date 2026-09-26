class Particle {
  constructor(x, y, vx, vy, color, size, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    return this.life > 0;
  }

  draw(ctx, camX, camY) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.round(this.x - camX), Math.round(this.y - camY), this.size, this.size);
    ctx.restore();
  }
}

class Projectile {
  constructor(x, y, vx, vy, radius, color, isBoss) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius || 6;
    this.color = color || "#ff6622";
    this.isBoss = !!isBoss;
    this.active = true;
    this.life = 6;
    this.animTimer = 0;
  }

  update(dt, tiles, tileSize) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.animTimer += dt * 10;
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return;
    }

    const tx = Math.floor(this.x / tileSize);
    const ty = Math.floor(this.y / tileSize);
    if (tiles[ty] && tiles[ty][tx] && tiles[ty][tx].solid) {
      this.active = false;
    }
  }

  draw(ctx, camX, camY) {
    const rx = Math.round(this.x - camX);
    const ry = Math.round(this.y - camY);
    ctx.save();
    
    ctx.fillStyle = "rgba(255, 107, 129, 0.3)";
    ctx.beginPath();
    ctx.arc(rx, ry, this.radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(rx, ry, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(rx - 1, ry - 1, this.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Enemy {
  constructor(x, y, w, h, hp, type) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.hp = hp;
    this.maxHp = hp;
    this.type = type;
    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.isGrounded = false;
    this.active = true;
    this.flashTimer = 0;
    this.invulTimer = 0;
    this.animTimer = 0;
    this.state = "patrol";
    this.stateTimer = 0;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  takeDamage(amount, knockDir) {
    if (this.invulTimer > 0) return false;
    this.hp -= amount;
    this.flashTimer = 0.22;
    this.invulTimer = 0.22;
    this.vx = (knockDir || -this.facing) * 170;
    this.vy = -190;
    this.scaleX = 1.3;
    this.scaleY = 0.7;
    if (window.AudioManager) {
      window.AudioManager.playEnemyHit();
    }
    if (this.hp <= 0) {
      this.die();
    }
    return true;
  }

  die() {
    this.active = false;
    if (window.AudioManager) {
      window.AudioManager.playEnemyDefeat();
    }
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.invulTimer > 0) this.invulTimer -= dt;
    this.animTimer += dt;
    this.scaleX += (1 - this.scaleX) * (1 - Math.pow(0.001, dt));
    this.scaleY += (1 - this.scaleY) * (1 - Math.pow(0.001, dt));
  }

  draw(ctx, camX, camY) {
    const rx = Math.round(this.x - camX);
    const ry = Math.round(this.y - camY);

    if (this.flashTimer > 0 && Math.floor(this.flashTimer * 30) % 2 === 0) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(rx, ry, this.w, this.h);
      return;
    }

    ctx.save();
    ctx.translate(rx + this.w / 2, ry + this.h);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.translate(-this.w / 2, -this.h);
    this.renderCustom(ctx, 0, 0);
    ctx.restore();
  }

  renderCustom(ctx, rx, ry) {
    ctx.fillStyle = "#ff5555";
    ctx.fillRect(rx, ry, this.w, this.h);
  }
}

class SlimeEnemy extends Enemy {
  constructor(x, y, isIce) {
    super(x, y, 26, 22, 1, isIce ? "frost_slime" : "slime");
    this.isIce = isIce;
    this.hopCooldown = 1.0 + Math.random() * 0.6;
    this.patrolRange = 120;
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    this.vy += 950 * dt;
    if (this.vy > 520) this.vy = 520;

    const prevY = this.y;
    this.x += this.vx * dt;
    window.Collision.resolveTileX(this, tiles, tileSize);
    this.y += this.vy * dt;
    window.Collision.resolveTileY(this, tiles, tileSize);

    if (this.isGrounded) {
      this.vx *= Math.pow(0.001, dt);
      this.hopCooldown -= dt;

      const dist = Math.abs((player.x + player.w / 2) - (this.x + this.w / 2));
      const inRange = dist < 260 && Math.abs(player.y - this.y) < 140;

      if (this.hopCooldown <= 0) {
        if (inRange) {
          this.facing = player.x < this.x ? -1 : 1;
          this.vx = this.facing * (this.isIce ? 170 : 145);
          this.vy = -300;
        } else {
          if (Math.abs(this.x - this.startX) > this.patrolRange) {
            this.facing = this.x > this.startX ? -1 : 1;
          }
          this.vx = this.facing * 90;
          this.vy = -220;
        }
        this.scaleX = 0.75;
        this.scaleY = 1.35;
        this.hopCooldown = 0.9 + Math.random() * 0.5;
      }
    }
  }

  renderCustom(ctx, rx, ry) {
    const isHop = !this.isGrounded;
    const bodyColor = this.isIce ? "#48dbfb" : "#2ecc71";
    const darkColor = this.isIce ? "#0abde3" : "#27ae60";
    const highlight = this.isIce ? "#c7ecee" : "#a8e6cf";

    ctx.save();
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.ellipse(rx + 13, ry + 14, 13, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(rx + 13, ry + 12, 12, isHop ? 11 : 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.ellipse(rx + 9, ry + 8, 4, 2.5, -0.4, 0, Math.PI * 2);
    ctx.fill();

    const eyeOffset = this.facing === 1 ? 5 : 1;
    ctx.fillStyle = "#1e272e";
    ctx.fillRect(rx + eyeOffset + 4, ry + 7, 3, 5);
    ctx.fillRect(rx + eyeOffset + 11, ry + 7, 3, 5);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(rx + eyeOffset + (this.facing === 1 ? 6 : 4), ry + 7, 1.5, 2);
    ctx.fillRect(rx + eyeOffset + (this.facing === 1 ? 13 : 11), ry + 7, 1.5, 2);

    ctx.restore();
  }
}

class MushroomEnemy extends Enemy {
  constructor(x, y) {
    super(x, y, 26, 28, 2, "mushroom");
    this.speed = 75;
    this.facing = -1;
    this.chargeSpeed = 165;
    this.isEnraged = false;
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    this.vy += 980 * dt;
    if (this.vy > 550) this.vy = 550;

    const dist = Math.abs((player.x + player.w / 2) - (this.x + this.w / 2));
    const sameLevel = Math.abs(player.y - this.y) < 70;
    const playerInFront = (player.x < this.x && this.facing === -1) || (player.x > this.x && this.facing === 1);

    if (dist < 240 && sameLevel && playerInFront) {
      this.isEnraged = true;
      this.vx = this.facing * this.chargeSpeed;
      if (particles && Math.random() < 0.25) {
        particles.push(new window.Enemies.Particle(this.x + this.w / 2, this.y + this.h - 2, -this.facing * 30, -10, "#e74c3c", 2, 0.3));
      }
    } else {
      this.isEnraged = false;
      this.vx = this.facing * this.speed;
    }

    const prevX = this.x;
    this.x += this.vx * dt;
    window.Collision.resolveTileX(this, tiles, tileSize);
    if (Math.abs(this.x - prevX) < 0.2) {
      this.facing *= -1;
    }

    this.y += this.vy * dt;
    window.Collision.resolveTileY(this, tiles, tileSize);

    if (this.isGrounded && !this.isEnraged) {
      const probeX = this.facing === 1 ? this.x + this.w + 6 : this.x - 6;
      const probeY = this.y + this.h + 8;
      const tx = Math.floor(probeX / tileSize);
      const ty = Math.floor(probeY / tileSize);
      if (!tiles[ty] || !tiles[ty][tx] || !tiles[ty][tx].solid) {
        this.facing *= -1;
      }
    }
  }

  renderCustom(ctx, rx, ry) {
    ctx.save();
    const bob = Math.sin(this.animTimer * 12) * 1.5;

    ctx.fillStyle = "#f5cd79";
    ctx.fillRect(rx + 6, ry + 14, 14, 14);
    ctx.fillStyle = "#ea8685";
    ctx.fillRect(rx + 4, ry + 25, 6, 3);
    ctx.fillRect(rx + 16, ry + 25, 6, 3);

    ctx.fillStyle = this.isEnraged ? "#c0392b" : "#e74c3c";
    ctx.beginPath();
    ctx.arc(rx + 13, ry + 12 + bob, 13, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(rx + 9, ry + 6 + bob, 3, 0, Math.PI * 2);
    ctx.arc(rx + 17, ry + 6 + bob, 3, 0, Math.PI * 2);
    ctx.arc(rx + 13, ry + 3 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    const eyeColor = this.isEnraged ? "#ffffff" : "#2d3436";
    const pupilColor = this.isEnraged ? "#e74c3c" : "#ffffff";
    const eyeX = this.facing === 1 ? rx + 14 : rx + 7;

    ctx.fillStyle = eyeColor;
    ctx.fillRect(eyeX, ry + 16, 5, 6);
    ctx.fillStyle = pupilColor;
    ctx.fillRect(eyeX + (this.facing === 1 ? 3 : 0), ry + 17, 2, 4);

    if (this.isEnraged) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(eyeX - 1, ry + 15);
      ctx.lineTo(eyeX + 6, ry + 17);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }
}

class BatEnemy extends Enemy {
  constructor(x, y) {
    super(x, y, 26, 22, 1, "bat");
    this.anchorX = x;
    this.anchorY = y;
    this.swoopProgress = 0;
    this.isSwooping = false;
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    const dist = Math.hypot((player.x + player.w / 2) - (this.anchorX + 13), (player.y + player.h / 2) - this.anchorY);

    if (!this.isSwooping && dist < 240) {
      this.isSwooping = true;
      this.swoopProgress = 0;
      this.targetX = player.x;
      this.targetY = player.y;
    }

    if (this.isSwooping) {
      this.swoopProgress += dt * 1.4;
      const t = this.swoopProgress;
      this.x = (1 - t) * (1 - t) * this.anchorX + 2 * (1 - t) * t * this.targetX + t * t * this.anchorX;
      this.y = (1 - t) * (1 - t) * this.anchorY + 2 * (1 - t) * t * (this.targetY + 20) + t * t * this.anchorY;

      if (this.swoopProgress >= 1) {
        this.isSwooping = false;
        this.x = this.anchorX;
        this.y = this.anchorY;
      }
    } else {
      this.y = this.anchorY + Math.sin(this.animTimer * 4.5) * 8;
      this.x = this.anchorX + Math.cos(this.animTimer * 2.5) * 10;
    }

    this.facing = player.x < this.x ? -1 : 1;
  }

  renderCustom(ctx, rx, ry) {
    ctx.save();
    const flap = Math.sin(this.animTimer * 18);

    ctx.fillStyle = "#341f97";
    ctx.beginPath();
    ctx.arc(rx + 13, ry + 11, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5f27cd";
    ctx.beginPath();
    ctx.moveTo(rx + 13, ry + 11);
    ctx.lineTo(rx + (this.facing === 1 ? -12 : -16), ry + 6 + flap * 9);
    ctx.lineTo(rx + 8, ry + 15);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rx + 13, ry + 11);
    ctx.lineTo(rx + (this.facing === 1 ? 38 : 34), ry + 6 + flap * 9);
    ctx.lineTo(rx + 18, ry + 15);
    ctx.fill();

    ctx.fillStyle = "#ff3838";
    ctx.fillRect(rx + (this.facing === 1 ? 14 : 9), ry + 9, 3, 3);
    ctx.fillRect(rx + (this.facing === 1 ? 19 : 14), ry + 9, 3, 3);

    ctx.restore();
  }
}

class KnightEnemy extends Enemy {
  constructor(x, y) {
    super(x, y, 28, 36, 3, "knight");
    this.speed = 55;
    this.attackCooldown = 0;
    this.isAttacking = false;
  }

  takeDamage(amount, knockDir) {
    if (knockDir === this.facing) {
      if (window.AudioManager) window.AudioManager.playLand();
      this.vx = knockDir * 60;
      return false;
    }
    return super.takeDamage(amount, knockDir);
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    this.vy += 980 * dt;
    if (this.vy > 550) this.vy = 550;

    const dist = Math.abs((player.x + player.w / 2) - (this.x + this.w / 2));
    this.facing = player.x < this.x ? -1 : 1;

    if (dist < 55 && this.attackCooldown <= 0) {
      this.isAttacking = true;
      this.attackCooldown = 1.3;
      this.vx = 0;
    } else {
      if (this.attackCooldown > 0) this.attackCooldown -= dt;
      if (this.attackCooldown < 0.9) this.isAttacking = false;
      this.vx = this.isAttacking ? 0 : this.facing * this.speed;
    }

    this.x += this.vx * dt;
    window.Collision.resolveTileX(this, tiles, tileSize);
    this.y += this.vy * dt;
    window.Collision.resolveTileY(this, tiles, tileSize);
  }

  renderCustom(ctx, rx, ry) {
    ctx.save();
    ctx.fillStyle = "#576574";
    ctx.fillRect(rx + 6, ry + 12, 16, 20);

    ctx.fillStyle = "#222f3e";
    ctx.fillRect(rx + 7, ry + 4, 14, 10);
    ctx.fillStyle = "#00d2d3";
    ctx.fillRect(rx + (this.facing === 1 ? 14 : 9), ry + 7, 6, 2);

    ctx.fillStyle = "#8395a7";
    ctx.fillRect(rx + 4, ry + 28, 7, 8);
    ctx.fillRect(rx + 15, ry + 28, 7, 8);

    const shieldX = this.facing === 1 ? rx + 18 : rx + 2;
    ctx.fillStyle = "#10ac84";
    ctx.fillRect(shieldX, ry + 12, 8, 16);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(shieldX, ry + 12, 8, 16);

    if (this.isAttacking) {
      ctx.fillStyle = "#f5f6fa";
      const swordX = this.facing === 1 ? rx + 24 : rx - 16;
      ctx.fillRect(swordX, ry + 16, 20, 5);
      ctx.fillStyle = "#ff6b81";
      ctx.fillRect(swordX + (this.facing === 1 ? 16 : 0), ry + 15, 4, 7);
    } else {
      ctx.fillStyle = "#dcdde1";
      const swordX = this.facing === 1 ? rx + 20 : rx + 4;
      ctx.fillRect(swordX, ry + 10, 4, 18);
    }
    ctx.restore();
  }
}

class CultistEnemy extends Enemy {
  constructor(x, y) {
    super(x, y, 24, 32, 2, "cultist");
    this.shootTimer = 2.0;
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    this.vy += 950 * dt;
    this.y += this.vy * dt;
    window.Collision.resolveTileY(this, tiles, tileSize);

    this.facing = player.x < this.x ? -1 : 1;
    this.shootTimer -= dt;

    if (this.shootTimer <= 0) {
      this.shootTimer = 2.2;
      const px = this.facing === 1 ? this.x + this.w + 6 : this.x - 6;
      const py = this.y + 12;
      const pvx = this.facing * 190;
      projectiles.push(new Projectile(px, py, pvx, 0, 6, "#ff4757", false));
      if (window.AudioManager) {
        window.AudioManager.playBossShoot();
      }
    }
  }

  renderCustom(ctx, rx, ry) {
    ctx.save();
    ctx.fillStyle = "#8854d0";
    ctx.fillRect(rx + 4, ry + 10, 16, 22);

    ctx.fillStyle = "#575fcf";
    ctx.beginPath();
    ctx.moveTo(rx + 4, ry + 10);
    ctx.lineTo(rx + 12, ry + 2);
    ctx.lineTo(rx + 20, ry + 10);
    ctx.fill();

    ctx.fillStyle = "#ffa801";
    ctx.fillRect(rx + (this.facing === 1 ? 13 : 7), ry + 10, 4, 3);

    if (this.shootTimer < 0.6) {
      ctx.fillStyle = "#ff3838";
      ctx.beginPath();
      ctx.arc(rx + (this.facing === 1 ? 24 : 0), ry + 12, 5 + Math.sin(this.animTimer * 20) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class MidBossGolem extends Enemy {
  constructor(x, y) {
    super(x, y, 64, 70, 9, "golem_boss");
    this.phase = 1;
    this.attackCycle = 0;
    this.cooldown = 2.0;
    this.isDizzy = false;
    this.dizzyTimer = 0;
    this.smashTelegraph = 0;
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    this.vy += 950 * dt;
    if (this.vy > 600) this.vy = 600;

    this.x += this.vx * dt;
    window.Collision.resolveTileX(this, tiles, tileSize);
    this.y += this.vy * dt;
    window.Collision.resolveTileY(this, tiles, tileSize);

    if (this.isDizzy) {
      this.dizzyTimer -= dt;
      this.vx = 0;
      if (this.dizzyTimer <= 0) {
        this.isDizzy = false;
        this.cooldown = 1.4;
      }
      return;
    }

    this.cooldown -= dt;
    this.facing = player.x < this.x ? -1 : 1;

    if (this.cooldown <= 0) {
      this.attackCycle = (this.attackCycle + 1) % 4;

      if (this.attackCycle === 1) {
        this.smashTelegraph = 0.6;
        this.vx = 0;
        this.cooldown = 2.2;
      } else if (this.attackCycle === 2) {
        this.vx = this.facing * 190;
        this.cooldown = 2.0;
      } else if (this.attackCycle === 3) {
        const bx = this.x + 32;
        const by = this.y + 10;
        const dir = this.facing;
        projectiles.push(new Projectile(bx, by, dir * 230, -190, 10, "#a55eea", true));
        this.cooldown = 2.2;
      } else {
        this.isDizzy = true;
        this.dizzyTimer = 3.5;
        this.vx = 0;
      }
    }

    if (this.smashTelegraph > 0) {
      this.smashTelegraph -= dt;
      if (this.smashTelegraph <= 0) {
        if (window.AudioManager) window.AudioManager.playBossRoar();
        if (window.GameCamera) window.GameCamera.shake(0.4, 8);
        projectiles.push(new Projectile(this.x + 32, this.y + 60, -230, 0, 8, "#d1d8e0", true));
        projectiles.push(new Projectile(this.x + 32, this.y + 60, 230, 0, 8, "#d1d8e0", true));
      }
    }
  }

  takeDamage(amount, knockDir) {
    if (!this.isDizzy && this.hp > 1) {
      return false;
    }
    const res = super.takeDamage(amount, knockDir);
    if (res) {
      this.isDizzy = false;
      this.cooldown = 1.0;
    }
    return res;
  }

  renderCustom(ctx, rx, ry) {
    ctx.save();
    ctx.fillStyle = this.isDizzy ? "#778ca3" : "#4b6584";
    ctx.fillRect(rx + 8, ry + 16, 48, 48);

    ctx.fillStyle = "#2d3436";
    ctx.fillRect(rx + 16, ry + 4, 32, 20);

    const eyeColor = this.isDizzy ? "#fed330" : "#ff3838";
    ctx.fillStyle = eyeColor;
    ctx.fillRect(rx + (this.facing === 1 ? 34 : 20), ry + 10, 8, 4);

    if (this.isDizzy) {
      ctx.fillStyle = "#00d2d3";
      ctx.beginPath();
      ctx.arc(rx + 32, ry + 36, 12 + Math.sin(this.animTimer * 12) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.smashTelegraph > 0) {
      ctx.fillStyle = "rgba(255, 56, 56, 0.4)";
      ctx.beginPath();
      ctx.arc(rx + 32, ry + 35, 45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class SawBladeHazard {
  constructor(x, y, radius, dist, speed, axis) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.radius = radius || 20;
    this.dist = dist || 120;
    this.speed = speed || 80;
    this.axis = axis || "h";
    this.angle = 0;
    this.progress = 0;
  }

  update(dt) {
    this.angle += dt * 16;
    this.progress += (this.speed * dt) / this.dist;
    const factor = (Math.sin(this.progress) + 1) / 2;

    if (this.axis === "h") {
      this.x = this.startX + factor * this.dist;
      this.y = this.startY;
    } else {
      this.x = this.startX;
      this.y = this.startY + factor * this.dist;
    }
  }

  draw(ctx, camX, camY) {
    const rx = Math.round(this.x - camX);
    const ry = Math.round(this.y - camY);

    ctx.save();
    ctx.strokeStyle = "#4b6584";
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (this.axis === "h") {
      ctx.moveTo(this.startX - camX, this.startY - camY);
      ctx.lineTo(this.startX + this.dist - camX, this.startY - camY);
    } else {
      ctx.moveTo(this.startX - camX, this.startY - camY);
      ctx.lineTo(this.startX - camX, this.startY + this.dist - camY);
    }
    ctx.stroke();

    ctx.translate(rx, ry);
    ctx.rotate(this.angle);

    ctx.fillStyle = "#d1d8e0";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#778ca3";
    for (let i = 0; i < 8; i++) {
      ctx.rotate((Math.PI * 2) / 8);
      ctx.beginPath();
      ctx.moveTo(this.radius - 2, -4);
      ctx.lineTo(this.radius + 6, 0);
      ctx.lineTo(this.radius - 2, 4);
      ctx.fill();
    }

    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class FallingThwomp {
  constructor(x, y, w, h) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.w = w || 40;
    this.h = h || 40;
    this.state = "idle";
    this.timer = 0;
    this.vy = 0;
  }

  update(dt, player, tiles, tileSize) {
    if (this.state === "idle") {
      const pCenterX = player.x + player.w / 2;
      if (pCenterX > this.x - 10 && pCenterX < this.x + this.w + 10 && player.y > this.y && player.y < this.y + 260) {
        this.state = "shake";
        this.timer = 0.35;
      }
    } else if (this.state === "shake") {
      this.timer -= dt;
      this.x = this.startX + (Math.random() * 4 - 2);
      if (this.timer <= 0) {
        this.x = this.startX;
        this.state = "fall";
        this.vy = 0;
      }
    } else if (this.state === "fall") {
      this.vy += 1900 * dt;
      this.y += this.vy * dt;
      window.Collision.resolveTileY(this, tiles, tileSize);
      if (this.isGrounded || this.y > this.startY + 260) {
        this.state = "landed";
        this.timer = 0.9;
        if (window.GameCamera) window.GameCamera.shake(0.35, 7);
        if (window.AudioManager) window.AudioManager.playLand();
      }
    } else if (this.state === "landed") {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.state = "rise";
      }
    } else if (this.state === "rise") {
      this.y -= 75 * dt;
      if (this.y <= this.startY) {
        this.y = this.startY;
        this.state = "idle";
      }
    }
  }

  draw(ctx, camX, camY) {
    const rx = Math.round(this.x - camX);
    const ry = Math.round(this.y - camY);

    ctx.save();
    ctx.fillStyle = "#57606f";
    ctx.fillRect(rx, ry, this.w, this.h);

    ctx.strokeStyle = "#2f3542";
    ctx.lineWidth = 3;
    ctx.strokeRect(rx, ry, this.w, this.h);

    const eyeColor = this.state === "fall" ? "#ff4757" : "#ffa502";
    ctx.fillStyle = eyeColor;
    ctx.fillRect(rx + 8, ry + 12, 8, 8);
    ctx.fillRect(rx + this.w - 16, ry + 12, 8, 8);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(rx + 10, ry + 14, 3, 3);
    ctx.fillRect(rx + this.w - 14, ry + 14, 3, 3);

    ctx.restore();
  }
}

class FinalDragonBoss extends Enemy {
  constructor(x, y) {
    super(x, y, 170, 120, 20, "dragon_boss");
    this.phase = 1;
    this.stateTimer = 2.0;
    this.wingAngle = 0;
    this.breathBeamActive = false;
    this.beamTimer = 0;
  }

  update(dt, player, tiles, tileSize, particles, projectiles) {
    super.update(dt, player, tiles, tileSize, particles, projectiles);

    this.wingAngle += dt * 6.5;
    const hpRatio = this.hp / this.maxHp;

    if (hpRatio <= 0.25) this.phase = 4;
    else if (hpRatio <= 0.5) this.phase = 3;
    else if (hpRatio <= 0.75) this.phase = 2;
    else this.phase = 1;

    this.facing = player.x < this.x + 85 ? -1 : 1;
    this.stateTimer -= dt;

    if (this.stateTimer <= 0) {
      this.triggerNextAttack(player, projectiles, particles);
    }

    if (this.breathBeamActive) {
      this.beamTimer -= dt;
      if (this.beamTimer <= 0) {
        this.breathBeamActive = false;
      }
    }
  }

  triggerNextAttack(player, projectiles, particles) {
    const attacks = ["fireball", "claw_dash", "rain", "beam"];
    const choice = attacks[Math.floor(Math.random() * (this.phase + 1)) % attacks.length];

    if (choice === "fireball") {
      this.stateTimer = 2.4 - this.phase * 0.3;
      const count = this.phase >= 2 ? 3 : 1;
      const startAngle = this.facing === -1 ? Math.PI : 0;
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) * 0.25;
        const vx = Math.cos(startAngle + spread) * 270;
        const vy = Math.sin(startAngle + spread) * 170 + 35;
        projectiles.push(new Projectile(this.x + 85 + this.facing * 60, this.y + 40, vx, vy, 11, "#ff3838", true));
      }
      if (window.AudioManager) window.AudioManager.playBossShoot();
    } else if (choice === "claw_dash") {
      this.stateTimer = 2.7;
      this.vx = this.facing * (230 + this.phase * 40);
      setTimeout(() => { this.vx = 0; }, 750);
      if (window.GameCamera) window.GameCamera.shake(0.4, 7);
    } else if (choice === "rain") {
      this.stateTimer = 3.2;
      for (let i = 0; i < 5 + this.phase * 2; i++) {
        setTimeout(() => {
          projectiles.push(new Projectile(player.x + (Math.random() * 320 - 160), this.y - 190, 0, 250, 10, "#ff5252", true));
        }, i * 210);
      }
      if (window.AudioManager) window.AudioManager.playBossRoar();
    } else if (choice === "beam" && this.phase >= 3) {
      this.breathBeamActive = true;
      this.beamTimer = 1.5;
      this.stateTimer = 3.4;
      if (window.AudioManager) window.AudioManager.playLaser();
      if (window.GameCamera) window.GameCamera.shake(1.2, 10);
    } else {
      this.stateTimer = 1.8;
    }
  }

  renderCustom(ctx, rx, ry) {
    ctx.save();
    const wingFlap = Math.sin(this.wingAngle) * 22;

    const baseColor = this.phase === 4 ? "#3d1346" : "#b33927";
    const darkScale = this.phase === 4 ? "#240b2a" : "#7f1d1d";
    const eyeGlow = this.phase === 4 ? "#a55eea" : "#ffcc00";

    ctx.fillStyle = darkScale;
    ctx.beginPath();
    ctx.moveTo(rx + 60, ry + 40);
    ctx.lineTo(rx + (this.facing === 1 ? -45 : 210), ry - 35 + wingFlap);
    ctx.lineTo(rx + (this.facing === 1 ? 10 : 155), ry + 60);
    ctx.fill();

    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.ellipse(rx + 85, ry + 68, 48, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    const headX = this.facing === 1 ? rx + 138 : rx + 32;
    ctx.beginPath();
    ctx.ellipse(headX, ry + 42, 26, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(headX + (this.facing === 1 ? 11 : -11), ry + 38, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(headX + (this.facing === 1 ? 13 : -18), ry + 48, 7, 5);

    if (this.breathBeamActive) {
      ctx.fillStyle = this.phase === 4 ? "rgba(165, 94, 234, 0.75)" : "rgba(255, 71, 87, 0.75)";
      const beamStartX = headX + (this.facing === 1 ? 24 : -24);
      const beamEndX = this.facing === 1 ? beamStartX + 600 : beamStartX - 600;
      ctx.beginPath();
      ctx.moveTo(beamStartX, ry + 46);
      ctx.lineTo(beamEndX, ry + 46 - 32);
      ctx.lineTo(beamEndX, ry + 46 + 54);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

window.Enemies = {
  Particle,
  Projectile,
  SlimeEnemy,
  MushroomEnemy,
  BatEnemy,
  KnightEnemy,
  CultistEnemy,
  MidBossGolem,
  SawBladeHazard,
  FallingThwomp,
  FinalDragonBoss
};
