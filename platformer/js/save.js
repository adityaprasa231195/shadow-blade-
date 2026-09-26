class SaveSystem {
  constructor() {
    this.STORAGE_KEY = "shadow_quest_save_data_v1";
    this.data = {
      unlockedLevels: [1],
      completedLevels: {},
      totalScore: 0,
      totalCoins: 0,
      settings: {
        music: true,
        sfx: true,
        musicVol: 70,
        sfxVol: 80,
        screenShake: true
      }
    };
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          this.data.unlockedLevels = Array.isArray(parsed.unlockedLevels) ? parsed.unlockedLevels : [1];
          this.data.completedLevels = parsed.completedLevels || {};
          this.data.totalScore = parsed.totalScore || 0;
          this.data.totalCoins = parsed.totalCoins || 0;
          if (parsed.settings) {
            this.data.settings = Object.assign(this.data.settings, parsed.settings);
          }
        }
      }
    } catch (e) {}
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
  }

  isLevelUnlocked(lvl) {
    if (lvl === 1) return true;
    return this.data.unlockedLevels.includes(lvl);
  }

  unlockLevel(lvl) {
    if (lvl >= 1 && lvl <= 20 && !this.data.unlockedLevels.includes(lvl)) {
      this.data.unlockedLevels.push(lvl);
      this.data.unlockedLevels.sort((a, b) => a - b);
      this.save();
    }
  }

  recordLevelComplete(lvl, stars, score, time, coins) {
    if (!this.data.completedLevels[lvl]) {
      this.data.completedLevels[lvl] = {
        stars: [false, false, false],
        bestScore: 0,
        bestTime: 999999,
        coinsCollected: 0
      };
    }

    const prev = this.data.completedLevels[lvl];
    const prevStarsCount = prev.stars.filter(Boolean).length;

    for (let i = 0; i < 3; i++) {
      if (stars[i]) prev.stars[i] = true;
    }

    if (score > prev.bestScore) {
      this.data.totalScore += (score - prev.bestScore);
      prev.bestScore = score;
    }
    if (time < prev.bestTime) {
      prev.bestTime = time;
    }
    if (coins > prev.coinsCollected) {
      prev.coinsCollected = coins;
    }

    this.data.totalCoins += coins;

    if (lvl < 20) {
      this.unlockLevel(lvl + 1);
    }

    this.save();
  }

  getLevelData(lvl) {
    return this.data.completedLevels[lvl] || {
      stars: [false, false, false],
      bestScore: 0,
      bestTime: null,
      coinsCollected: 0
    };
  }

  getTotalStars() {
    let total = 0;
    for (const lvl in this.data.completedLevels) {
      const item = this.data.completedLevels[lvl];
      if (item && item.stars) {
        total += item.stars.filter(Boolean).length;
      }
    }
    return total;
  }

  getCompletedLevelsCount() {
    return Object.keys(this.data.completedLevels).length;
  }

  updateSettings(settingsObj) {
    this.data.settings = Object.assign(this.data.settings, settingsObj);
    this.save();
  }

  resetAll() {
    this.data = {
      unlockedLevels: [1],
      completedLevels: {},
      totalScore: 0,
      totalCoins: 0,
      settings: {
        music: true,
        sfx: true,
        musicVol: 70,
        sfxVol: 80,
        screenShake: true
      }
    };
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {}
  }
}

window.SaveManager = new SaveSystem();
