class Player {
  constructor(x, y) {
    this.x = x || 50;
    this.y = y || 100;
    this.w = 22;
    this.h = 32;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.isGrounded = false;
    this.wasGrounded = false;
    this.isWallSliding = false;
    this.wallDir = 0;
    this.standingOnPlatform = null;
    this.standingTileType = "normal";

    this.maxHp = 3;
    this.hp = 3;
    this.isDead = false;
    this.invulTimer = 0;
    this.flashTimer = 0;

    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;

    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackCooldown = 0;
    this.slashHitbox = { x: 0, y: 0, w: 32, h: 30 };

    this.animTimer = 0;
    this.runFrame = 0;
    this.capeWave = 0;
    this.scaleX = 1;
    this.scaleY = 1;

    this.checkpointX = this.x;
    this.checkpointY = this.y;
    this.coins = 0;
    this.damageTakenInLevel = 0;
  }

  reset(x, y) {
    this.x = x || 50;
    this.y = y || 100;
    this.vx = 0;
    this.vy = 0;
    this.hp = this.maxHp;
    this.isDead = false;
    this.invulTimer = 0;
    this.flashTimer = 0;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.isWallSliding = false;
    this.checkpointX = this.x;
    this.checkpointY = this.y;
    this.damageTakenInLevel = 0;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  respawnAtCheckpoint() {
    this.x = this.checkpointX;
    this.y = this.checkpointY;
    this.vx = 0;
    this.vy = 0;
    this.hp = this.maxHp;
    this.isDead = false;
    this.invulTimer = 1.5;
    this.flashTimer = 1.5;
    this.isAttacking = false;
    this.isWallSliding = false;
  }

  jump() {
    if (this.isWallSliding) {
      this.vy = -455;
      this.vx = -this.wallDir * 245;
      this.facing = -this.wallDir;
      this.isWallSliding = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.scaleX = 0.78;
      this.scaleY = 1.28;
      if (window.AudioManager) window.AudioManager.playJump();
      return;
    }

    this.vy = -495;
    this.isGrounded = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.scaleX = 0.78;
    this.scaleY = 1.28;
    if (window.AudioManager) {
      window.AudioManager.playJump();
    }
  }

  bounce() {
    this.vy = -465;
    this.isGrounded = false;
    this.coyoteTimer = 0.12;
    this.scaleX = 0.78;
    this.scaleY = 1.28;
    if (window.AudioManager) {
      window.AudioManager.playJump();
    }
  }

  attack() {
    if (this.attackCooldown <= 0 && !this.isDead) {
      this.isAttacking = true;
      this.attackTimer = 0.22;
      this.attackCooldown = 0.3;
      if (window.AudioManager) {
        window.AudioManager.playSword();
      }
    }
  }

  takeDamage(amount, sourceX) {
    if (this.invulTimer > 0 || this.isDead) return false;
    this.hp -= amount;
    this.damageTakenInLevel += amount;
    this.invulTimer = 1.5;
    this.flashTimer = 1.5;

    const knockDir = sourceX !== undefined ? (this.x < sourceX ? -1 : 1) : -this.facing;
    this.vx = knockDir * 230;
    this.vy = -280;
    this.scaleX = 1.25;
    this.scaleY = 0.8;

    if (window.GameCamera) {
      window.GameCamera.shake(0.35, 7);
    }
    if (window.AudioManager) {
      window.AudioManager.playHurt();
    }

    if (this.hp <= 0) {
      this.die();
    }
    return true;
  }

  die() {
    if (this.isDead) return;
    this.hp = 0;
    this.isDead = true;
    this.vy = -360;
    this.vx = 0;
    if (window.AudioManager) {
      window.AudioManager.playDeath();
    }
    if (window.GameCamera) {
      window.GameCamera.shake(0.6, 10);
    }
  }

  update(dt, input, tiles, tileSize, oneWayPlatforms, windX, levelWidth, levelHeight, particles) {
    if (this.isDead) {
      this.vy += 1300 * dt;
      this.y += this.vy * dt;
      return;
    }

    this.animTimer += dt;
    this.capeWave += dt * (Math.abs(this.vx) > 10 ? 18 : 7);

    this.scaleX += (1 - this.scaleX) * (1 - Math.pow(0.001, dt));
    this.scaleY += (1 - this.scaleY) * (1 - Math.pow(0.001, dt));

    if (this.invulTimer > 0) this.invulTimer -= dt;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    if (this.isAttacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    const slashOffsetX = this.facing === 1 ? this.w - 4 : -this.slashHitbox.w + 4;
    this.slashHitbox.x = this.x + slashOffsetX;
    this.slashHitbox.y = this.y + 2;

    let dir = 0;
    if (input.left) dir -= 1;
    if (input.right) dir += 1;

    if (dir !== 0) {
      if (this.isGrounded && Math.sign(this.vx) !== 0 && Math.sign(this.vx) !== dir && particles) {
        for (let i = 0; i < 2; i++) {
          particles.push(new window.Enemies.Particle(this.x + this.w / 2, this.y + this.h - 2, -dir * (Math.random() * 50 + 20), -Math.random() * 30, "#d2dae2", 2.5, 0.3));
        }
      }
      this.facing = dir;
      this.runFrame = (this.runFrame + dt * 14) % 4;
    } else {
      this.runFrame = 0;
    }

    const isIce = this.standingTileType === "ice";
    window.Physics.applyHorizontal(this, dir, dt, isIce);

    if (windX) {
      this.vx += windX * dt;
    }

    this.isWallSliding = false;
    this.wallDir = 0;
    if (!this.isGrounded && this.vy > 0 && dir !== 0) {
      const checkX = dir === 1 ? this.x + this.w + 2 : this.x - 2;
      const tx = Math.floor(checkX / tileSize);
      const ty1 = Math.floor((this.y + 4) / tileSize);
      const ty2 = Math.floor((this.y + this.h - 6) / tileSize);

      const hitWall1 = tiles[ty1] && tiles[ty1][tx] && tiles[ty1][tx].solid;
      const hitWall2 = tiles[ty2] && tiles[ty2][tx] && tiles[ty2][tx].solid;

      if (hitWall1 || hitWall2) {
        this.isWallSliding = true;
        this.wallDir = dir;
        this.coyoteTimer = window.Physics.coyoteDuration;
        if (particles && Math.random() < 0.3) {
          particles.push(new window.Enemies.Particle(checkX, this.y + this.h - 8, -dir * 20, -20, "#d2dae2", 2, 0.25));
        }
      }
    }

    if (this.isGrounded) {
      this.coyoteTimer = window.Physics.coyoteDuration;
    } else if (!this.isWallSliding) {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (input.jumpPressed) {
      this.jumpBufferTimer = window.Physics.jumpBufferDuration;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.jump();
    }

    window.Physics.applyVertical(this, input.jumpHeld, dt);

    if (this.standingOnPlatform && this.isGrounded) {
      this.x += (this.standingOnPlatform.vx || 0) * dt;
      this.y += (this.standingOnPlatform.vy || 0) * dt;
    }

    const prevY = this.y;
    this.wasGrounded = this.isGrounded;
    this.standingOnPlatform = null;

    this.x += this.vx * dt;
    window.Collision.resolveTileX(this, tiles, tileSize);

    const maxW = levelWidth || 1900;
    if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    } else if (this.x + this.w > maxW) {
      this.x = maxW - this.w;
      this.vx = 0;
    }

    this.y += this.vy * dt;
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }
    window.Collision.resolveTileY(this, tiles, tileSize);

    if (oneWayPlatforms && oneWayPlatforms.length > 0) {
      window.Collision.resolveOneWayPlatforms(this, oneWayPlatforms, prevY);
    }

    if (!this.wasGrounded && this.isGrounded) {
      this.scaleX = 1.3;
      this.scaleY = 0.75;
      if (window.AudioManager && this.vy >= 0) {
        window.AudioManager.playLand();
      }
      if (particles) {
        for (let i = 0; i < 4; i++) {
          particles.push(new window.Enemies.Particle(this.x + this.w / 2, this.y + this.h, (Math.random() - 0.5) * 60, -Math.random() * 20, "#d2dae2", 2.5, 0.25));
        }
      }
    }

    if (levelHeight && this.y > levelHeight + 30) {
      this.die();
    }
  }

  draw(ctx, camX, camY) {
    if (this.flashTimer > 0 && Math.floor(this.flashTimer * 24) % 2 === 0) {
      return;
    }

    const rx = Math.round(this.x - camX);
    const ry = Math.round(this.y - camY);

    if (this.isGrounded) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.beginPath();
      ctx.ellipse(rx + this.w / 2, ry + this.h - 1, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(rx + this.w / 2, ry + this.h);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.translate(-this.w / 2, -this.h);

    const capeRipple = Math.sin(this.capeWave) * 5;
    const capeBackX = this.facing === 1 ? 4 : this.w - 4;
    const capeTailX = this.facing === 1 ? -13 - Math.abs(this.vx) * 0.06 : this.w + 13 + Math.abs(this.vx) * 0.06;

    ctx.fillStyle = "#6d0d1a";
    ctx.beginPath();
    ctx.moveTo(capeBackX, 11);
    ctx.lineTo(capeTailX, 14 + capeRipple);
    ctx.lineTo(capeTailX + (this.facing === 1 ? 4 : -4), 29 + capeRipple);
    ctx.lineTo(capeBackX + (this.facing === 1 ? 7 : -7), 23);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#b71520";
    ctx.beginPath();
    ctx.moveTo(capeBackX, 11);
    ctx.lineTo(capeTailX + (this.facing === 1 ? 1 : -1), 15 + capeRipple);
    ctx.lineTo(capeTailX + (this.facing === 1 ? 3 : -3), 27 + capeRipple);
    ctx.lineTo(capeBackX + (this.facing === 1 ? 5 : -5), 22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(capeBackX, 12);
    ctx.lineTo(capeTailX + (this.facing === 1 ? -1 : 1), 16 + capeRipple);
    ctx.lineTo(capeTailX + (this.facing === 1 ? 1 : -1), 25 + capeRipple);
    ctx.lineTo(capeBackX + (this.facing === 1 ? 3 : -3), 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f39c12";
    ctx.fillRect(this.facing === 1 ? 3 : this.w - 6, 11, 4, 3);
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(this.facing === 1 ? 4 : this.w - 5, 12, 2, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.facing === 1 ? 4 : this.w - 5, 12, 1, 1);

    const legCycle = Math.sin(this.runFrame * Math.PI);
    const lOffset = (this.isGrounded && Math.abs(this.vx) > 10) ? legCycle * 4 : 0;

    ctx.fillStyle = "#16284e";
    ctx.fillRect(4, 21 + lOffset, 6, 8 - lOffset);
    ctx.fillRect(12, 21 - lOffset, 6, 8 + lOffset);
    ctx.fillStyle = "#223b75";
    ctx.fillRect(5, 21 + lOffset, 4, 7 - lOffset);
    ctx.fillRect(13, 21 - lOffset, 4, 7 + lOffset);

    ctx.fillStyle = "#53331b";
    ctx.fillRect(3, 28 + lOffset, 7, 4);
    ctx.fillRect(12, 28 - lOffset, 7, 4);
    ctx.fillStyle = "#794b29";
    ctx.fillRect(4, 28 + lOffset, 5, 1);
    ctx.fillRect(13, 28 - lOffset, 5, 1);

    ctx.fillStyle = "#1f140c";
    ctx.fillRect(2, 31, 8, 2);
    ctx.fillRect(12, 31, 8, 2);

    ctx.fillStyle = "#1b4f72";
    ctx.fillRect(4, 12, 14, 10);

    ctx.fillStyle = "#2980b9";
    ctx.fillRect(5, 12, 12, 9);
    ctx.fillStyle = "#3498db";
    ctx.fillRect(this.facing === 1 ? 8 : 5, 13, 7, 7);

    ctx.fillStyle = "#432815";
    if (this.facing === 1) {
      ctx.fillRect(5, 13, 3, 2);
      ctx.fillRect(7, 15, 3, 2);
      ctx.fillRect(9, 17, 3, 2);
    } else {
      ctx.fillRect(14, 13, 3, 2);
      ctx.fillRect(12, 15, 3, 2);
      ctx.fillRect(10, 17, 3, 2);
    }

    ctx.fillStyle = "#2c1a0e";
    ctx.fillRect(4, 19, 14, 3);

    const bckX = this.facing === 1 ? 10 : 7;
    ctx.fillStyle = "#d35400";
    ctx.fillRect(bckX - 1, 18, 6, 5);
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(bckX, 19, 4, 3);
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(bckX + 1, 20, 2, 1);

    const armOffset = (this.isGrounded && Math.abs(this.vx) > 10) ? -legCycle * 3 : 0;
    const armX = this.facing === 1 ? 13 : 3;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(armX, 16 + armOffset, 4, 3);
    ctx.fillStyle = "#bdc3c7";
    ctx.fillRect(armX, 18 + armOffset, 4, 1);

    ctx.fillStyle = "#fed39f";
    ctx.fillRect(armX, 19 + armOffset, 4, 3);

    ctx.fillStyle = "#f8c291";
    ctx.fillRect(8, 10, 6, 3);

    ctx.fillStyle = "#fed39f";
    ctx.fillRect(5, 4, 12, 8);
    ctx.fillStyle = "#f8c291";
    ctx.fillRect(5, 10, 12, 2);

    const blushX = this.facing === 1 ? 13 : 5;
    ctx.fillStyle = "rgba(235, 77, 75, 0.4)";
    ctx.fillRect(blushX, 9, 3, 1);

    const eyeX = this.facing === 1 ? 12 : 6;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(eyeX, 6, 4, 4);

    ctx.fillStyle = "#1e3799";
    ctx.fillRect(eyeX + (this.facing === 1 ? 1 : 0), 6, 3, 4);
    ctx.fillStyle = "#0c2461";
    ctx.fillRect(eyeX + (this.facing === 1 ? 1 : 0), 7, 2, 2);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(eyeX + (this.facing === 1 ? 2 : 1), 6, 1, 1);

    ctx.fillStyle = "#2c170a";
    ctx.fillRect(eyeX - (this.facing === 1 ? 1 : 0), 5, 5, 1);

    ctx.fillStyle = "#c0392b";
    ctx.fillRect(4, 3, 14, 3);
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(4, 4, 14, 1);

    const tailWave = Math.sin(this.capeWave * 1.3) * 3;
    const tailX = this.facing === 1 ? 0 : 18;
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(tailX + (this.facing === 1 ? -4 : 4), 3 + tailWave, 5, 2);
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(tailX + (this.facing === 1 ? -3 : 3), 4 + tailWave, 4, 1);

    ctx.fillStyle = "#2d160a";
    ctx.fillRect(3, 0, 16, 4);
    ctx.fillRect(this.facing === 1 ? 1 : 16, 1, 4, 5);

    ctx.fillStyle = "#4e2912";
    ctx.fillRect(4, 0, 14, 3);
    ctx.fillRect(this.facing === 1 ? 14 : 3, 2, 4, 3);
    ctx.fillRect(6, -2, 4, 3);
    ctx.fillRect(11, -2, 4, 3);
    ctx.fillRect(this.facing === 1 ? 16 : 1, -1, 3, 3);

    ctx.fillStyle = "#7a4623";
    ctx.fillRect(7, -2, 2, 1);
    ctx.fillRect(12, -2, 2, 1);
    ctx.fillRect(this.facing === 1 ? 17 : 2, -1, 2, 1);
    ctx.fillRect(this.facing === 1 ? 15 : 4, 1, 2, 1);

    ctx.fillStyle = "#4e2912";
    ctx.fillRect(this.facing === 1 ? 11 : 6, 4, 3, 2);
    ctx.fillRect(this.facing === 1 ? 8 : 10, 4, 2, 2);

    if (this.isAttacking) {
      const slashAngle = (0.22 - this.attackTimer) / 0.22;
      const swordStartX = this.facing === 1 ? 14 : 8;
      const swordEndX = this.facing === 1 ? 40 : -18;
      const swordTipY = 10 + slashAngle * 16;

      ctx.save();
      ctx.fillStyle = "#dfe4ea";
      ctx.fillRect(swordStartX + (this.facing === 1 ? 4 : -10), swordTipY - 1, 12, 3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(swordStartX + (this.facing === 1 ? 5 : -9), swordTipY - 1, 10, 1);
      ctx.fillStyle = "#f1c40f";
      ctx.fillRect(swordStartX + (this.facing === 1 ? 2 : -4), swordTipY - 2, 2, 5);
      ctx.fillStyle = "#3d2314";
      ctx.fillRect(swordStartX + (this.facing === 1 ? 0 : -2), swordTipY, 2, 2);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(0, 210, 211, 0.4)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(swordStartX, 15, 27, (this.facing === 1 ? -0.7 : Math.PI - 0.7) + slashAngle, (this.facing === 1 ? 0.9 : Math.PI + 0.9) + slashAngle);
      ctx.stroke();

      ctx.strokeStyle = "#7df9ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(swordStartX, 15, 27, (this.facing === 1 ? -0.5 : Math.PI - 0.5) + slashAngle, (this.facing === 1 ? 0.7 : Math.PI + 0.7) + slashAngle);
      ctx.stroke();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(swordStartX, 15, 27, (this.facing === 1 ? -0.3 : Math.PI - 0.3) + slashAngle, (this.facing === 1 ? 0.5 : Math.PI + 0.5) + slashAngle);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(swordEndX, swordTipY, 3, 3);
      ctx.fillStyle = "#7df9ff";
      ctx.fillRect(swordEndX - 1, swordTipY - 1, 5, 1);
      ctx.fillRect(swordEndX - 1, swordTipY + 3, 5, 1);
      ctx.restore();
    }

    ctx.restore();
  }
}

window.Player = Player;
