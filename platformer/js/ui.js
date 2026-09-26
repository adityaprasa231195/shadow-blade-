class UIManager {
  constructor() {
    this.selectedLevelId = 1;
    this.toastTimer = null;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.screenMenu = document.getElementById("screen-menu");
    this.screenLevelSelect = document.getElementById("screen-level-select");
    this.hud = document.getElementById("hud");

    this.modalPause = document.getElementById("modal-pause");
    this.modalSettings = document.getElementById("modal-settings");
    this.modalControls = document.getElementById("modal-controls");
    this.modalCredits = document.getElementById("modal-credits");
    this.modalClear = document.getElementById("modal-level-clear");
    this.modalDeath = document.getElementById("modal-game-over");
    this.modalVictory = document.getElementById("modal-victory");

    this.toast = document.getElementById("toast-checkpoint");

    this.levelsGrid = document.getElementById("levels-grid");
    this.detailTitle = document.getElementById("detail-title");
    this.detailTimeTarget = document.getElementById("detail-time-target");
    this.detailDesc = document.getElementById("detail-desc");
    this.detailScoreVal = document.getElementById("detail-score-val");
    this.btnStartLevel = document.getElementById("btn-start-level");

    this.lsLevelsCount = document.getElementById("ls-levels-count");
    this.lsStarsCount = document.getElementById("ls-stars-count");
    this.lsCoinsCount = document.getElementById("ls-coins-count");

    this.hudHearts = document.getElementById("hud-hearts");
    this.hudLevelBadge = document.getElementById("hud-level-badge");
    this.hudCoins = document.getElementById("hud-coins");
    this.hudTimer = document.getElementById("hud-timer");
    this.hudScore = document.getElementById("hud-score");
    this.bossHudBar = document.getElementById("boss-hud-bar");
    this.bossName = document.getElementById("boss-name");
    this.bossPhaseLabel = document.getElementById("boss-phase-label");
    this.bossBarFill = document.getElementById("boss-bar-fill");

    this.toggleMusic = document.getElementById("toggle-music");
    this.sliderMusic = document.getElementById("slider-music");
    this.toggleSfx = document.getElementById("toggle-sfx");
    this.sliderSfx = document.getElementById("slider-sfx");
    this.toggleShake = document.getElementById("toggle-shake");
  }

  bindEvents() {
    document.getElementById("btn-play").addEventListener("click", () => {
      this.playSoundClick();
      const nextLvl = window.SaveManager.data.unlockedLevels[window.SaveManager.data.unlockedLevels.length - 1] || 1;
      window.GameEngine.startLevel(nextLvl);
    });

    document.getElementById("btn-level-select").addEventListener("click", () => {
      this.playSoundClick();
      this.showLevelSelect();
    });

    document.getElementById("btn-level-back").addEventListener("click", () => {
      this.playSoundClick();
      this.showMainMenu();
    });

    document.getElementById("btn-settings").addEventListener("click", () => {
      this.playSoundClick();
      this.openModal(this.modalSettings);
    });

    document.getElementById("btn-controls").addEventListener("click", () => {
      this.playSoundClick();
      this.openModal(this.modalControls);
    });

    document.getElementById("btn-credits").addEventListener("click", () => {
      this.playSoundClick();
      this.openModal(this.modalCredits);
    });

    document.getElementById("btn-settings-close").addEventListener("click", () => {
      this.playSoundClick();
      this.closeModal(this.modalSettings);
    });

    document.getElementById("btn-controls-close").addEventListener("click", () => {
      this.playSoundClick();
      this.closeModal(this.modalControls);
    });

    document.getElementById("btn-credits-close").addEventListener("click", () => {
      this.playSoundClick();
      this.closeModal(this.modalCredits);
    });

    document.getElementById("btn-start-level").addEventListener("click", () => {
      this.playSoundClick();
      if (window.SaveManager.isLevelUnlocked(this.selectedLevelId)) {
        window.GameEngine.startLevel(this.selectedLevelId);
      }
    });

    document.getElementById("btn-pause").addEventListener("click", () => {
      this.playSoundClick();
      window.GameEngine.togglePause();
    });

    document.getElementById("btn-resume").addEventListener("click", () => {
      this.playSoundClick();
      window.GameEngine.resumeGame();
    });

    document.getElementById("btn-restart").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      window.GameEngine.restartLevel();
    });

    document.getElementById("btn-pause-settings").addEventListener("click", () => {
      this.playSoundClick();
      this.openModal(this.modalSettings);
    });

    document.getElementById("btn-pause-level-select").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      this.showLevelSelect();
    });

    document.getElementById("btn-pause-main-menu").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      this.showMainMenu();
    });

    document.getElementById("btn-clear-retry").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      window.GameEngine.restartLevel();
    });

    document.getElementById("btn-clear-select").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      this.showLevelSelect();
    });

    document.getElementById("btn-clear-next").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      const nextId = window.GameEngine.currentLevelId + 1;
      if (nextId <= 20) {
        window.GameEngine.startLevel(nextId);
      } else {
        this.showVictoryModal();
      }
    });

    document.getElementById("btn-death-retry").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      window.GameEngine.restartLevel();
    });

    document.getElementById("btn-death-select").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      this.showLevelSelect();
    });

    document.getElementById("btn-vic-menu").addEventListener("click", () => {
      this.playSoundClick();
      this.closeAllModals();
      this.showMainMenu();
    });

    document.getElementById("btn-reset-save").addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
        this.playSoundClick();
        window.SaveManager.resetAll();
        this.renderLevelSelectGrid();
        this.closeModal(this.modalSettings);
      }
    });

    this.toggleMusic.addEventListener("change", (e) => {
      window.SaveManager.updateSettings({ music: e.target.checked });
      window.AudioManager.setMusicEnabled(e.target.checked);
    });

    this.sliderMusic.addEventListener("input", (e) => {
      const vol = e.target.value / 100;
      window.SaveManager.updateSettings({ musicVol: parseInt(e.target.value) });
      window.AudioManager.setMusicVolume(vol);
    });

    this.toggleSfx.addEventListener("change", (e) => {
      window.SaveManager.updateSettings({ sfx: e.target.checked });
      window.AudioManager.setSfxEnabled(e.target.checked);
    });

    this.sliderSfx.addEventListener("input", (e) => {
      const vol = e.target.value / 100;
      window.SaveManager.updateSettings({ sfxVol: parseInt(e.target.value) });
      window.AudioManager.setSfxVolume(vol);
    });

    this.toggleShake.addEventListener("change", (e) => {
      window.SaveManager.updateSettings({ screenShake: e.target.checked });
    });

    const fsClick = () => {
      this.playSoundClick();
      this.toggleFullscreen();
    };
    const bFs = document.getElementById("btn-fullscreen");
    if (bFs) bFs.addEventListener("click", fsClick);
    const bMFs = document.getElementById("btn-menu-fullscreen");
    if (bMFs) bMFs.addEventListener("click", fsClick);
    const bPFs = document.getElementById("btn-pause-fullscreen");
    if (bPFs) bPFs.addEventListener("click", fsClick);
    const bTFs = document.getElementById("btn-toggle-fullscreen");
    if (bTFs) bTFs.addEventListener("click", fsClick);

    document.addEventListener("fullscreenchange", () => this.updateFullscreenUI());
    document.addEventListener("webkitfullscreenchange", () => this.updateFullscreenUI());

    const worldCards = document.querySelectorAll(".world-card");
    worldCards.forEach(card => {
      card.addEventListener("click", () => {
        this.playSoundClick();
        worldCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const wId = parseInt(card.getAttribute("data-world"));
        const targetLevel = (wId - 1) * 4 + 1;
        this.selectLevelTile(targetLevel);
      });
    });

    this.initSettingsUI();
  }

  playSoundClick() {
    if (window.AudioManager) {
      window.AudioManager.init();
      window.AudioManager.playClick();
    }
  }

  initSettingsUI() {
    const s = window.SaveManager.data.settings;
    this.toggleMusic.checked = s.music;
    this.sliderMusic.value = s.musicVol;
    this.toggleSfx.checked = s.sfx;
    this.sliderSfx.value = s.sfxVol;
    this.toggleShake.checked = s.screenShake;

    window.AudioManager.setMusicEnabled(s.music);
    window.AudioManager.setMusicVolume(s.musicVol / 100);
    window.AudioManager.setSfxEnabled(s.sfx);
    window.AudioManager.setSfxVolume(s.sfxVol / 100);
  }

  showMainMenu() {
    this.closeAllModals();
    this.hud.classList.add("hidden");
    this.screenLevelSelect.classList.remove("active");
    this.screenMenu.classList.add("active");
    const app = document.getElementById("game-app");
    if (app) app.classList.remove("is-playing");
    window.GameEngine.state = "MENU";
    window.AudioManager.playMusic(1);
  }

  showLevelSelect() {
    this.closeAllModals();
    this.hud.classList.add("hidden");
    this.screenMenu.classList.remove("active");
    this.screenLevelSelect.classList.add("active");
    const app = document.getElementById("game-app");
    if (app) app.classList.remove("is-playing");
    window.GameEngine.state = "LEVEL_SELECT";
    this.renderLevelSelectGrid();
    this.selectLevelTile(this.selectedLevelId);
  }

  renderLevelSelectGrid() {
    this.levelsGrid.innerHTML = "";
    const totalStars = window.SaveManager.getTotalStars();
    const completedCount = window.SaveManager.getCompletedLevelsCount();
    const totalCoins = window.SaveManager.data.totalCoins;

    this.lsLevelsCount.textContent = `${completedCount} / 20`;
    this.lsStarsCount.textContent = `${totalStars} / 60`;
    this.lsCoinsCount.textContent = `${totalCoins}`;

    const maxUnlocked = Math.max(...window.SaveManager.data.unlockedLevels);
    for (let w = 2; w <= 5; w++) {
      const lockElem = document.getElementById(`w${w}-lock`);
      if (lockElem) {
        const reqLvl = (w - 1) * 4 + 1;
        if (maxUnlocked >= reqLvl) {
          lockElem.textContent = "✓";
          lockElem.classList.add("status-unlocked");
        } else {
          lockElem.textContent = "🔒";
          lockElem.classList.remove("status-unlocked");
        }
      }
    }

    for (let i = 1; i <= 20; i++) {
      const unlocked = window.SaveManager.isLevelUnlocked(i);
      const lvlData = window.SaveManager.getLevelData(i);
      const tile = document.createElement("div");
      tile.className = `level-tile ${unlocked ? "" : "locked"} ${i === this.selectedLevelId ? "selected" : ""}`;
      tile.setAttribute("data-level", i);

      if (unlocked) {
        const num = document.createElement("div");
        num.className = "level-num";
        num.textContent = i;
        tile.appendChild(num);

        const starsRow = document.createElement("div");
        starsRow.className = "level-stars";
        for (let s = 0; s < 3; s++) {
          const star = document.createElement("span");
          star.textContent = "★";
          if (lvlData.stars && lvlData.stars[s]) {
            star.className = "star-filled";
          }
          starsRow.appendChild(star);
        }
        tile.appendChild(starsRow);
      } else {
        const lock = document.createElement("div");
        lock.className = "lock-icon";
        lock.textContent = "🔒";
        tile.appendChild(lock);
      }

      tile.addEventListener("click", () => {
        if (unlocked) {
          this.playSoundClick();
          this.selectLevelTile(i);
        }
      });

      this.levelsGrid.appendChild(tile);
    }
  }

  selectLevelTile(lvlId) {
    this.selectedLevelId = lvlId;
    const tiles = this.levelsGrid.querySelectorAll(".level-tile");
    tiles.forEach(t => {
      const id = parseInt(t.getAttribute("data-level"));
      if (id === lvlId) {
        t.classList.add("selected");
      } else {
        t.classList.remove("selected");
      }
    });

    const lConfig = window.LevelsData.getLevel(lvlId);
    const lData = window.SaveManager.getLevelData(lvlId);

    this.detailTitle.textContent = `Level ${lConfig.id} - ${lConfig.name}`;
    this.detailTimeTarget.textContent = `Est: ${lConfig.estTime}`;
    this.detailDesc.textContent = lConfig.desc;
    this.detailScoreVal.textContent = lData.bestScore.toLocaleString();

    const star1 = document.getElementById("req-star-1");
    const star2 = document.getElementById("req-star-2");
    const star3 = document.getElementById("req-star-3");

    if (star1) star1.className = `star-bullet ${lData.stars && lData.stars[0] ? "achieved" : ""}`;
    if (star2) star2.className = `star-bullet ${lData.stars && lData.stars[1] ? "achieved" : ""}`;
    if (star3) star3.className = `star-bullet ${lData.stars && lData.stars[2] ? "achieved" : ""}`;

    const worldIndex = Math.ceil(lvlId / 4);
    const worldCards = document.querySelectorAll(".world-card");
    worldCards.forEach(c => {
      const w = parseInt(c.getAttribute("data-world"));
      if (w === worldIndex) c.classList.add("active");
      else c.classList.remove("active");
    });
  }

  showInGameHUD(levelId, levelName) {
    this.screenMenu.classList.remove("active");
    this.screenLevelSelect.classList.remove("active");
    this.hud.classList.remove("hidden");
    const app = document.getElementById("game-app");
    if (app) app.classList.add("is-playing");
    this.hudLevelBadge.textContent = `L${levelId}: ${levelName}`;
    this.hideBossBar();
  }

  updateHUD(player, level, score, timerSec) {
    this.hudHearts.innerHTML = "";
    for (let i = 0; i < player.maxHp; i++) {
      const h = document.createElement("span");
      h.className = `heart ${i < player.hp ? "full" : "empty"} ${player.hp === 1 && i === 0 ? "pulsing" : ""}`;
      this.hudHearts.appendChild(h);
    }

    this.hudCoins.textContent = player.coins;
    this.hudScore.textContent = score.toLocaleString();

    const mins = Math.floor(timerSec / 60);
    const secs = Math.floor(timerSec % 60);
    this.hudTimer.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    if (level.id === 10 || level.id === 20) {
      const boss = level.enemies.find(e => e.type === "golem_boss" || e.type === "dragon_boss");
      if (boss && boss.active) {
        this.showBossBar(boss);
      } else {
        this.hideBossBar();
      }
    } else {
      this.hideBossBar();
    }
  }

  showBossBar(boss) {
    this.bossHudBar.classList.remove("hidden");
    if (boss.type === "golem_boss") {
      this.bossName.textContent = "Ancient Stone Golem";
      this.bossPhaseLabel.textContent = boss.isDizzy ? "STUNNED" : "DEFENDING";
    } else {
      this.bossName.textContent = "Ignis the Shadow Wyrm";
      this.bossPhaseLabel.textContent = `Phase ${boss.phase}`;
    }
    const ratio = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
    this.bossBarFill.style.width = `${ratio * 100}%`;
  }

  hideBossBar() {
    this.bossHudBar.classList.add("hidden");
  }

  showPauseModal() {
    this.openModal(this.modalPause);
  }

  hidePauseModal() {
    this.closeModal(this.modalPause);
  }

  showDeathModal() {
    this.openModal(this.modalDeath);
  }

  showVictoryModal() {
    const totalStars = window.SaveManager.getTotalStars();
    const totalCoins = window.SaveManager.data.totalCoins;
    const totalScore = window.SaveManager.data.totalScore;

    document.getElementById("vic-total-stars").textContent = `${totalStars} / 60`;
    document.getElementById("vic-total-coins").textContent = totalCoins.toLocaleString();
    document.getElementById("vic-total-score").textContent = totalScore.toLocaleString();

    this.openModal(this.modalVictory);
  }

  showLevelClearModal(level, timeSec, scoreEarned, stars) {
    document.getElementById("clear-level-title").textContent = `Level ${level.id} - ${level.name}`;
    const mins = Math.floor(timeSec / 60);
    const secs = Math.floor(timeSec % 60);
    document.getElementById("clear-stat-time").textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    document.getElementById("clear-stat-coins").textContent = `${level.coinsCollected} / ${level.totalCoins}`;
    document.getElementById("clear-stat-enemies").textContent = `${level.enemiesDefeated}`;
    document.getElementById("clear-stat-score").textContent = `+${scoreEarned.toLocaleString()}`;

    const star1 = document.getElementById("clear-star-1");
    const star2 = document.getElementById("clear-star-2");
    const star3 = document.getElementById("clear-star-3");

    if (stars[0]) star1.classList.add("awarded"); else star1.classList.remove("awarded");
    if (stars[1]) star2.classList.add("awarded"); else star2.classList.remove("awarded");
    if (stars[2]) star3.classList.add("awarded"); else star3.classList.remove("awarded");

    this.openModal(this.modalClear);
  }

  showToast(text) {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toast.querySelector("span:last-child").textContent = text;
    this.toast.classList.add("active");
    this.toastTimer = setTimeout(() => {
      this.toast.classList.remove("active");
    }, 2200);
  }

  openModal(modal) {
    if (modal) modal.classList.add("active");
  }

  closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  closeAllModals() {
    const modals = document.querySelectorAll(".modal-backdrop");
    modals.forEach(m => m.classList.remove("active"));
  }

  toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  updateFullscreenUI() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const app = document.getElementById("game-app");
    if (app) {
      if (isFs) app.classList.add("is-fullscreen");
      else app.classList.remove("is-fullscreen");
    }
    const bFs = document.getElementById("btn-fullscreen");
    if (bFs) bFs.textContent = isFs ? "🗗" : "⛶";
    const bMFs = document.getElementById("btn-menu-fullscreen");
    if (bMFs) bMFs.textContent = isFs ? "🗗 Windowed" : "⛶ Fullscreen";
    const bPFs = document.getElementById("btn-pause-fullscreen");
    if (bPFs) bPFs.textContent = isFs ? "🗗 Windowed" : "⛶ Fullscreen";
    const bTFs = document.getElementById("btn-toggle-fullscreen");
    if (bTFs) bTFs.textContent = isFs ? "Exit Fullscreen" : "Enter Fullscreen";
  }
}

window.UIManager = new UIManager();
