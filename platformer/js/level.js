class Level {
  constructor(data) {
    this.data = data;
    this.id = data.id;
    this.name = data.name;
    this.world = data.world;
    this.theme = data.theme;
    this.width = data.width;
    this.height = data.height;
    this.tileSize = 20;

    this.solids = [];
    this.tiles = [];
    this.platforms = [];
    this.crates = [];
    this.spikes = [];
    this.lava = [];
    this.sawblades = [];
    this.thwomps = [];
    this.coins = [];
    this.checkpoints = [];
    this.enemies = [];
    this.particles = [];
    this.projectiles = [];
    this.ambientParticles = [];

    this.goal = Object.assign({}, data.goal);
    this.windX = data.windX || 0;
    this.totalCoins = 0;
    this.coinsCollected = 0;
    this.enemiesDefeated = 0;
    this.levelTime = 0;
    this.isCompleted = false;

    this.init();
  }

  init() {
    const cols = Math.ceil(this.width / this.tileSize) + 2;
    const rows = Math.ceil(this.height / this.tileSize) + 2;

    this.tiles = [];
    for (let y = 0; y < rows; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < cols; x++) {
        this.tiles[y][x] = null;
      }
    }

    if (this.data.solids) {
      for (const s of this.data.solids) {
        this.solids.push(Object.assign({}, s));
        const startX = Math.floor(s.x / this.tileSize);
        const endX = Math.floor((s.x + s.w) / this.tileSize);
        const startY = Math.floor(s.y / this.tileSize);
        const endY = Math.floor((s.y + s.h) / this.tileSize);

        for (let ty = startY; ty < endY; ty++) {
          for (let tx = startX; tx < endX; tx++) {
            if (this.tiles[ty]) {
              this.tiles[ty][tx] = {
                solid: true,
                type: s.type || "stone",
                isTop: ty === startY
              };
            }
          }
        }
      }
    }

    if (this.data.crates) {
      this.crates = this.data.crates.map(c => Object.assign({ broken: false }, c));
    }

    if (this.data.platforms) {
      this.platforms = this.data.platforms.map(p => Object.assign({
        broken: false,
        triggered: false,
        timer: 0,
        respawnTimer: 0,
        origX: p.x,
        origY: p.y
      }, p));
    }

    if (this.data.spikes) {
      this.spikes = this.data.spikes.map(s => Object.assign({}, s));
    }

    if (this.data.lava) {
      this.lava = this.data.lava.map(l => Object.assign({}, l));
    }

    if (this.data.sawblades) {
      this.sawblades = this.data.sawblades.map(s => new window.Enemies.SawBladeHazard(s.x, s.y, s.radius, s.dist, s.speed, s.axis));
    }

    if (this.data.thwomps) {
      this.thwomps = this.data.thwomps.map(t => new window.Enemies.FallingThwomp(t.x, t.y, t.w, t.h));
    }

    if (this.data.coins) {
      this.coins = this.data.coins.map(c => ({
        x: c.x,
        y: c.y,
        w: 16,
        h: 16,
        collected: false,
        rot: Math.random() * Math.PI
      }));
      this.totalCoins = this.coins.length;
    }

    if (this.data.checkpoints) {
      this.checkpoints = this.data.checkpoints.map(cp => ({
        x: cp.x,
        y: cp.y,
        w: 24,
        h: 40,
        active: false
      }));
    }

    if (this.data.enemies) {
      for (const e of this.data.enemies) {
        if (e.type === "slime") {
          this.enemies.push(new window.Enemies.SlimeEnemy(e.x, e.y, false));
        } else if (e.type === "frost_slime") {
          this.enemies.push(new window.Enemies.SlimeEnemy(e.x, e.y, true));
        } else if (e.type === "mushroom") {
          this.enemies.push(new window.Enemies.MushroomEnemy(e.x, e.y));
        } else if (e.type === "bat") {
          this.enemies.push(new window.Enemies.BatEnemy(e.x, e.y));
        } else if (e.type === "knight") {
          this.enemies.push(new window.Enemies.KnightEnemy(e.x, e.y));
        } else if (e.type === "cultist") {
          this.enemies.push(new window.Enemies.CultistEnemy(e.x, e.y));
        } else if (e.type === "golem_boss") {
          this.enemies.push(new window.Enemies.MidBossGolem(e.x, e.y));
        } else if (e.type === "dragon_boss") {
          this.enemies.push(new window.Enemies.FinalDragonBoss(e.x, e.y));
        }
      }
    }

    for (let i = 0; i < 50; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 35 + (this.windX ? 60 : 0),
        vy: Math.random() * 25 + 15,
        size: Math.random() * 3 + 1.5,
        color: this.theme === "volcano" || this.theme === "boss" ? "#ff4757" : (this.theme === "ice" ? "#ffffff" : (this.theme === "forest" ? "#2ed573" : "#ffeaa7"))
      });
    }
  }

  update(dt, player) {
    this.levelTime += dt;

    for (const p of this.platforms) {
      if (p.isCrumbling) {
        if (p.triggered && !p.broken) {
          p.timer -= dt;
          if (p.timer <= 0) {
            p.broken = true;
            p.respawnTimer = 2.5;
            for (let i = 0; i < 8; i++) {
              this.particles.push(new window.Enemies.Particle(p.x + Math.random() * p.w, p.y + Math.random() * p.h, (Math.random() - 0.5) * 90, Math.random() * 90, "#a4b0be", 3.5, 0.8));
            }
          }
        } else if (p.broken) {
          p.respawnTimer -= dt;
          if (p.respawnTimer <= 0) {
            p.broken = false;
            p.triggered = false;
          }
        }
      }

      if (p.vx) {
        p.x += p.vx * dt;
        if (p.x <= p.minX || p.x + p.w >= p.maxX) {
          p.vx *= -1;
        }
      }
      if (p.vy) {
        p.y += p.vy * dt;
        if (p.y <= p.minY || p.y >= p.maxY) {
          p.vy *= -1;
        }
      }
    }

    for (const cr of this.crates) {
      if (cr.broken) continue;
      if (window.Collision.rectsOverlap(cr, player)) {
        if (player.vy > 0 && player.y + player.h - player.vy * dt <= cr.y + 12) {
          cr.broken = true;
          player.bounce();
          if (window.AudioManager) window.AudioManager.playLand();
          for (let i = 0; i < 10; i++) {
            this.particles.push(new window.Enemies.Particle(cr.x + 12, cr.y + 12, (Math.random() - 0.5) * 140, -Math.random() * 100, "#d35400", 4, 0.6));
          }
          this.coins.push({ x: cr.x + 4, y: cr.y - 10, w: 16, h: 16, collected: false, rot: 0 });
          this.totalCoins++;
        } else if (player.isAttacking && window.Collision.rectsOverlap(player.slashHitbox, cr)) {
          cr.broken = true;
          if (window.AudioManager) window.AudioManager.playLand();
          for (let i = 0; i < 10; i++) {
            this.particles.push(new window.Enemies.Particle(cr.x + 12, cr.y + 12, (Math.random() - 0.5) * 140, -Math.random() * 100, "#d35400", 4, 0.6));
          }
          this.coins.push({ x: cr.x + 4, y: cr.y - 10, w: 16, h: 16, collected: false, rot: 0 });
          this.totalCoins++;
        } else {
          if (player.vx > 0) {
            player.x = cr.x - player.w;
            player.vx = 0;
          } else if (player.vx < 0) {
            player.x = cr.x + cr.w;
            player.vx = 0;
          }
        }
      }
    }

    for (const s of this.sawblades) {
      s.update(dt);
      if (!player.isDead && window.Collision.circleRectOverlap(s.x, s.y, s.radius * 0.8, player)) {
        player.takeDamage(1, s.x);
      }
    }

    for (const t of this.thwomps) {
      t.update(dt, player, this.tiles, this.tileSize);
      if (!player.isDead && window.Collision.rectsOverlap(t, player)) {
        player.takeDamage(1, t.x + t.w / 2);
      }
    }

    for (const c of this.coins) {
      if (!c.collected) {
        c.rot += dt * 5.5;
        if (window.Collision.rectsOverlap(c, player)) {
          c.collected = true;
          this.coinsCollected++;
          player.coins++;
          if (window.AudioManager) window.AudioManager.playCoin();
          for (let i = 0; i < 6; i++) {
            this.particles.push(new window.Enemies.Particle(c.x + 8, c.y + 8, (Math.random() - 0.5) * 110, (Math.random() - 0.5) * 110, "#f1c40f", 3.5, 0.5));
          }
        }
      }
    }

    for (const cp of this.checkpoints) {
      if (!cp.active && window.Collision.rectsOverlap(cp, player)) {
        cp.active = true;
        player.checkpointX = cp.x;
        player.checkpointY = cp.y;
        if (window.AudioManager) window.AudioManager.playCheckpoint();
        if (window.UIManager) window.UIManager.showToast("Checkpoint Saved!");
        for (let i = 0; i < 14; i++) {
          this.particles.push(new window.Enemies.Particle(cp.x + 12, cp.y + 10, (Math.random() - 0.5) * 130, (Math.random() - 0.5) * 130, "#7df9ff", 4, 0.8));
        }
      }
    }

    if (!player.isDead) {
      for (const sp of this.spikes) {
        const spikeHitbox = { x: sp.x + 4, y: sp.y + 6, w: sp.w - 8, h: sp.h - 6 };
        if (window.Collision.rectsOverlap(spikeHitbox, player)) {
          player.takeDamage(1, sp.x + sp.w / 2);
        }
      }

      for (const l of this.lava) {
        if (window.Collision.rectsOverlap(l, player)) {
          player.takeDamage(player.hp, player.x);
        }
      }

      if (player.y > this.height + 30) {
        player.die();
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.active) {
        this.enemies.splice(i, 1);
        this.enemiesDefeated++;
        for (let p = 0; p < 12; p++) {
          this.particles.push(new window.Enemies.Particle(e.x + e.w / 2, e.y + e.h / 2, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150, "#ff4757", 4.5, 0.6));
        }
        continue;
      }

      e.update(dt, player, this.tiles, this.tileSize, this.particles, this.projectiles);

      if (!player.isDead) {
        if (player.isAttacking && window.Collision.rectsOverlap(player.slashHitbox, e)) {
          e.takeDamage(1, player.x);
        }

        if (window.Collision.rectsOverlap(player, e)) {
          const feetPrev = player.y + player.h - player.vy * dt;
          if (player.vy > 0 && feetPrev <= e.y + 16 && e.type !== "sawblade" && e.type !== "thwomp") {
            e.takeDamage(1, player.x);
            player.bounce();
          } else {
            player.takeDamage(1, e.x + e.w / 2);
          }
        }
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.update(dt, this.tiles, this.tileSize);
      if (!pr.active) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (!player.isDead && window.Collision.circleRectOverlap(pr.x, pr.y, pr.radius, player)) {
        player.takeDamage(1, pr.x);
        pr.active = false;
        this.projectiles.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update(dt)) {
        this.particles.splice(i, 1);
      }
    }

    for (const ap of this.ambientParticles) {
      ap.x += ap.vx * dt;
      ap.y += ap.vy * dt;
      if (ap.y > this.height) ap.y = -10;
      if (ap.x > this.width) ap.x = -10;
      if (ap.x < -10) ap.x = this.width;
    }

    if (!player.isDead && !this.isCompleted && window.Collision.rectsOverlap(this.goal, player)) {
      if (this.id === 10 || this.id === 20) {
        const bossAlive = this.enemies.some(e => e.type === "golem_boss" || e.type === "dragon_boss");
        if (bossAlive) return;
      }
      this.isCompleted = true;
    }
  }

  draw(ctx, camX, camY) {
    this.drawBackground(ctx, camX, camY);

    for (const s of this.solids) {
      const rx = Math.round(s.x - camX);
      const ry = Math.round(s.y - camY);

      ctx.save();
      if (s.type === "grass") {
        ctx.fillStyle = "#1e272e";
        ctx.fillRect(rx, ry, s.w, s.h);

        for (let by = 0; by < s.h; by += 20) {
          const shift = (Math.floor(by / 20) % 2) * 16;
          for (let bx = 0; bx < s.w; bx += 32) {
            ctx.fillStyle = "#2d3436";
            ctx.fillRect(rx + bx + shift + 1, ry + by + 1, 30, 18);
            ctx.fillStyle = "#485460";
            ctx.fillRect(rx + bx + shift + 1, ry + by + 1, 30, 2);
            ctx.fillRect(rx + bx + shift + 1, ry + by + 1, 2, 18);
            ctx.fillStyle = "#1e272e";
            ctx.fillRect(rx + bx + shift + 29, ry + by + 1, 2, 18);
            ctx.fillRect(rx + bx + shift + 1, ry + by + 17, 30, 2);
          }
        }

        ctx.fillStyle = "#16a085";
        ctx.fillRect(rx, ry, s.w, 9);

        ctx.fillStyle = "#27ae60";
        ctx.fillRect(rx, ry, s.w, 7);

        ctx.fillStyle = "#2ecc71";
        ctx.beginPath();
        for (let gx = 0; gx < s.w; gx += 6) {
          const hVar = ((gx * 7) % 5);
          ctx.moveTo(rx + gx, ry + 7);
          ctx.lineTo(rx + gx + 3, ry - 4 - hVar);
          ctx.lineTo(rx + gx + 6, ry + 7);
        }
        ctx.fill();

        ctx.fillStyle = "#55efc4";
        for (let gx = 2; gx < s.w; gx += 12) {
          ctx.fillRect(rx + gx, ry - 3, 2, 4);
        }

        for (let fx = 16; fx < s.w; fx += 52) {
          ctx.fillStyle = "#f1c40f";
          ctx.fillRect(rx + fx, ry - 5, 4, 4);
          ctx.fillStyle = "#e74c3c";
          ctx.fillRect(rx + fx + 1, ry - 4, 2, 2);
        }

        ctx.fillStyle = "#1e824c";
        for (let vx = 20; vx < s.w; vx += 56) {
          const vLen = 10 + ((vx * 13) % 16);
          ctx.fillRect(rx + vx, ry + 7, 3, vLen);
          ctx.fillRect(rx + vx + 3, ry + 12, 4, 3);
          ctx.fillRect(rx + vx - 3, ry + 16, 4, 3);
          if (vLen > 18) {
            ctx.fillRect(rx + vx + 2, ry + 22, 3, 3);
          }
        }

        if (s.h >= 70) {
          for (let tx = 80; tx < s.w - 60; tx += 200) {
            const torchX = rx + tx;
            const torchY = ry + 26;
            ctx.fillStyle = "#532f18";
            ctx.fillRect(torchX - 2, torchY, 4, 14);
            ctx.fillStyle = "#2f3542";
            ctx.fillRect(torchX - 5, torchY + 4, 10, 3);

            const flicker = Math.sin(this.levelTime * 14 + tx) * 2;
            const tGlow = ctx.createRadialGradient(torchX, torchY - 4, 2, torchX, torchY - 4, 34);
            tGlow.addColorStop(0, "rgba(255, 235, 120, 0.45)");
            tGlow.addColorStop(0.5, "rgba(255, 140, 30, 0.18)");
            tGlow.addColorStop(1, "rgba(255, 70, 0, 0)");
            ctx.fillStyle = tGlow;
            ctx.beginPath();
            ctx.arc(torchX, torchY - 4, 34, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#f39c12";
            ctx.beginPath();
            ctx.ellipse(torchX, torchY - 4 + flicker * 0.5, 4, 7 + flicker, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.ellipse(torchX, torchY - 3, 2, 4, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (s.type === "ice") {
        ctx.fillStyle = "#0c2461";
        ctx.fillRect(rx, ry, s.w, s.h);

        ctx.fillStyle = "#1e3799";
        ctx.fillRect(rx, ry, s.w, s.h);

        ctx.fillStyle = "#54a0ff";
        ctx.fillRect(rx, ry, s.w, 10);

        ctx.fillStyle = "#c7ecee";
        ctx.fillRect(rx, ry, s.w, 3);

        ctx.strokeStyle = "#82ccdd";
        ctx.lineWidth = 1;
        for (let bx = 0; bx < s.w; bx += 24) {
          ctx.beginPath();
          ctx.moveTo(rx + bx, ry);
          ctx.lineTo(rx + bx + 8, ry + 14);
          ctx.stroke();
        }

        ctx.fillStyle = "#dff9fb";
        for (let ix = 6; ix < s.w; ix += 36) {
          ctx.beginPath();
          ctx.moveTo(rx + ix, ry + 10);
          ctx.lineTo(rx + ix + 3, ry + 18);
          ctx.lineTo(rx + ix + 6, ry + 10);
          ctx.fill();
        }
      } else {
        const isVolcano = this.theme === "volcano" || this.theme === "boss";
        const isDesert = this.theme === "desert";

        ctx.fillStyle = isVolcano ? "#130f1e" : (isDesert ? "#573012" : "#1e272e");
        ctx.fillRect(rx, ry, s.w, s.h);

        for (let by = 0; by < s.h; by += 22) {
          const shift = (Math.floor(by / 22) % 2) * 16;
          for (let bx = 0; bx < s.w; bx += 32) {
            ctx.fillStyle = isVolcano ? "#241b35" : (isDesert ? "#a0522d" : "#353b48");
            ctx.fillRect(rx + bx + shift + 1, ry + by + 1, 30, 20);
            ctx.fillStyle = isVolcano ? "#382a52" : (isDesert ? "#cd853f" : "#57606f");
            ctx.fillRect(rx + bx + shift + 1, ry + by + 1, 30, 2);
            ctx.fillRect(rx + bx + shift + 1, ry + by + 1, 2, 20);
            ctx.fillStyle = isVolcano ? "#ff475733" : (isDesert ? "#3d1e06" : "#1e272e");
            ctx.fillRect(rx + bx + shift + 29, ry + by + 1, 2, 20);
            ctx.fillRect(rx + bx + shift + 1, ry + by + 19, 30, 2);
          }
        }

        ctx.fillStyle = isVolcano ? "#4834d4" : (isDesert ? "#e67e22" : "#718093");
        ctx.fillRect(rx, ry, s.w, 4);

        if (isVolcano) {
          ctx.fillStyle = "#ff4757";
          ctx.fillRect(rx, ry, s.w, 1.5);
        } else if (isDesert) {
          ctx.fillStyle = "#f1c40f";
          ctx.fillRect(rx, ry, s.w, 1.5);
        } else {
          ctx.fillStyle = "#2ed573";
          for (let mx = 12; mx < s.w; mx += 60) {
            ctx.fillRect(rx + mx, ry + 4, 6, 10);
          }
        }

        if (s.h >= 70) {
          for (let tx = 80; tx < s.w - 60; tx += 200) {
            const torchX = rx + tx;
            const torchY = ry + 26;
            ctx.fillStyle = "#532f18";
            ctx.fillRect(torchX - 2, torchY, 4, 14);
            ctx.fillStyle = "#2f3542";
            ctx.fillRect(torchX - 5, torchY + 4, 10, 3);

            const flicker = Math.sin(this.levelTime * 14 + tx) * 2;
            const tGlow = ctx.createRadialGradient(torchX, torchY - 4, 2, torchX, torchY - 4, 34);
            tGlow.addColorStop(0, "rgba(255, 235, 120, 0.45)");
            tGlow.addColorStop(0.5, "rgba(255, 140, 30, 0.18)");
            tGlow.addColorStop(1, "rgba(255, 70, 0, 0)");
            ctx.fillStyle = tGlow;
            ctx.beginPath();
            ctx.arc(torchX, torchY - 4, 34, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#f39c12";
            ctx.beginPath();
            ctx.ellipse(torchX, torchY - 4 + flicker * 0.5, 4, 7 + flicker, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.ellipse(torchX, torchY - 3, 2, 4, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    }

    for (const p of this.platforms) {
      if (p.broken) continue;
      const rx = Math.round(p.x - camX);
      const ry = Math.round(p.y - camY);

      ctx.save();
      ctx.strokeStyle = "#718093";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx + 8, ry);
      ctx.lineTo(rx + 8, ry - 140);
      ctx.moveTo(rx + p.w - 8, ry);
      ctx.lineTo(rx + p.w - 8, ry - 140);
      ctx.stroke();

      for (let cy = ry - 14; cy > ry - 140; cy -= 16) {
        ctx.fillStyle = "#95a5a6";
        ctx.fillRect(rx + 6, cy, 4, 6);
        ctx.fillRect(rx + p.w - 10, cy, 4, 6);
      }

      if (p.isCrumbling) {
        ctx.fillStyle = p.triggered ? "#d2dae2" : "#95a5a6";
        ctx.fillRect(rx, ry, p.w, p.h);
        ctx.strokeStyle = "#2c3e50";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rx, ry, p.w, p.h);
      } else {
        ctx.fillStyle = "#8e5229";
        ctx.fillRect(rx, ry, p.w, p.h);

        ctx.fillStyle = "#c07b46";
        ctx.fillRect(rx, ry, p.w, 4);

        ctx.strokeStyle = "#532f18";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rx, ry, p.w, p.h);

        ctx.fillStyle = "#3d2714";
        ctx.fillRect(rx + 6, ry + 4, 3, 3);
        ctx.fillRect(rx + p.w - 9, ry + 4, 3, 3);

        ctx.fillStyle = "#532f18";
        ctx.fillRect(rx + 16, ry, p.w - 32, p.h);
        ctx.fillStyle = "#8e5229";
        ctx.fillRect(rx + 17, ry + 1, p.w - 34, p.h - 2);
      }
      ctx.restore();
    }

    for (const cr of this.crates) {
      if (cr.broken) continue;
      const rx = Math.round(cr.x - camX);
      const ry = Math.round(cr.y - camY);

      ctx.save();
      ctx.fillStyle = "#cd6133";
      ctx.fillRect(rx, ry, cr.w, cr.h);

      ctx.strokeStyle = "#532f18";
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, cr.w, cr.h);

      ctx.beginPath();
      ctx.moveTo(rx + 3, ry + 3);
      ctx.lineTo(rx + cr.w - 3, ry + cr.h - 3);
      ctx.moveTo(rx + cr.w - 3, ry + 3);
      ctx.lineTo(rx + 3, ry + cr.h - 3);
      ctx.stroke();

      ctx.fillStyle = "#f5cd79";
      ctx.fillRect(rx + 2, ry + 2, 3, 3);
      ctx.fillRect(rx + cr.w - 5, ry + 2, 3, 3);
      ctx.fillRect(rx + 2, ry + cr.h - 5, 3, 3);
      ctx.fillRect(rx + cr.w - 5, ry + cr.h - 5, 3, 3);
      ctx.restore();
    }

    for (const sp of this.spikes) {
      const rx = Math.round(sp.x - camX);
      const ry = Math.round(sp.y - camY);
      ctx.save();
      const count = Math.floor(sp.w / 12);
      for (let i = 0; i < count; i++) {
        ctx.fillStyle = "#dfe4ea";
        ctx.beginPath();
        ctx.moveTo(rx + i * 12, ry + sp.h);
        ctx.lineTo(rx + i * 12 + 6, ry);
        ctx.lineTo(rx + i * 12 + 12, ry + sp.h);
        ctx.fill();

        ctx.fillStyle = "#747d8c";
        ctx.beginPath();
        ctx.moveTo(rx + i * 12 + 6, ry);
        ctx.lineTo(rx + i * 12 + 12, ry + sp.h);
        ctx.lineTo(rx + i * 12 + 6, ry + sp.h);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(rx + i * 12 + 5, ry + 1, 2, 4);
      }
      ctx.restore();
    }

    for (const l of this.lava) {
      const rx = Math.round(l.x - camX);
      const ry = Math.round(l.y - camY);
      ctx.save();
      ctx.fillStyle = "#eb4d4b";
      ctx.fillRect(rx, ry, l.w, l.h);

      ctx.fillStyle = "#f0932b";
      for (let i = 0; i < l.w; i += 20) {
        const bubble = Math.sin(this.levelTime * 5 + i) * 4;
        ctx.fillRect(rx + i, ry + bubble, 16, 8);
      }

      ctx.fillStyle = "#f6e58d";
      for (let i = 4; i < l.w; i += 40) {
        ctx.fillRect(rx + i, ry + 2, 6, 4);
      }
      ctx.restore();
    }

    for (const cp of this.checkpoints) {
      const rx = Math.round(cp.x - camX);
      const ry = Math.round(cp.y - camY);
      ctx.save();
      ctx.fillStyle = "#8395a7";
      ctx.fillRect(rx + 4, ry, 5, cp.h);
      ctx.fillStyle = "#576574";
      ctx.fillRect(rx + 2, ry + cp.h - 4, 9, 4);

      ctx.fillStyle = cp.active ? "#2ed573" : "#ff4757";
      const wave = Math.sin(this.levelTime * 6) * 3;
      ctx.beginPath();
      ctx.moveTo(rx + 9, ry + 4);
      ctx.lineTo(rx + 28 + wave, ry + 12);
      ctx.lineTo(rx + 9, ry + 20);
      ctx.fill();

      if (cp.active) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(rx + 16, ry + 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    for (const c of this.coins) {
      if (c.collected) continue;
      const rx = Math.round(c.x - camX + 8);
      const ry = Math.round(c.y - camY + 8 + Math.sin(this.levelTime * 4.5 + c.x) * 3.5);
      const scaleX = Math.abs(Math.cos(c.rot));

      ctx.save();
      ctx.translate(rx, ry);
      ctx.scale(scaleX, 1);

      ctx.fillStyle = "#f1c40f";
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f39c12";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffeaa7";
      ctx.fillRect(-2, -4, 4, 8);

      ctx.restore();
    }

    const gx = Math.round(this.goal.x - camX);
    const gy = Math.round(this.goal.y - camY);
    ctx.save();

    const portalGlow = ctx.createRadialGradient(gx + this.goal.w / 2, gy + this.goal.h / 2, 4, gx + this.goal.w / 2, gy + this.goal.h / 2, 48);
    portalGlow.addColorStop(0, "rgba(255, 230, 100, 0.65)");
    portalGlow.addColorStop(0.5, "rgba(243, 156, 18, 0.28)");
    portalGlow.addColorStop(1, "rgba(230, 126, 34, 0)");
    ctx.fillStyle = portalGlow;
    ctx.fillRect(gx - 20, gy - 20, this.goal.w + 40, this.goal.h + 30);

    ctx.fillStyle = "#1e272e";
    ctx.beginPath();
    ctx.arc(gx + this.goal.w / 2, gy + 16, this.goal.w / 2 + 5, Math.PI, 0);
    ctx.rect(gx - 5, gy + 16, this.goal.w + 10, this.goal.h - 16);
    ctx.fill();

    ctx.fillStyle = "#ffb142";
    ctx.beginPath();
    ctx.arc(gx + this.goal.w / 2, gy + 16, this.goal.w / 2, Math.PI, 0);
    ctx.rect(gx, gy + 16, this.goal.w, this.goal.h - 16);
    ctx.fill();

    const innerGlow = ctx.createRadialGradient(gx + this.goal.w / 2, gy + this.goal.h / 2, 2, gx + this.goal.w / 2, gy + this.goal.h / 2, 18);
    innerGlow.addColorStop(0, "#ffffff");
    innerGlow.addColorStop(0.6, "#ffeaa7");
    innerGlow.addColorStop(1, "#f39c12");
    ctx.fillStyle = innerGlow;
    ctx.fill();

    ctx.strokeStyle = "#57606f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(gx + this.goal.w / 2, gy + 16, this.goal.w / 2 + 3, Math.PI, 0);
    ctx.lineTo(gx + this.goal.w + 3, gy + this.goal.h);
    ctx.moveTo(gx - 3, gy + 16);
    ctx.lineTo(gx - 3, gy + this.goal.h);
    ctx.stroke();

    ctx.restore();

    for (const s of this.sawblades) s.draw(ctx, camX, camY);
    for (const t of this.thwomps) t.draw(ctx, camX, camY);
    for (const e of this.enemies) e.draw(ctx, camX, camY);
    for (const pr of this.projectiles) pr.draw(ctx, camX, camY);
    for (const pt of this.particles) pt.draw(ctx, camX, camY);

    ctx.save();
    for (const ap of this.ambientParticles) {
      ctx.fillStyle = ap.color;
      ctx.fillRect(Math.round(ap.x - camX), Math.round(ap.y - camY), ap.size, ap.size);
    }
    ctx.restore();
  }

  drawBackground(ctx, camX, camY) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.save();
    let worldKey = "world1";
    if (this.world === 2 || this.theme === "forest") worldKey = "world2";
    else if (this.world === 3 || this.theme === "desert") worldKey = "world3";
    else if (this.world === 4 || this.theme === "ice") worldKey = "world4";
    else if (this.world === 5 || this.theme === "volcano" || this.theme === "boss") worldKey = "world5";

    const bgImg = window.GameAssets ? window.GameAssets.getImage(worldKey) : null;
    if (bgImg) {
      const parallaxFactor = 0.22;
      const scrollX = -(camX * parallaxFactor) % w;

      ctx.drawImage(bgImg, scrollX, 0, w, h);
      if (scrollX < 0) {
        ctx.drawImage(bgImg, scrollX + w, 0, w, h);
      } else if (scrollX > 0) {
        ctx.drawImage(bgImg, scrollX - w, 0, w, h);
      }

      const tint = ctx.createLinearGradient(0, h * 0.65, 0, h);
      if (this.theme === "volcano" || this.theme === "boss") {
        tint.addColorStop(0, "rgba(235, 77, 75, 0)");
        tint.addColorStop(1, "rgba(180, 20, 10, 0.4)");
      } else if (this.theme === "ice") {
        tint.addColorStop(0, "rgba(130, 204, 221, 0)");
        tint.addColorStop(1, "rgba(12, 36, 97, 0.35)");
      } else if (this.theme === "forest") {
        tint.addColorStop(0, "rgba(25, 25, 35, 0)");
        tint.addColorStop(1, "rgba(10, 15, 25, 0.5)");
      } else if (this.theme === "desert") {
        tint.addColorStop(0, "rgba(243, 156, 18, 0)");
        tint.addColorStop(1, "rgba(90, 40, 15, 0.35)");
      } else {
        tint.addColorStop(0, "rgba(46, 204, 113, 0)");
        tint.addColorStop(1, "rgba(20, 60, 40, 0.25)");
      }
      ctx.fillStyle = tint;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (this.theme === "grassland") {
        grad.addColorStop(0, "#1e5799");
        grad.addColorStop(0.35, "#2989d8");
        grad.addColorStop(0.7, "#7db9e8");
        grad.addColorStop(1, "#d4eaf7");
      } else if (this.theme === "forest") {
        grad.addColorStop(0, "#191923");
        grad.addColorStop(0.5, "#2b2a4c");
        grad.addColorStop(1, "#40407a");
      } else if (this.theme === "desert") {
        grad.addColorStop(0, "#3d1428");
        grad.addColorStop(0.5, "#93444a");
        grad.addColorStop(1, "#f39c12");
      } else if (this.theme === "ice") {
        grad.addColorStop(0, "#0c2461");
        grad.addColorStop(0.5, "#1e3799");
        grad.addColorStop(1, "#82ccdd");
      } else {
        grad.addColorStop(0, "#2c000e");
        grad.addColorStop(0.5, "#5c1324");
        grad.addColorStop(1, "#b33927");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }
}

window.LevelInstance = Level;
