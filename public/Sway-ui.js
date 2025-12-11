export function initSwayUI() {
  const swayLine = document.getElementById("sway-line");
  const glowOrb = document.getElementById("glow-orb");
  const slider = document.getElementById("wind-slider");
  const todayLabel = document.getElementById("today-label");

  if (!swayLine || !glowOrb || !slider) return;

  const todayKey = new Date().toISOString().slice(0, 10);
  const STORAGE_KEY = "sway-wind:" + todayKey;

  function applyWind(value) {
    const numeric = Number(value || 0);
    const normalized = Math.max(-100, Math.min(100, numeric));

    const angle = 4 + Math.abs(normalized) * 0.14;
    const signedAngle = normalized >= 0 ? angle : -angle;
    document.documentElement.style.setProperty("--sway-angle", signedAngle.toFixed(2) + "deg");

    const maxShift = 70;
    const shift = (normalized / 100) * maxShift;
    glowOrb.style.transform = `translateX(${shift.toFixed(1)}px)`;

    const label = normalized === 0 ? "Still" : normalized > 0 ? "Wild" : "Soft";
    todayLabel.textContent = "Today · " + label;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    slider.value = stored;
    applyWind(stored);
  } else {
    applyWind(slider.value);
  }

  slider.addEventListener("input", (event) => {
    const value = event.target.value;
    applyWind(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch (err) {
      console.error("Failed to save wind state", err);
    }
  });

  ["click", "touchend"].forEach((eventName) => {
    swayLine.addEventListener(eventName, () => {
      const current = Number(slider.value || 0);
      let next = current;
      if (current === 0) {
        next = 40;
      } else if (current > 0) {
        next = -40;
      } else {
        next = 0;
      }
      slider.value = String(next);
      applyWind(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch (err) {
        console.error("Failed to save wind state", err);
      }
    });
  });
}
