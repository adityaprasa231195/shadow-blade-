class AssetLoader {
  constructor() {
    this.images = {};
    this.loaded = {};
    const sources = {
      menu: "assets/bg_menu.jpg",
      world1: "assets/bg_world1.jpg",
      world2: "assets/bg_world2.jpg",
      world3: "assets/bg_world3.jpg",
      world4: "assets/bg_world4.jpg",
      world5: "assets/bg_world5.jpg"
    };
    for (const [key, src] of Object.entries(sources)) {
      const img = new Image();
      img.onload = () => { this.loaded[key] = true; };
      img.src = src;
      this.images[key] = img;
    }
  }

  getImage(key) {
    if (this.loaded[key] && this.images[key] && this.images[key].naturalWidth > 0) {
      return this.images[key];
    }
    return null;
  }
}

window.GameAssets = new AssetLoader();

class GameEngine {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.state = "MENU";
    this.currentLevelId = 1;
    this.level = null;
    this.player = null;
    this.score = 0;
    this.lastTime = 0;
    this.menuAnimTime = 0;

    this.input = {
      left: false,
      right: false,
      jumpPressed: false,
      jumpHeld: false,
      attackPressed: false
    };

    this.initCanvas();
    this.initPlayer();
    this.bindInputs();
  }

  initCanvas() {
    this.canvas.width = 960;
    this.canvas.height = 540;
    this.ctx.imageSmoothingEnabled = false;
  }

  initPlayer() {
    this.player = new window.Player(80, 380);
  }

  bindInputs() {
    window.addEventListener("keydown", (e) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === "Escape" || e.code === "KeyP") {
        this.togglePause();
        return;
      }

      if (e.code === "KeyF" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (window.UIManager) window.UIManager.toggleFullscreen();
        return;
      }

      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.input.left = true;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.input.right = true;
      }
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        if (!this.input.jumpHeld) {
          this.input.jumpPressed = true;
        }
        this.input.jumpHeld = true;
      }
      if (["KeyJ", "KeyZ", "KeyX", "KeyC"].includes(e.code)) {
        this.input.attackPressed = true;
        if (this.state === "PLAYING" && this.player) {
          this.player.attack();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.input.left = false;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.input.right = false;
      }
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        this.input.jumpHeld = false;
      }
    });

    const bindTouch = (id, onDown, onUp) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        onDown();
      }, { passive: false });
      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        onUp();
      }, { passive: false });
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        onDown();
      });
      btn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        onUp();
      });
    };

    bindTouch("touch-btn-left", () => { this.input.left = true; }, () => { this.input.left = false; });
    bindTouch("touch-btn-right", () => { this.input.right = true; }, () => { this.input.right = false; });
    bindTouch("touch-btn-jump", () => {
      this.input.jumpPressed = true;
      this.input.jumpHeld = true;
    }, () => {
      this.input.jumpHeld = false;
    });
    bindTouch("touch-btn-attack", () => {
      this.input.attackPressed = true;
      if (this.state === "PLAYING" && this.player) {
        this.player.attack();
      }
    }, () => {});
  }

  startLevel(lvlId) {
    this.currentLevelId = lvlId;
    const config = window.LevelsData.getLevel(lvlId);
    this.level = new window.LevelInstance(config);
    this.player.reset(config.playerStart.x, config.playerStart.y);
    window.GameCamera.reset(config.playerStart.x, config.playerStart.y, config.width, config.height);
    this.score = 0;
    this.state = "PLAYING";

    window.UIManager.showInGameHUD(config.id, config.name);
    window.AudioManager.playMusic(config.world);
  }

  restartLevel() {
    this.startLevel(this.currentLevelId);
  }

  togglePause() {
    if (this.state === "PLAYING") {
      this.state = "PAUSED";
      window.UIManager.showPauseModal();
    } else if (this.state === "PAUSED") {
      this.resumeGame();
    }
  }

  resumeGame() {
    if (this.state === "PAUSED") {
      this.state = "PLAYING";
      window.UIManager.hidePauseModal();
    }
  }

  update(dt) {
    if (this.state === "MENU" || this.state === "LEVEL_SELECT") {
      this.menuAnimTime += dt;
      return;
    }

    if (this.state !== "PLAYING") {
      return;
    }

    this.player.update(
      dt,
      this.input,
      this.level.tiles,
      this.level.tileSize,
      this.level.platforms,
      this.level.windX,
      this.level.width,
      this.level.height,
      this.level.particles
    );
    this.input.jumpPressed = false;
    this.input.attackPressed = false;

    this.level.update(dt, this.player);

    window.GameCamera.follow(this.player, this.level.width, this.level.height, dt);

    const activeCheckpointsCount = this.level.checkpoints.filter(cp => cp.active).length;
    this.score = (this.level.coinsCollected * 100) + (this.level.enemiesDefeated * 250) + (activeCheckpointsCount * 50);

    window.UIManager.updateHUD(this.player, this.level, this.score, this.level.levelTime);

    if (this.player.isDead && this.player.y > this.level.height + 60) {
      if (this.level.checkpoints.some(c => c.active)) {
        this.player.respawnAtCheckpoint();
      } else {
        this.state = "GAME_OVER";
        window.UIManager.showDeathModal();
      }
    }

    if (this.level.isCompleted) {
      this.state = "LEVEL_CLEAR";
      const star1 = true;
      const star2 = this.level.coinsCollected >= this.level.totalCoins;
      const star3 = this.player.damageTakenInLevel === 0;
      const finalScore = this.score + 1000;

      window.SaveManager.recordLevelComplete(this.currentLevelId, [star1, star2, star3], finalScore, Math.round(this.level.levelTime), this.level.coinsCollected);
      if (window.AudioManager) window.AudioManager.playLevelComplete();
      window.UIManager.showLevelClearModal(this.level, this.level.levelTime, finalScore, [star1, star2, star3]);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === "MENU" || this.state === "LEVEL_SELECT") {
      this.renderMenuBackground();
      return;
    }

    if (!this.level || !this.player) return;

    const camX = window.GameCamera.getRenderX();
    const camY = window.GameCamera.getRenderY();

    this.level.draw(this.ctx, camX, camY);
    this.player.draw(this.ctx, camX, camY);
  }

  renderMenuBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.menuAnimTime;

    const bgImg = window.GameAssets ? window.GameAssets.getImage("menu") : null;
    if (bgImg) {
      const zoom = 1.02 + Math.sin(t * 0.4) * 0.01;
      const offsetX = Math.sin(t * 0.25) * 8;
      const offsetY = Math.cos(t * 0.2) * 4;
      const dw = w * zoom;
      const dh = h * zoom;
      const dx = (w - dw) / 2 + offsetX;
      const dy = (h - dh) / 2 + offsetY;
      this.ctx.drawImage(bgImg, dx, dy, dw, dh);

      const vignette = this.ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.72);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(4, 7, 13, 0.45)");
      this.ctx.fillStyle = vignette;
      this.ctx.fillRect(0, 0, w, h);
    } else {
      const grad = this.ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#193559");
      grad.addColorStop(0.4, "#2980b9");
      grad.addColorStop(0.8, "#6dd5fa");
      grad.addColorStop(1, "#c7ecee");
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);
    }

    const heroX = 265;
    const heroY = h - 94;
    const fakePlayer = {
      x: heroX,
      y: heroY,
      w: 22,
      h: 32,
      vx: 0,
      facing: 1,
      isGrounded: true,
      capeWave: t * 8,
      runFrame: 0,
      flashTimer: 0,
      isAttacking: false,
      scaleX: 1,
      scaleY: 1
    };
    window.Player.prototype.draw.call(fakePlayer, this.ctx, 0, 0);
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((ts) => this.loop(ts));
  }

  start() {
    requestAnimationFrame((ts) => this.loop(ts));
  }
}

window.GameEngine = new GameEngine();
