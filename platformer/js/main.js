window.addEventListener("DOMContentLoaded", () => {
  const initAudioOnInteraction = () => {
    if (window.AudioManager) {
      window.AudioManager.init();
    }
    window.removeEventListener("click", initAudioOnInteraction);
    window.removeEventListener("keydown", initAudioOnInteraction);
    window.removeEventListener("touchstart", initAudioOnInteraction);
  };

  window.addEventListener("click", initAudioOnInteraction);
  window.addEventListener("keydown", initAudioOnInteraction);
  window.addEventListener("touchstart", initAudioOnInteraction);

  if (window.GameEngine) {
    window.GameEngine.start();
  }

  const params = new URLSearchParams(window.location.search);
  const lvlParam = params.get("level");
  const screenParam = params.get("screen");
  const hash = window.location.hash;

  if (lvlParam && window.GameEngine) {
    window.GameEngine.startLevel(parseInt(lvlParam) || 1);
  } else if ((screenParam === "level-select" || hash === "#level-select") && window.UIManager) {
    window.UIManager.showLevelSelect();
  } else if (hash.startsWith("#play-") && window.GameEngine) {
    const lvlId = parseInt(hash.replace("#play-", "")) || 1;
    window.GameEngine.startLevel(lvlId);
  } else if (window.UIManager) {
    window.UIManager.showMainMenu();
  }
});
