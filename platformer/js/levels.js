class LevelDatabase {
  constructor() {
    this.levels = [];
    this.initLevels();
  }

  initLevels() {
    const l1 = {
      id: 1,
      name: "Getting Started",
      world: 1,
      theme: "grassland",
      estTime: "2 min",
      desc: "Learn basic movement and jumping across green fields with active slimes.",
      width: 1900,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 1780, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 920, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 460, h: 100, type: "grass" },
        { x: 520, y: 440, w: 420, h: 100, type: "grass" },
        { x: 1000, y: 440, w: 420, h: 100, type: "grass" },
        { x: 1480, y: 440, w: 420, h: 100, type: "grass" },
        { x: 260, y: 360, w: 110, h: 20, type: "wood" },
        { x: 680, y: 350, w: 120, h: 20, type: "wood" },
        { x: 1140, y: 340, w: 130, h: 20, type: "wood" }
      ],
      crates: [
        { x: 380, y: 416, w: 24, h: 24 },
        { x: 850, y: 416, w: 24, h: 24 },
        { x: 1320, y: 416, w: 24, h: 24 }
      ],
      platforms: [],
      coins: [
        { x: 290, y: 320 }, { x: 320, y: 320 },
        { x: 485, y: 370 }, { x: 710, y: 310 }, { x: 750, y: 310 },
        { x: 965, y: 370 }, { x: 1170, y: 300 }, { x: 1210, y: 300 },
        { x: 1540, y: 390 }, { x: 1620, y: 390 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "slime", x: 640, y: 410 },
        { type: "mushroom", x: 1120, y: 410 },
        { type: "slime", x: 1580, y: 410 }
      ]
    };

    const l2 = {
      id: 2,
      name: "Small Gaps",
      world: 1,
      theme: "grassland",
      estTime: "2 min",
      desc: "Short jumps and gaps over stone pillars guarded by aggressive foes.",
      width: 2100,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 1980, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1050, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 320, h: 100, type: "grass" },
        { x: 380, y: 440, w: 200, h: 100, type: "grass" },
        { x: 640, y: 420, w: 160, h: 120, type: "stone" },
        { x: 860, y: 440, w: 320, h: 100, type: "grass" },
        { x: 1240, y: 400, w: 180, h: 140, type: "stone" },
        { x: 1480, y: 440, w: 240, h: 100, type: "grass" },
        { x: 1780, y: 440, w: 320, h: 100, type: "grass" }
      ],
      crates: [
        { x: 260, y: 416, w: 24, h: 24 },
        { x: 1000, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 230, y: 340, w: 80, h: 14 },
        { x: 720, y: 320, w: 80, h: 14 },
        { x: 1580, y: 330, w: 90, h: 14 }
      ],
      coins: [
        { x: 350, y: 370 }, { x: 450, y: 390 }, { x: 605, y: 360 },
        { x: 690, y: 350 }, { x: 750, y: 270 }, { x: 1180, y: 350 },
        { x: 1300, y: 340 }, { x: 1420, y: 370 }, { x: 1620, y: 280 },
        { x: 1840, y: 390 }, { x: 1900, y: 390 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "slime", x: 460, y: 410 },
        { type: "mushroom", x: 940, y: 410 },
        { type: "slime", x: 1560, y: 410 },
        { type: "mushroom", x: 1850, y: 410 }
      ]
    };

    const l3 = {
      id: 3,
      name: "First Enemy",
      world: 1,
      theme: "grassland",
      estTime: "2-3 min",
      desc: "Introduce basic enemies. Stomp them or slash with your sword!",
      width: 2200,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2060, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1100, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 400, h: 100, type: "grass" },
        { x: 460, y: 440, w: 480, h: 100, type: "grass" },
        { x: 1000, y: 440, w: 520, h: 100, type: "grass" },
        { x: 1580, y: 440, w: 620, h: 100, type: "grass" },
        { x: 600, y: 340, w: 100, h: 20, type: "wood" },
        { x: 1200, y: 320, w: 120, h: 20, type: "stone" }
      ],
      crates: [
        { x: 320, y: 416, w: 24, h: 24 },
        { x: 800, y: 416, w: 24, h: 24 },
        { x: 1420, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 800, y: 320, w: 80, h: 14 },
        { x: 1420, y: 330, w: 90, h: 14 }
      ],
      coins: [
        { x: 260, y: 390 }, { x: 550, y: 390 }, { x: 640, y: 290 },
        { x: 740, y: 390 }, { x: 840, y: 270 }, { x: 1120, y: 390 },
        { x: 1250, y: 270 }, { x: 1460, y: 280 }, { x: 1720, y: 390 },
        { x: 1850, y: 390 }, { x: 1950, y: 390 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "slime", x: 650, y: 410 },
        { type: "slime", x: 850, y: 410 },
        { type: "mushroom", x: 1280, y: 410 },
        { type: "slime", x: 1760, y: 410 },
        { type: "mushroom", x: 1900, y: 410 }
      ]
    };

    const l4 = {
      id: 4,
      name: "Moving Platforms",
      world: 1,
      theme: "grassland",
      estTime: "2-3 min",
      desc: "Timing is key: leap across horizontal moving platforms over chasms.",
      width: 2400,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2260, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1150, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 320, h: 100, type: "grass" },
        { x: 580, y: 440, w: 200, h: 100, type: "grass" },
        { x: 1060, y: 440, w: 260, h: 100, type: "grass" },
        { x: 1580, y: 440, w: 200, h: 100, type: "grass" },
        { x: 2040, y: 440, w: 360, h: 100, type: "grass" }
      ],
      crates: [
        { x: 220, y: 416, w: 24, h: 24 },
        { x: 1180, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 350, y: 380, w: 90, h: 14, vx: 70, minX: 340, maxX: 520 },
        { x: 810, y: 370, w: 90, h: 14, vx: -80, minX: 800, maxX: 1000 },
        { x: 1340, y: 360, w: 90, h: 14, vx: 90, minX: 1340, maxX: 1520 },
        { x: 1800, y: 360, w: 90, h: 14, vx: -85, minX: 1800, maxX: 1980 }
      ],
      coins: [
        { x: 420, y: 310 }, { x: 670, y: 390 }, { x: 900, y: 300 },
        { x: 1180, y: 390 }, { x: 1420, y: 290 }, { x: 1670, y: 390 },
        { x: 1890, y: 290 }, { x: 2150, y: 390 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "slime", x: 660, y: 410 },
        { type: "mushroom", x: 1180, y: 410 },
        { type: "slime", x: 1660, y: 410 },
        { type: "mushroom", x: 2160, y: 410 }
      ]
    };

    const l5 = {
      id: 5,
      name: "Spikes",
      world: 2,
      theme: "forest",
      estTime: "2-3 min",
      desc: "Welcome to the Dark Forest. Watch your step around razor-sharp spikes.",
      width: 2400,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2260, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1150, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 300, h: 100, type: "stone" },
        { x: 300, y: 440, w: 260, h: 100, type: "stone" },
        { x: 680, y: 440, w: 340, h: 100, type: "stone" },
        { x: 1080, y: 440, w: 400, h: 100, type: "stone" },
        { x: 1540, y: 440, w: 320, h: 100, type: "stone" },
        { x: 1920, y: 440, w: 480, h: 100, type: "stone" }
      ],
      crates: [
        { x: 200, y: 416, w: 24, h: 24 },
        { x: 920, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 340, y: 330, w: 80, h: 14 },
        { x: 460, y: 310, w: 80, h: 14 },
        { x: 1020, y: 340, w: 80, h: 14 },
        { x: 1470, y: 330, w: 80, h: 14 }
      ],
      coins: [
        { x: 380, y: 280 }, { x: 500, y: 260 }, { x: 820, y: 390 },
        { x: 1200, y: 390 }, { x: 1510, y: 280 }, { x: 1720, y: 390 },
        { x: 2050, y: 390 }, { x: 2150, y: 390 }
      ],
      spikes: [
        { x: 300, y: 424, w: 260, h: 16 },
        { x: 740, y: 424, w: 120, h: 16 },
        { x: 1240, y: 424, w: 140, h: 16 },
        { x: 1620, y: 424, w: 120, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "mushroom", x: 920, y: 410 },
        { type: "bat", x: 1100, y: 140 },
        { type: "mushroom", x: 1420, y: 410 },
        { type: "slime", x: 2000, y: 410 }
      ]
    };

    const l6 = {
      id: 6,
      name: "Collectibles",
      world: 2,
      theme: "forest",
      estTime: "2-3 min",
      desc: "Multi-tiered forest platforms filled with coin trails and hidden paths.",
      width: 2500,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2360, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1200, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 400, h: 100, type: "stone" },
        { x: 520, y: 440, w: 450, h: 100, type: "stone" },
        { x: 1100, y: 440, w: 480, h: 100, type: "stone" },
        { x: 1700, y: 440, w: 800, h: 100, type: "stone" },
        { x: 200, y: 330, w: 120, h: 20, type: "wood" },
        { x: 360, y: 240, w: 120, h: 20, type: "wood" },
        { x: 700, y: 330, w: 140, h: 20, type: "wood" },
        { x: 880, y: 230, w: 140, h: 20, type: "wood" },
        { x: 1300, y: 320, w: 140, h: 20, type: "wood" },
        { x: 1480, y: 220, w: 140, h: 20, type: "wood" }
      ],
      crates: [
        { x: 240, y: 306, w: 24, h: 24 },
        { x: 760, y: 306, w: 24, h: 24 },
        { x: 1360, y: 296, w: 24, h: 24 }
      ],
      platforms: [
        { x: 450, y: 360, w: 80, h: 14 },
        { x: 1010, y: 350, w: 80, h: 14 },
        { x: 1620, y: 340, w: 80, h: 14 }
      ],
      coins: [
        { x: 240, y: 280 }, { x: 280, y: 280 }, { x: 400, y: 190 }, { x: 440, y: 190 },
        { x: 600, y: 390 }, { x: 740, y: 280 }, { x: 780, y: 280 }, { x: 920, y: 180 },
        { x: 1180, y: 390 }, { x: 1340, y: 270 }, { x: 1520, y: 170 }, { x: 1800, y: 390 },
        { x: 1920, y: 390 }, { x: 2100, y: 390 }, { x: 2220, y: 390 }
      ],
      spikes: [
        { x: 620, y: 424, w: 60, h: 16 },
        { x: 1220, y: 424, w: 60, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "bat", x: 400, y: 120 },
        { type: "mushroom", x: 720, y: 410 },
        { type: "bat", x: 960, y: 120 },
        { type: "slime", x: 1350, y: 410 },
        { type: "bat", x: 1550, y: 120 },
        { type: "mushroom", x: 1950, y: 410 }
      ]
    };

    const l7 = {
      id: 7,
      name: "Vertical Climb",
      world: 2,
      theme: "forest",
      estTime: "3 min",
      desc: "Ascend high above the forest floor using scaffolding and lifts.",
      width: 2200,
      height: 720,
      playerStart: { x: 80, y: 620 },
      goal: { x: 2060, y: 160, w: 40, h: 60 },
      checkpoints: [{ x: 1050, y: 380 }],
      solids: [
        { x: 0, y: 680, w: 400, h: 40, type: "stone" },
        { x: 450, y: 600, w: 200, h: 120, type: "stone" },
        { x: 700, y: 520, w: 200, h: 200, type: "stone" },
        { x: 950, y: 440, w: 250, h: 280, type: "stone" },
        { x: 1300, y: 360, w: 220, h: 360, type: "stone" },
        { x: 1600, y: 280, w: 220, h: 440, type: "stone" },
        { x: 1900, y: 220, w: 300, h: 500, type: "stone" }
      ],
      crates: [
        { x: 500, y: 576, w: 24, h: 24 },
        { x: 1020, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 380, y: 560, w: 70, h: 14, vy: 50, minY: 520, maxY: 620 },
        { x: 640, y: 470, w: 70, h: 14, vy: -50, minY: 430, maxY: 520 },
        { x: 880, y: 400, w: 70, h: 14, vy: 50, minY: 360, maxY: 440 },
        { x: 1220, y: 320, w: 80, h: 14, vx: 60, minX: 1200, maxX: 1290 },
        { x: 1520, y: 240, w: 80, h: 14, vy: -60, minY: 200, maxY: 280 },
        { x: 1820, y: 180, w: 80, h: 14, vx: -60, minX: 1780, maxX: 1880 }
      ],
      coins: [
        { x: 420, y: 490 }, { x: 550, y: 540 }, { x: 670, y: 410 },
        { x: 800, y: 460 }, { x: 910, y: 330 }, { x: 1080, y: 380 },
        { x: 1260, y: 260 }, { x: 1410, y: 300 }, { x: 1560, y: 180 },
        { x: 1710, y: 220 }, { x: 1860, y: 120 }
      ],
      spikes: [
        { x: 550, y: 704, w: 800, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "bat", x: 500, y: 420 },
        { type: "slime", x: 780, y: 490 },
        { type: "bat", x: 1100, y: 250 },
        { type: "mushroom", x: 1400, y: 330 },
        { type: "bat", x: 1700, y: 140 }
      ]
    };

    const l8 = {
      id: 8,
      name: "Multiple Enemies",
      world: 2,
      theme: "forest",
      estTime: "3 min",
      desc: "Brave swarms of diving bats and fierce charging mushrooms.",
      width: 2500,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2360, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1200, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 350, h: 100, type: "stone" },
        { x: 420, y: 440, w: 480, h: 100, type: "stone" },
        { x: 980, y: 440, w: 500, h: 100, type: "stone" },
        { x: 1560, y: 440, w: 520, h: 100, type: "stone" },
        { x: 2160, y: 440, w: 340, h: 100, type: "stone" }
      ],
      crates: [
        { x: 220, y: 416, w: 24, h: 24 },
        { x: 1050, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 330, y: 340, w: 90, h: 14 },
        { x: 890, y: 330, w: 90, h: 14 },
        { x: 1470, y: 330, w: 90, h: 14 },
        { x: 2070, y: 340, w: 90, h: 14 }
      ],
      coins: [
        { x: 370, y: 290 }, { x: 600, y: 390 }, { x: 750, y: 390 },
        { x: 930, y: 280 }, { x: 1150, y: 390 }, { x: 1350, y: 390 },
        { x: 1510, y: 280 }, { x: 1750, y: 390 }, { x: 1950, y: 390 },
        { x: 2110, y: 290 }, { x: 2280, y: 390 }
      ],
      spikes: [
        { x: 650, y: 424, w: 80, h: 16 },
        { x: 1780, y: 424, w: 80, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "bat", x: 450, y: 150 },
        { type: "mushroom", x: 550, y: 410 },
        { type: "bat", x: 800, y: 150 },
        { type: "mushroom", x: 1100, y: 410 },
        { type: "bat", x: 1350, y: 150 },
        { type: "mushroom", x: 1650, y: 410 },
        { type: "bat", x: 1900, y: 150 },
        { type: "slime", x: 2240, y: 410 }
      ]
    };

    const l9 = {
      id: 9,
      name: "Disappearing Platforms",
      world: 3,
      theme: "desert",
      estTime: "3 min",
      desc: "Ancient ruin stones crumble 1 second after landing. Move swiftly!",
      width: 2600,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2460, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1250, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 260, h: 100, type: "stone" },
        { x: 740, y: 440, w: 200, h: 100, type: "stone" },
        { x: 1200, y: 440, w: 220, h: 100, type: "stone" },
        { x: 1800, y: 440, w: 220, h: 100, type: "stone" },
        { x: 2360, y: 440, w: 240, h: 100, type: "stone" }
      ],
      crates: [
        { x: 790, y: 416, w: 24, h: 24 },
        { x: 1250, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 290, y: 380, w: 80, h: 14, isCrumbling: true },
        { x: 440, y: 340, w: 80, h: 14, isCrumbling: true },
        { x: 590, y: 370, w: 80, h: 14, isCrumbling: true },
        { x: 970, y: 370, w: 80, h: 14, isCrumbling: true },
        { x: 1090, y: 340, w: 80, h: 14, isCrumbling: true },
        { x: 1450, y: 370, w: 80, h: 14, isCrumbling: true },
        { x: 1580, y: 330, w: 80, h: 14, isCrumbling: true },
        { x: 1700, y: 370, w: 80, h: 14, isCrumbling: true },
        { x: 2050, y: 360, w: 80, h: 14, isCrumbling: true },
        { x: 2200, y: 330, w: 80, h: 14, isCrumbling: true }
      ],
      coins: [
        { x: 330, y: 320 }, { x: 480, y: 280 }, { x: 630, y: 310 },
        { x: 840, y: 390 }, { x: 1010, y: 310 }, { x: 1130, y: 280 },
        { x: 1300, y: 390 }, { x: 1490, y: 310 }, { x: 1620, y: 270 },
        { x: 1740, y: 310 }, { x: 1910, y: 390 }, { x: 2090, y: 300 },
        { x: 2240, y: 270 }
      ],
      spikes: [
        { x: 260, y: 520, w: 480, h: 20 },
        { x: 940, y: 520, w: 260, h: 20 },
        { x: 1420, y: 520, w: 380, h: 20 },
        { x: 2020, y: 520, w: 340, h: 20 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "cultist", x: 820, y: 405 },
        { type: "bat", x: 1020, y: 150 },
        { type: "cultist", x: 1890, y: 405 }
      ]
    };

    const l10 = {
      id: 10,
      name: "Mid Boss",
      world: 3,
      theme: "desert",
      estTime: "3-4 min",
      desc: "Awaken the Stone Golem! Dodge its shockwaves and attack the core when stunned.",
      width: 1400,
      height: 540,
      playerStart: { x: 100, y: 380 },
      goal: { x: 1300, y: 360, w: 40, h: 60 },
      checkpoints: [],
      solids: [
        { x: 0, y: 440, w: 1400, h: 100, type: "stone" },
        { x: 0, y: 0, w: 60, h: 540, type: "stone" },
        { x: 1340, y: 0, w: 60, h: 540, type: "stone" },
        { x: 250, y: 340, w: 120, h: 20, type: "stone" },
        { x: 1030, y: 340, w: 120, h: 20, type: "stone" },
        { x: 580, y: 260, w: 240, h: 20, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 420, y: 320, w: 80, h: 14 },
        { x: 900, y: 320, w: 80, h: 14 }
      ],
      coins: [
        { x: 310, y: 290 }, { x: 640, y: 210 }, { x: 700, y: 210 },
        { x: 760, y: 210 }, { x: 1090, y: 290 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "golem_boss", x: 800, y: 360 }
      ]
    };

    const l11 = {
      id: 11,
      name: "Windy Cliffs",
      world: 3,
      theme: "desert",
      estTime: "3 min",
      desc: "High altitude desert gusts blow fiercely. Adjust your jump arcs carefully.",
      width: 2600,
      height: 540,
      windX: 75,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2460, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1300, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 320, h: 100, type: "stone" },
        { x: 500, y: 440, w: 220, h: 100, type: "stone" },
        { x: 950, y: 440, w: 220, h: 100, type: "stone" },
        { x: 1250, y: 440, w: 240, h: 100, type: "stone" },
        { x: 1700, y: 440, w: 220, h: 100, type: "stone" },
        { x: 2100, y: 440, w: 200, h: 100, type: "stone" },
        { x: 2400, y: 440, w: 200, h: 100, type: "stone" }
      ],
      crates: [
        { x: 540, y: 416, w: 24, h: 24 },
        { x: 1320, y: 416, w: 24, h: 24 }
      ],
      platforms: [
        { x: 340, y: 360, w: 80, h: 14, vx: 50, minX: 330, maxX: 460 },
        { x: 750, y: 350, w: 80, h: 14, vx: -60, minX: 740, maxX: 900 },
        { x: 1510, y: 360, w: 80, h: 14, vx: 60, minX: 1500, maxX: 1650 },
        { x: 1940, y: 350, w: 80, h: 14, vx: -50, minX: 1930, maxX: 2060 },
        { x: 2320, y: 360, w: 70, h: 14 }
      ],
      coins: [
        { x: 400, y: 290 }, { x: 610, y: 390 }, { x: 820, y: 280 },
        { x: 1060, y: 390 }, { x: 1370, y: 390 }, { x: 1580, y: 290 },
        { x: 1810, y: 390 }, { x: 2000, y: 280 }, { x: 2200, y: 390 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "bat", x: 600, y: 150 },
        { type: "cultist", x: 1040, y: 405 },
        { type: "bat", x: 1400, y: 150 },
        { type: "cultist", x: 1790, y: 405 },
        { type: "bat", x: 2180, y: 150 }
      ]
    };

    const l12 = {
      id: 12,
      name: "Traps",
      world: 3,
      theme: "desert",
      estTime: "3 min",
      desc: "Ancient crushing stone blocks slam down from above. Dash through unharmed.",
      width: 2500,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2360, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1200, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 400, h: 100, type: "stone" },
        { x: 480, y: 440, w: 420, h: 100, type: "stone" },
        { x: 980, y: 440, w: 450, h: 100, type: "stone" },
        { x: 1500, y: 440, w: 480, h: 100, type: "stone" },
        { x: 2060, y: 440, w: 440, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 410, y: 350, w: 60, h: 14 },
        { x: 910, y: 350, w: 60, h: 14 },
        { x: 1440, y: 350, w: 50, h: 14 },
        { x: 1990, y: 350, w: 60, h: 14 }
      ],
      coins: [
        { x: 300, y: 390 }, { x: 620, y: 390 }, { x: 740, y: 390 },
        { x: 1120, y: 390 }, { x: 1280, y: 390 }, { x: 1650, y: 390 },
        { x: 1820, y: 390 }, { x: 2180, y: 390 }, { x: 2280, y: 390 }
      ],
      spikes: [
        { x: 400, y: 520, w: 80, h: 20 },
        { x: 900, y: 520, w: 80, h: 20 },
        { x: 1430, y: 520, w: 70, h: 20 },
        { x: 1980, y: 520, w: 80, h: 20 }
      ],
      sawblades: [],
      thwomps: [
        { x: 580, y: 160, w: 44, h: 44 },
        { x: 760, y: 160, w: 44, h: 44 },
        { x: 1100, y: 160, w: 44, h: 44 },
        { x: 1680, y: 160, w: 44, h: 44 },
        { x: 1840, y: 160, w: 44, h: 44 },
        { x: 2160, y: 160, w: 44, h: 44 }
      ],
      enemies: [
        { type: "cultist", x: 690, y: 405 },
        { type: "cultist", x: 1760, y: 405 }
      ]
    };

    const l13 = {
      id: 13,
      name: "Faster Enemies",
      world: 4,
      theme: "ice",
      estTime: "3-4 min",
      desc: "Prepare for aggressive frost bats and cunning cultists with fast spells.",
      width: 2600,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2460, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1250, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 340, h: 100, type: "stone" },
        { x: 420, y: 440, w: 400, h: 100, type: "stone" },
        { x: 900, y: 440, w: 420, h: 100, type: "stone" },
        { x: 1400, y: 440, w: 460, h: 100, type: "stone" },
        { x: 1940, y: 440, w: 420, h: 100, type: "stone" },
        { x: 2400, y: 440, w: 200, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 350, y: 350, w: 60, h: 14 },
        { x: 830, y: 350, w: 60, h: 14 },
        { x: 1330, y: 340, w: 60, h: 14 },
        { x: 1870, y: 350, w: 60, h: 14 },
        { x: 2350, y: 350, w: 45, h: 14 }
      ],
      coins: [
        { x: 260, y: 390 }, { x: 550, y: 390 }, { x: 720, y: 390 },
        { x: 1050, y: 390 }, { x: 1220, y: 390 }, { x: 1560, y: 390 },
        { x: 1750, y: 390 }, { x: 2080, y: 390 }, { x: 2250, y: 390 }
      ],
      spikes: [
        { x: 600, y: 424, w: 60, h: 16 },
        { x: 1600, y: 424, w: 60, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "bat", x: 500, y: 150 },
        { type: "cultist", x: 680, y: 405 },
        { type: "bat", x: 980, y: 150 },
        { type: "cultist", x: 1160, y: 405 },
        { type: "bat", x: 1480, y: 150 },
        { type: "cultist", x: 1700, y: 405 },
        { type: "bat", x: 2020, y: 150 },
        { type: "cultist", x: 2200, y: 405 }
      ]
    };

    const l14 = {
      id: 14,
      name: "Ice Stage",
      world: 4,
      theme: "ice",
      estTime: "3-4 min",
      desc: "Slick icy surfaces reduce ground friction. Manage your slide momentum!",
      width: 2700,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2560, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1300, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 300, h: 100, type: "stone" },
        { x: 300, y: 440, w: 400, h: 100, type: "ice" },
        { x: 760, y: 440, w: 450, h: 100, type: "ice" },
        { x: 1280, y: 440, w: 420, h: 100, type: "ice" },
        { x: 1780, y: 440, w: 460, h: 100, type: "ice" },
        { x: 2320, y: 440, w: 380, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 710, y: 360, w: 45, h: 14 },
        { x: 1220, y: 350, w: 50, h: 14 },
        { x: 1710, y: 360, w: 60, h: 14 },
        { x: 2250, y: 350, w: 60, h: 14 }
      ],
      coins: [
        { x: 450, y: 390 }, { x: 550, y: 390 }, { x: 880, y: 390 },
        { x: 1000, y: 390 }, { x: 1400, y: 390 }, { x: 1540, y: 390 },
        { x: 1900, y: 390 }, { x: 2050, y: 390 }, { x: 2420, y: 390 }
      ],
      spikes: [
        { x: 580, y: 424, w: 60, h: 16 },
        { x: 1050, y: 424, w: 80, h: 16 },
        { x: 1580, y: 424, w: 80, h: 16 },
        { x: 2100, y: 424, w: 60, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "frost_slime", x: 420, y: 410 },
        { type: "frost_slime", x: 920, y: 410 },
        { type: "frost_slime", x: 1450, y: 410 },
        { type: "frost_slime", x: 1980, y: 410 }
      ]
    };

    const l15 = {
      id: 15,
      name: "Lava Stage",
      world: 4,
      theme: "volcano",
      estTime: "4 min",
      desc: "A massive difficulty jump! Molten lava pools and sinking rocks await.",
      width: 2800,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2660, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1350, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 260, h: 100, type: "stone" },
        { x: 600, y: 440, w: 200, h: 100, type: "stone" },
        { x: 1260, y: 440, w: 220, h: 100, type: "stone" },
        { x: 1920, y: 440, w: 200, h: 100, type: "stone" },
        { x: 2560, y: 440, w: 240, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 280, y: 390, w: 75, h: 14, isCrumbling: true },
        { x: 380, y: 360, w: 75, h: 14, vx: 50, minX: 370, maxX: 480 },
        { x: 490, y: 390, w: 75, h: 14, isCrumbling: true },
        { x: 820, y: 380, w: 75, h: 14, vx: 60, minX: 810, maxX: 950 },
        { x: 990, y: 350, w: 75, h: 14, isCrumbling: true },
        { x: 1120, y: 380, w: 75, h: 14, vx: -60, minX: 1080, maxX: 1220 },
        { x: 1500, y: 380, w: 75, h: 14, isCrumbling: true },
        { x: 1640, y: 350, w: 75, h: 14, vx: 70, minX: 1620, maxX: 1780 },
        { x: 1800, y: 380, w: 75, h: 14, isCrumbling: true },
        { x: 2150, y: 380, w: 75, h: 14, vx: 70, minX: 2140, maxX: 2300 },
        { x: 2360, y: 350, w: 75, h: 14, isCrumbling: true }
      ],
      coins: [
        { x: 320, y: 330 }, { x: 420, y: 300 }, { x: 530, y: 330 },
        { x: 680, y: 390 }, { x: 860, y: 320 }, { x: 1030, y: 290 },
        { x: 1350, y: 390 }, { x: 1540, y: 320 }, { x: 1680, y: 290 },
        { x: 2000, y: 390 }, { x: 2190, y: 320 }, { x: 2400, y: 290 }
      ],
      spikes: [],
      lava: [
        { x: 260, y: 480, w: 340, h: 60 },
        { x: 800, y: 480, w: 460, h: 60 },
        { x: 1460, y: 480, w: 460, h: 60 },
        { x: 2120, y: 480, w: 440, h: 60 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "cultist", x: 680, y: 405 },
        { type: "bat", x: 920, y: 150 },
        { type: "cultist", x: 1980, y: 405 }
      ]
    };

    const l16 = {
      id: 16,
      name: "Dark Forest",
      world: 4,
      theme: "forest",
      estTime: "4 min",
      desc: "Low visibility and spinning sawblades moving along iron tracks.",
      width: 2800,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2660, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1350, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 400, h: 100, type: "stone" },
        { x: 520, y: 440, w: 480, h: 100, type: "stone" },
        { x: 1100, y: 440, w: 480, h: 100, type: "stone" },
        { x: 1680, y: 440, w: 480, h: 100, type: "stone" },
        { x: 2260, y: 440, w: 540, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 420, y: 340, w: 80, h: 14 },
        { x: 1020, y: 340, w: 60, h: 14 },
        { x: 1600, y: 340, w: 60, h: 14 },
        { x: 2180, y: 340, w: 60, h: 14 }
      ],
      coins: [
        { x: 460, y: 290 }, { x: 700, y: 390 }, { x: 820, y: 390 },
        { x: 1050, y: 290 }, { x: 1300, y: 390 }, { x: 1450, y: 390 },
        { x: 1630, y: 290 }, { x: 1850, y: 390 }, { x: 2000, y: 390 },
        { x: 2210, y: 290 }, { x: 2450, y: 390 }
      ],
      spikes: [],
      sawblades: [
        { x: 620, y: 410, radius: 22, dist: 160, speed: 110, axis: "h" },
        { x: 1220, y: 410, radius: 22, dist: 160, speed: 120, axis: "h" },
        { x: 1800, y: 410, radius: 22, dist: 160, speed: 130, axis: "h" },
        { x: 2380, y: 410, radius: 22, dist: 160, speed: 140, axis: "h" }
      ],
      thwomps: [],
      enemies: [
        { type: "bat", x: 750, y: 150 },
        { type: "bat", x: 1350, y: 150 },
        { type: "bat", x: 1950, y: 150 }
      ]
    };

    const l17 = {
      id: 17,
      name: "Castle Interior",
      world: 5,
      theme: "castle",
      estTime: "4 min",
      desc: "Infiltrate the Dark Castle. Elite knights guard ornate chandelier corridors.",
      width: 2900,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2760, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1400, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 420, h: 100, type: "stone" },
        { x: 500, y: 440, w: 500, h: 100, type: "stone" },
        { x: 1120, y: 440, w: 520, h: 100, type: "stone" },
        { x: 1740, y: 440, w: 520, h: 100, type: "stone" },
        { x: 2380, y: 440, w: 520, h: 100, type: "stone" },
        { x: 250, y: 320, w: 120, h: 20, type: "stone" },
        { x: 750, y: 320, w: 140, h: 20, type: "stone" },
        { x: 1350, y: 320, w: 140, h: 20, type: "stone" },
        { x: 1950, y: 320, w: 140, h: 20, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 430, y: 350, w: 60, h: 14 },
        { x: 1030, y: 350, w: 70, h: 14 },
        { x: 1650, y: 350, w: 70, h: 14 },
        { x: 2280, y: 350, w: 80, h: 14 }
      ],
      coins: [
        { x: 290, y: 270 }, { x: 620, y: 390 }, { x: 800, y: 270 },
        { x: 1220, y: 390 }, { x: 1400, y: 270 }, { x: 1820, y: 390 },
        { x: 2000, y: 270 }, { x: 2450, y: 390 }, { x: 2600, y: 390 }
      ],
      spikes: [
        { x: 680, y: 424, w: 60, h: 16 },
        { x: 1280, y: 424, w: 60, h: 16 },
        { x: 1880, y: 424, w: 60, h: 16 }
      ],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "knight", x: 720, y: 400 },
        { type: "knight", x: 1320, y: 400 },
        { type: "knight", x: 1920, y: 400 },
        { type: "knight", x: 2520, y: 400 }
      ]
    };

    const l18 = {
      id: 18,
      name: "Combined Challenge",
      world: 5,
      theme: "castle",
      estTime: "4 min",
      desc: "All mechanics unite: sawblades, crumbling blocks, moving lifts, and knights.",
      width: 3000,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 2860, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1450, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 320, h: 100, type: "stone" },
        { x: 500, y: 440, w: 400, h: 100, type: "stone" },
        { x: 1100, y: 440, w: 420, h: 100, type: "stone" },
        { x: 1700, y: 440, w: 420, h: 100, type: "stone" },
        { x: 2300, y: 440, w: 700, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 340, y: 360, w: 75, h: 14, isCrumbling: true },
        { x: 420, y: 330, w: 75, h: 14, isCrumbling: true },
        { x: 920, y: 370, w: 75, h: 14, vx: 70, minX: 910, maxX: 1060 },
        { x: 1540, y: 360, w: 75, h: 14, isCrumbling: true },
        { x: 2140, y: 370, w: 75, h: 14, vx: -70, minX: 2130, maxX: 2270 }
      ],
      coins: [
        { x: 380, y: 300 }, { x: 620, y: 390 }, { x: 740, y: 390 },
        { x: 980, y: 310 }, { x: 1220, y: 390 }, { x: 1350, y: 390 },
        { x: 1580, y: 300 }, { x: 1820, y: 390 }, { x: 1950, y: 390 },
        { x: 2200, y: 310 }, { x: 2450, y: 390 }, { x: 2650, y: 390 }
      ],
      spikes: [
        { x: 650, y: 424, w: 60, h: 16 },
        { x: 1250, y: 424, w: 60, h: 16 },
        { x: 1850, y: 424, w: 60, h: 16 }
      ],
      sawblades: [
        { x: 550, y: 410, radius: 22, dist: 140, speed: 120, axis: "h" },
        { x: 1750, y: 410, radius: 22, dist: 140, speed: 130, axis: "h" }
      ],
      thwomps: [
        { x: 720, y: 160, w: 44, h: 44 },
        { x: 1920, y: 160, w: 44, h: 44 }
      ],
      enemies: [
        { type: "knight", x: 800, y: 400 },
        { type: "cultist", x: 1380, y: 405 },
        { type: "knight", x: 2500, y: 400 }
      ]
    };

    const l19 = {
      id: 19,
      name: "Final Approach",
      world: 5,
      theme: "castle",
      estTime: "5 min",
      desc: "The dread gauntlet. Highly demanding precision jumps and deadly traps.",
      width: 3200,
      height: 540,
      playerStart: { x: 80, y: 380 },
      goal: { x: 3060, y: 360, w: 40, h: 60 },
      checkpoints: [{ x: 1050, y: 380 }, { x: 2150, y: 380 }],
      solids: [
        { x: 0, y: 440, w: 280, h: 100, type: "stone" },
        { x: 480, y: 440, w: 200, h: 100, type: "stone" },
        { x: 980, y: 440, w: 240, h: 100, type: "stone" },
        { x: 1540, y: 440, w: 220, h: 100, type: "stone" },
        { x: 2080, y: 440, w: 240, h: 100, type: "stone" },
        { x: 2640, y: 440, w: 200, h: 100, type: "stone" },
        { x: 2980, y: 440, w: 220, h: 100, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 300, y: 380, w: 75, h: 14, isCrumbling: true },
        { x: 390, y: 350, w: 75, h: 14, vx: 60, minX: 380, maxX: 460 },
        { x: 720, y: 370, w: 75, h: 14, isCrumbling: true },
        { x: 840, y: 340, w: 75, h: 14, isCrumbling: true },
        { x: 1260, y: 370, w: 75, h: 14, vx: 80, minX: 1250, maxX: 1420 },
        { x: 1440, y: 340, w: 75, h: 14, isCrumbling: true },
        { x: 1800, y: 370, w: 75, h: 14, vx: -80, minX: 1780, maxX: 1960 },
        { x: 1980, y: 340, w: 75, h: 14, isCrumbling: true },
        { x: 2360, y: 370, w: 75, h: 14, isCrumbling: true },
        { x: 2480, y: 340, w: 75, h: 14, isCrumbling: true },
        { x: 2860, y: 360, w: 75, h: 14, isCrumbling: true }
      ],
      coins: [
        { x: 340, y: 320 }, { x: 580, y: 390 }, { x: 760, y: 310 },
        { x: 880, y: 280 }, { x: 1100, y: 390 }, { x: 1330, y: 310 },
        { x: 1640, y: 390 }, { x: 1870, y: 310 }, { x: 2180, y: 390 },
        { x: 2420, y: 310 }, { x: 2740, y: 390 }, { x: 2900, y: 300 }
      ],
      spikes: [],
      lava: [
        { x: 280, y: 480, w: 200, h: 60 },
        { x: 680, y: 480, w: 300, h: 60 },
        { x: 1220, y: 480, w: 320, h: 60 },
        { x: 1760, y: 480, w: 320, h: 60 },
        { x: 2320, y: 480, w: 320, h: 60 },
        { x: 2840, y: 480, w: 140, h: 60 }
      ],
      sawblades: [
        { x: 500, y: 410, radius: 22, dist: 120, speed: 140, axis: "h" },
        { x: 1560, y: 410, radius: 22, dist: 120, speed: 150, axis: "h" },
        { x: 2660, y: 410, radius: 22, dist: 120, speed: 160, axis: "h" }
      ],
      thwomps: [
        { x: 1040, y: 160, w: 44, h: 44 },
        { x: 2140, y: 160, w: 44, h: 44 }
      ],
      enemies: [
        { type: "cultist", x: 620, y: 405 },
        { type: "knight", x: 1680, y: 400 },
        { type: "cultist", x: 2760, y: 405 }
      ]
    };

    const l20 = {
      id: 20,
      name: "Final Boss",
      world: 5,
      theme: "boss",
      estTime: "5 min",
      desc: "Face Ignis the Shadow Wyrm in a 4-phase epic clash for the kingdom!",
      width: 1600,
      height: 540,
      playerStart: { x: 120, y: 380 },
      goal: { x: 1500, y: 360, w: 40, h: 60 },
      checkpoints: [],
      solids: [
        { x: 0, y: 440, w: 1600, h: 100, type: "stone" },
        { x: 0, y: 0, w: 60, h: 540, type: "stone" },
        { x: 1540, y: 0, w: 60, h: 540, type: "stone" },
        { x: 260, y: 340, w: 160, h: 20, type: "stone" },
        { x: 1180, y: 340, w: 160, h: 20, type: "stone" },
        { x: 620, y: 260, w: 360, h: 20, type: "stone" }
      ],
      crates: [],
      platforms: [
        { x: 440, y: 320, w: 90, h: 14 },
        { x: 1070, y: 320, w: 90, h: 14 }
      ],
      coins: [
        { x: 330, y: 290 }, { x: 480, y: 270 }, { x: 720, y: 210 },
        { x: 800, y: 210 }, { x: 880, y: 210 }, { x: 1110, y: 270 },
        { x: 1260, y: 290 }
      ],
      spikes: [],
      sawblades: [],
      thwomps: [],
      enemies: [
        { type: "dragon_boss", x: 1150, y: 330 }
      ]
    };

    this.levels = [
      l1, l2, l3, l4, l5, l6, l7, l8, l9, l10,
      l11, l12, l13, l14, l15, l16, l17, l18, l19, l20
    ];
  }

  getLevel(id) {
    return this.levels.find(l => l.id === id) || this.levels[0];
  }
}

window.LevelsData = new LevelDatabase();
