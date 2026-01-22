export const CANVAS_GAME_CONFIG = {
  canvasID: 'canvas-game',
  particlesCount: 20,
  minScreenWidth: 800,
  /** how close to the cursor to trigger collection */
  cursorCollectRadiusPx: 24,
  particle: {
    influenceRadius: 160,
    velocityModifier: 100.0,
    strengthFactor: 0.0018,
  },
  /** when to show the small counter */
  showCounterThreshold: 5,
  /** debounce delay for resize handler (ms) */
  resizeDebounce: 150,
} as const;
