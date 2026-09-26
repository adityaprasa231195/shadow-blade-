Build the complete 2D side-scrolling platformer game from scratch.

REFERENCE IMAGE:
`D:\webdev\image.png`

First inspect this image carefully and use it as the primary visual and UI/UX reference.

Also use the design and gameplay feel of polished 2D platformers such as:

- Super Mario Bros.
- Super Mario World
- Celeste
- Hollow Knight
- Ori and the Blind Forest
- Rayman Legends
- Shovel Knight

Use these only as references for game feel, physics, level design, UI structure, responsiveness, and readability.

Do NOT copy their copyrighted assets, characters, levels, sounds, artwork, or branding.

## 1. TECHNOLOGY

Build everything using:

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Canvas
- Web Audio API
- localStorage

Use ES6 modules where useful.

Do NOT use:

- React
- Vue
- Angular
- Node.js
- Backend
- Database
- External APIs
- Login/signup
- Accounts
- Global leaderboard

The entire game must run locally in the browser.

## 2. GAME

Create a complete playable 2D side-scrolling platformer with exactly:

**20 levels**

The game should feel like a real small indie platformer rather than a website containing a game.

Each level should approximately take:

- Early levels: 2–3 minutes
- Middle levels: 3–4 minutes
- Later levels: 4–5 minutes

These are design targets only. Do NOT add a forced countdown timer.

Difficulty must progressively increase.

## 3. MAIN MENU

Create:

- Game title
- Play
- Level Select
- How to Play
- Settings

The menu should be simple and polished.

Avoid:

- AI-dashboard appearance
- Excessive cards
- Excessive glassmorphism
- Neon UI
- Excessive gradients
- Huge glowing borders
- Unnecessary decorative elements

Use the reference image as the visual direction.

## 4. LEVEL SELECT

Create a proper platformer-style level selection screen.

Display all 20 levels.

Include:

- Locked/unlocked states
- Completed states
- Stars
- Current progression
- Best score

Make it feel like a game-world progression/map rather than a web dashboard.

## 5. LEVEL THEMES

Levels 1–4:
Grassland

Levels 5–8:
Forest

Levels 9–12:
Desert / Ancient Ruins

Levels 13–16:
Ice / Volcanic

Levels 17–19:
Dark Castle

Level 20:
Final Boss Arena

Each environment should have distinct visual identity while maintaining the same overall game style.

## 6. PLAYER

Implement:

- Left/right movement
- Jump
- Gravity
- Acceleration
- Deceleration
- Maximum speed
- Air control
- Ground detection
- Collision
- Knockback
- Damage
- Health
- Death
- Respawn
- Checkpoints

Controls:

A / Left Arrow = Move Left

D / Right Arrow = Move Right

W / Up / Space = Jump

ESC = Pause

## 7. PLAYER PHYSICS

The player must feel responsive like a polished platformer.

Implement:

- Smooth acceleration
- Responsive deceleration
- Predictable gravity
- Consistent jump arc
- Strong but controllable jump
- Ground friction
- Air control
- Reliable collision resolution
- Reliable landing detection

Avoid floaty movement.

Use frame-rate-independent physics.

Consider implementing:

- Coyote time
- Jump buffering

These should improve responsiveness without being visually obvious.

## 8. CAMERA

Implement a smooth side-scrolling camera.

The camera should:

- Follow the player smoothly
- Keep the player comfortably positioned
- Look slightly ahead in the movement direction
- Avoid sudden snapping
- Avoid excessive camera shake
- Avoid revealing too much of the level

Use camera smoothing.

## 9. LEVEL 1–4

Grassland.

Introduce the mechanics gradually:

- Basic platforms
- Small gaps
- Coins
- Simple hazards
- Spikes
- Basic enemies

Enemies must already actively try to kill the player from Level 1.

They should not simply walk left and right passively.

## 10. LEVEL 5–8

Forest.

Increase difficulty with:

- Larger gaps
- Moving platforms
- Falling platforms
- Spikes
- Flying enemies
- Faster enemies
- Chasing enemies

## 11. LEVEL 9–12

Desert / Ancient Ruins.

Introduce:

- Vertical sections
- Faster enemies
- Ranged enemies
- Heavy enemies
- More complex platform layouts
- Multiple enemy types
- More demanding jumps

## 12. LEVEL 13–16

Ice / Volcanic.

Introduce:

- Slippery surfaces
- Lava
- Fire
- Narrow platforms
- Fast enemies
- Advanced enemy combinations
- Difficult moving platforms

Levels 15–16 should have a noticeable difficulty jump.

## 13. LEVEL 17–19

Dark Castle.

These are the hardest normal levels.

Combine:

- Complex platforming
- Spikes
- Moving platforms
- Environmental hazards
- Fast enemies
- Flying enemies
- Ranged attacks
- Multiple simultaneous enemies
- Ambush-style enemy placement
- Difficult platform combinations

Level 19 should be extremely difficult but fair.

The player should be able to learn the patterns and improve.

## 14. LEVEL 20 — FINAL BOSS

Create a large final boss.

The boss should feel almost impossible but remain technically beatable.

Use multiple phases.

Phase 1:
- Basic attacks
- Movement
- Melee attacks

Phase 2:
- Faster movement
- Projectiles
- Dash attacks

Phase 3:
- Area attacks
- Summoned enemies
- Multiple attack patterns

Phase 4:
- Maximum aggression
- Fast attacks
- Complex combinations
- Short vulnerability windows

Every attack must have a readable warning or telegraph.

There must be no unavoidable damage.

The boss should require learning patterns and precise timing.

## 15. ENEMIES

Create different enemy behaviors:

- Basic melee
- Fast melee
- Flying
- Ranged
- Heavy
- Chasing
- Boss

Do not make enemies different only by changing health.

Give each type genuinely different behavior.

## 16. ENEMY AI

Enemies must actively attempt to kill the player.

They can:

- Detect the player
- Chase
- Attack
- Reposition
- Change direction
- React to player movement
- Use ranged attacks
- Predict basic player movement
- Guard areas
- Coordinate positioning

Enemy AI should become increasingly aggressive from Level 1 through Level 20.

Major difficulty increase begins around Level 15.

## 17. ATTACKS

Support:

- Contact damage
- Melee attacks
- Charges
- Jump attacks
- Projectiles
- Area attacks
- Dash attacks

Dangerous attacks should have visual anticipation so the player can react.

## 18. PLATFORM COLLISION

Make collision reliable.

The player must:

- Land correctly
- Never randomly fall through platforms
- Collide correctly from sides
- Interact correctly with moving platforms
- Remain stable on narrow platforms

Moving platforms should carry the player naturally.

## 19. GAME FEEL

Add subtle professional feedback:

- Jump feedback
- Landing feedback
- Damage flash
- Knockback
- Enemy hit feedback
- Coin pickup feedback
- Checkpoint activation
- Enemy defeat feedback
- Level completion feedback

Use subtle effects.

Do not turn the game into a neon effects showcase.

## 20. COINS

Coins should:

- Be collectible
- Increase score
- Play a sound
- Have visual feedback

## 21. SCORE

Use:

Coin = +100

Enemy defeated = +250

Checkpoint = +50

Level completion = +1000

Do not force time-based scoring.

## 22. STARS

Each level has 3 possible stars.

Example:

Star 1:
Complete the level

Star 2:
Collect most/all coins

Star 3:
Complete a special challenge

Possible special challenges:

- Defeat specific enemies
- Find hidden item
- Complete without taking damage

Do not require a timer.

## 23. CHECKPOINTS

Add checkpoints throughout longer levels.

When activated:

- Save checkpoint position
- Play sound
- Show visual activation
- Respawn player there after death

Checkpoints should reduce frustration without making the game too easy.

## 24. HEALTH / DEATH

Implement:

- Health
- Damage
- Invulnerability frames
- Knockback
- Death animation/effect
- Respawn
- Checkpoint respawn

Make damage readable and fair.

## 25. HUD

Keep the gameplay HUD minimal.

Show:

- Health
- Coins
- Score
- Level
- Optional checkpoint indicator

Do not cover gameplay with large UI panels.

## 26. PAUSE

ESC should pause the game.

Pause menu:

- Resume
- Restart Level
- Settings
- Level Select
- Main Menu

## 27. SETTINGS

Include:

- Music on/off
- Sound effects on/off
- Volume
- Controls
- Reset Progress

Save settings using localStorage.

## 28. AUDIO

Use the Web Audio API so the game does not depend on external audio downloads.

Create simple original/generated sounds for:

- Jump
- Coin
- Damage
- Enemy hit
- Enemy defeat
- Checkpoint
- Button interaction
- Level completion
- Boss attacks
- Boss phase changes

Do not download or use copyrighted sounds from commercial games.

## 29. SAVE SYSTEM

Use localStorage to save:

- Unlocked levels
- Completed levels
- Stars
- Best scores
- Coins
- Settings

Add a Reset Progress option.

No server is required.

## 30. VISUAL DESIGN

Use the image at:

`D:\webdev\image.png`

as the primary visual reference.

The final UI should feel:

- Cohesive
- Minimal
- Game-focused
- Professional
- Readable
- Human-designed
- Indie-game-like

Avoid the typical AI-generated UI appearance.

Do not use excessive:

- Glassmorphism
- Gradients
- Glow
- Rounded cards
- Shadows
- Dashboard layouts
- Floating panels

## 31. RESPONSIVE DESIGN

Support:

- 1920×1080
- 1600×900
- 1366×768
- Laptop displays
- Smaller screens
- Touch devices where practical

Do not simply shrink everything.

Adapt the UI appropriately.

## 32. PERFORMANCE

Target approximately 60 FPS.

Use:

- requestAnimationFrame
- Efficient collision detection
- Efficient enemy updates
- Canvas rendering
- Object reuse where useful
- Minimal unnecessary DOM manipulation

Avoid memory leaks.

## 33. PROJECT STRUCTURE

Use a clean structure such as:

platformer/
├── index.html
├── css/
│   ├── main.css
│   ├── menu.css
│   └── game.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── player.js
│   ├── enemy.js
│   ├── physics.js
│   ├── collision.js
│   ├── camera.js
│   ├── level.js
│   ├── levels.js
│   ├── audio.js
│   ├── save.js
│   └── ui.js
└── assets/

Organize the code into reusable systems rather than putting the entire game into one huge JavaScript file.

## 34. DEVELOPMENT PROCESS

Build the game systematically.

First create:

1. Core HTML/CSS
2. Canvas
3. Game loop
4. Player
5. Physics
6. Collision
7. Camera
8. Platforms
9. Enemies
10. Level system
11. Checkpoints
12. Coins
13. Score
14. UI
15. Audio
16. Save system
17. Level Select
18. All 20 levels
19. Final boss
20. Polish and optimization

After each major system, test it before continuing.

Do not create fake buttons or placeholder gameplay and call the project complete.

The final result must be an actually playable game.

## 35. FINAL QUALITY REQUIREMENT

Before considering the project finished, test:

- Player movement
- Jumping
- Gravity
- Collision
- Camera
- Enemy AI
- Enemy attacks
- Damage
- Death
- Respawn
- Checkpoints
- Coins
- Score
- Level completion
- Level unlocking
- Stars
- Pause
- Settings
- Save/load
- Level transitions
- Boss phases
- Game completion
- Responsive UI
- Performance

Fix any broken behavior you find.

CRITICAL:

**Do not add comments anywhere in HTML, CSS, or JavaScript. The entire codebase must contain ZERO code comments.**

Build a complete, polished, playable 20-level game — not a mockup, prototype screen, or UI demo.