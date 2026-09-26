class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth || 960;
    this.viewportHeight = viewportHeight || 540;
    this.targetX = 0;
    this.targetY = 0;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.shakeOffset = { x: 0, y: 0 };
    this.lookAheadDist = 60;
    this.smoothness = 0.08;
  }

  resize(w, h) {
    this.viewportWidth = w;
    this.viewportHeight = h;
  }

  follow(target, levelWidth, levelHeight, dt) {
    const lookOffset = target.facing * this.lookAheadDist;
    this.targetX = target.x + target.w / 2 + lookOffset - this.viewportWidth / 2;
    this.targetY = target.y + target.h / 2 - this.viewportHeight / 2 - 20;

    const maxX = Math.max(0, levelWidth - this.viewportWidth);
    const maxY = Math.max(0, levelHeight - this.viewportHeight);

    this.targetX = Math.max(0, Math.min(maxX, this.targetX));
    this.targetY = Math.max(0, Math.min(maxY, this.targetY));

    this.x += (this.targetX - this.x) * (1 - Math.pow(0.001, dt || 0.016));
    this.y += (this.targetY - this.y) * (1 - Math.pow(0.001, dt || 0.016));

    const minCamX = Math.max(0, target.x + target.w - this.viewportWidth + 30);
    const maxCamX = Math.min(maxX, target.x - 30);
    if (this.x > maxCamX) this.x = maxCamX;
    if (this.x < minCamX) this.x = minCamX;

    const minCamY = Math.max(0, target.y + target.h - this.viewportHeight + 30);
    const maxCamY = Math.min(maxY, target.y - 30);
    if (this.y > maxCamY) this.y = maxCamY;
    if (this.y < minCamY) this.y = minCamY;

    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      const factor = Math.max(0, this.shakeDuration);
      this.shakeOffset.x = (Math.random() * 2 - 1) * this.shakeIntensity * factor;
      this.shakeOffset.y = (Math.random() * 2 - 1) * this.shakeIntensity * factor;
    } else {
      this.shakeOffset.x = 0;
      this.shakeOffset.y = 0;
    }
  }

  shake(duration, intensity) {
    if (window.SaveManager && !window.SaveManager.data.settings.screenShake) {
      return;
    }
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
  }

  getRenderX() {
    return Math.round(this.x + this.shakeOffset.x);
  }

  getRenderY() {
    return Math.round(this.y + this.shakeOffset.y);
  }

  reset(x, y, levelWidth, levelHeight) {
    const maxX = Math.max(0, (levelWidth || 1900) - this.viewportWidth);
    const maxY = Math.max(0, (levelHeight || 540) - this.viewportHeight);
    this.targetX = Math.max(0, Math.min(maxX, (x || 0) - this.viewportWidth / 2));
    this.targetY = Math.max(0, Math.min(maxY, (y || 0) - this.viewportHeight / 2));
    this.x = this.targetX;
    this.y = this.targetY;
    this.shakeDuration = 0;
    this.shakeOffset.x = 0;
    this.shakeOffset.y = 0;
  }
}

window.GameCamera = new Camera(960, 540);
