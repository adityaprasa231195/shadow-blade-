class PhysicsSystem {
  constructor() {
    this.gravity = 1100;
    this.fallGravity = 1750;
    this.lowJumpGravity = 2300;
    this.maxFallSpeed = 620;
    this.wallSlideSpeed = 120;
    
    this.groundAccel = 1700;
    this.groundFriction = 2100;
    this.maxSpeed = 240;

    this.airAccel = 1250;
    this.airFriction = 300;

    this.iceFriction = 160;
    this.iceAccel = 380;

    this.coyoteDuration = 0.12;
    this.jumpBufferDuration = 0.12;
  }

  applyHorizontal(entity, inputDir, dt, isIce) {
    const accel = isIce 
      ? this.iceAccel 
      : (entity.isGrounded ? this.groundAccel : this.airAccel);
    const friction = isIce 
      ? this.iceFriction 
      : (entity.isGrounded ? this.groundFriction : this.airFriction);

    if (inputDir !== 0) {
      if (Math.sign(entity.vx) !== 0 && Math.sign(entity.vx) !== inputDir) {
        entity.vx += inputDir * (accel + friction * 1.5) * dt;
      } else {
        entity.vx += inputDir * accel * dt;
      }
      if (Math.abs(entity.vx) > this.maxSpeed) {
        entity.vx = Math.sign(entity.vx) * this.maxSpeed;
      }
    } else {
      if (entity.vx > 0) {
        entity.vx = Math.max(0, entity.vx - friction * dt);
      } else if (entity.vx < 0) {
        entity.vx = Math.min(0, entity.vx + friction * dt);
      }
    }
  }

  applyVertical(entity, isHoldingJump, dt) {
    if (entity.isWallSliding && entity.vy > this.wallSlideSpeed) {
      entity.vy = this.wallSlideSpeed;
      return;
    }

    let currentGravity = this.gravity;

    if (Math.abs(entity.vy) < 40) {
      currentGravity = this.gravity * 0.65;
    } else if (entity.vy > 0) {
      currentGravity = this.fallGravity;
    } else if (entity.vy < 0 && !isHoldingJump) {
      currentGravity = this.lowJumpGravity;
    }

    entity.vy += currentGravity * dt;
    if (entity.vy > this.maxFallSpeed) {
      entity.vy = this.maxFallSpeed;
    }
  }
}

window.Physics = new PhysicsSystem();
