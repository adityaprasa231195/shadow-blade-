class SoundController {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.6;
    this.musicNode = null;
    this.currentTrack = null;
    this.musicInterval = null;
    this.noteStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setSfxEnabled(val) {
    this.sfxEnabled = !!val;
  }

  setMusicEnabled(val) {
    this.musicEnabled = !!val;
    if (!this.musicEnabled) {
      this.stopMusic();
    } else if (this.currentTrack) {
      this.playMusic(this.currentTrack);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
  }

  setMusicVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  playTone(freq, type, duration, startVol, endVol, pitchEnd) {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (pitchEnd !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, pitchEnd), now + duration);
      }
      gain.gain.setValueAtTime(startVol * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol * this.sfxVolume), now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playNoise(duration, startVol, endVol, filterFreq) {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(filterFreq || 800, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(startVol * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol * this.sfxVolume), now + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  playJump() {
    this.playTone(180, "square", 0.15, 0.25, 0.01, 460);
  }

  playLand() {
    this.playTone(90, "triangle", 0.08, 0.2, 0.01, 45);
  }

  playCoin() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(987.77, now);
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch (e) {}
  }

  playHurt() {
    this.playTone(280, "sawtooth", 0.22, 0.35, 0.01, 70);
    this.playNoise(0.2, 0.25, 0.01, 1000);
  }

  playDeath() {
    if (!this.sfxEnabled || !this.ctx) return;
    const notes = [320, 280, 240, 180, 140, 90];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sawtooth", 0.16, 0.3, 0.01, freq * 0.85);
      }, idx * 110);
    });
    this.playNoise(0.6, 0.35, 0.01, 600);
  }

  playEnemyHit() {
    this.playTone(350, "triangle", 0.09, 0.3, 0.01, 120);
  }

  playEnemyDefeat() {
    this.playTone(190, "square", 0.18, 0.3, 0.01, 480);
    this.playNoise(0.18, 0.25, 0.01, 1600);
  }

  playCheckpoint() {
    if (!this.sfxEnabled || !this.ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "triangle", 0.25, 0.2, 0.01, freq * 1.05);
      }, idx * 70);
    });
  }

  playLevelComplete() {
    if (!this.sfxEnabled || !this.ctx) return;
    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.50, d: 0.4 }
    ];
    let offset = 0;
    notes.forEach(n => {
      setTimeout(() => {
        this.playTone(n.f, "sine", n.d, 0.35, 0.01, n.f * 1.02);
      }, offset * 1000);
      offset += n.d * 0.9;
    });
  }

  playBossRoar() {
    this.playTone(110, "sawtooth", 0.8, 0.45, 0.01, 45);
    this.playNoise(0.7, 0.4, 0.01, 450);
  }

  playBossShoot() {
    this.playTone(420, "sawtooth", 0.25, 0.3, 0.01, 110);
    this.playNoise(0.2, 0.3, 0.01, 800);
  }

  playLaser() {
    this.playTone(950, "sawtooth", 0.35, 0.35, 0.01, 220);
  }

  playSword() {
    this.playTone(600, "sine", 0.12, 0.2, 0.01, 180);
    this.playNoise(0.1, 0.18, 0.01, 2400);
  }

  playClick() {
    this.playTone(450, "sine", 0.04, 0.15, 0.01, 600);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentTrack = null;
  }

  playMusic(worldId) {
    this.currentTrack = worldId;
    if (!this.musicEnabled || !this.ctx) return;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    const scales = {
      1: {
        bass: [130.81, 146.83, 164.81, 174.61],
        melody: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 329.63],
        bpm: 125,
        type: "triangle"
      },
      2: {
        bass: [110.00, 123.47, 130.81, 98.00],
        melody: [220.00, 261.63, 329.63, 392.00, 329.63, 261.63, 246.94, 220.00],
        bpm: 115,
        type: "sine"
      },
      3: {
        bass: [98.00, 110.00, 116.54, 98.00],
        melody: [196.00, 207.65, 246.94, 293.66, 311.13, 246.94, 207.65, 196.00],
        bpm: 130,
        type: "sawtooth"
      },
      4: {
        bass: [87.31, 98.00, 110.00, 87.31],
        melody: [174.61, 220.00, 261.63, 329.63, 261.63, 220.00, 196.00, 174.61],
        bpm: 135,
        type: "triangle"
      },
      5: {
        bass: [73.42, 82.41, 87.31, 73.42],
        melody: [146.83, 174.61, 220.00, 261.63, 220.00, 174.61, 164.81, 146.83],
        bpm: 145,
        type: "sawtooth"
      },
      boss: {
        bass: [65.41, 65.41, 73.42, 82.41],
        melody: [261.63, 311.13, 392.00, 466.16, 523.25, 466.16, 392.00, 311.13],
        bpm: 160,
        type: "sawtooth"
      }
    };

    const config = scales[worldId] || scales[1];
    const beatMs = (60 / config.bpm) * 1000 * 0.5;
    this.noteStep = 0;

    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const bassNote = config.bass[Math.floor(this.noteStep / 4) % config.bass.length];
        const melNote = config.melody[this.noteStep % config.melody.length];

        if (this.noteStep % 2 === 0) {
          const oscB = this.ctx.createOscillator();
          const gainB = this.ctx.createGain();
          oscB.type = "triangle";
          oscB.frequency.setValueAtTime(bassNote, now);
          gainB.gain.setValueAtTime(0.2 * this.musicVolume, now);
          gainB.gain.exponentialRampToValueAtTime(0.001, now + (beatMs * 1.8) / 1000);
          oscB.connect(gainB);
          gainB.connect(this.ctx.destination);
          oscB.start(now);
          oscB.stop(now + (beatMs * 1.8) / 1000);
        }

        const oscM = this.ctx.createOscillator();
        const gainM = this.ctx.createGain();
        oscM.type = config.type;
        oscM.frequency.setValueAtTime(melNote, now);
        gainM.gain.setValueAtTime(0.08 * this.musicVolume, now);
        gainM.gain.exponentialRampToValueAtTime(0.001, now + (beatMs * 0.9) / 1000);
        oscM.connect(gainM);
        gainM.connect(this.ctx.destination);
        oscM.start(now);
        oscM.stop(now + (beatMs * 0.9) / 1000);

        this.noteStep++;
      } catch (e) {}
    }, beatMs);
  }
}

window.AudioManager = new SoundController();
