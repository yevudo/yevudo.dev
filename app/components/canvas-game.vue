<script setup lang="ts">
  import type { MousePosition } from '~/types/mouse-position';
  import type { Particle } from '~/types/particle';
  import { CANVAS_GAME_CONFIG } from '~/utils/canvas-game/canvas-game-config';
  import { ParticleImpl } from '~/utils/canvas-game/particle-impl';
  import { CanvasGameStatus } from '~/utils/enums/canvas-game-status';

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  const resizeCanvas = () => {
    const el = canvas;
    const dpr = window.devicePixelRatio || 1;
    el.width = Math.floor(el.clientWidth * dpr);
    el.height = Math.floor(el.clientHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  let particles: Particle[] = [];
  const createParticles = () => {
    particles = [];
    for (let i = 0; i < CANVAS_GAME_CONFIG.particlesCount; i++) {
      particles.push(
        new ParticleImpl({
          clientWidth: canvas.clientWidth,
          clientHeight: canvas.clientHeight,
          velocityModifier: CANVAS_GAME_CONFIG.particle.velocityModifier,
          influenceRadius: CANVAS_GAME_CONFIG.particle.influenceRadius,
          strengthFactor: CANVAS_GAME_CONFIG.particle.strengthFactor,
        })
      );
    }
  };

  let cachedCanvasRect: DOMRect | null = null;
  const spatialGrid = new Map<string, Particle[]>();

  let resizeTimer: number | null = null;
  const onScreenResize = () => {
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      resizeCanvas();
      createParticles();
      cachedCanvasRect = canvas.getBoundingClientRect();
      resizeTimer = null;
    }, CANVAS_GAME_CONFIG.resizeDebounce);
  };

  const mousePosition: MousePosition = {
    x: 0,
    y: 0,
  };

  const onMouseMove = (e: MouseEvent) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  };

  const canvasGameStore = useCanvasGameStore();
  const { onGameStart, onAllCollected } = canvasGameStore;
  const { status } = storeToRefs(canvasGameStore);

  const hoverCount = ref(0);
  let requestAnimationFrameID: number | null = null;

  const getCollectedCount = (mousePosition: MousePosition): number => {
    /**
     * Simple grid spatial-partition for near-neighbor queries
     * detect clusters collected by the cursor (blobbing)
     */
    const { cursorCollectRadiusPx } = CANVAS_GAME_CONFIG;
    const cellSize = Math.max(1, cursorCollectRadiusPx);
    // Clear and reuse the spatial grid instead of creating a new Map
    spatialGrid.clear();
    for (const particle of particles) {
      const cellColumnNumberX = Math.floor(particle.x / cellSize);
      const cellColumnNumberY = Math.floor(particle.y / cellSize);
      const key = `${cellColumnNumberX},${cellColumnNumberY}`;
      const array = spatialGrid.get(key);
      if (array) {
        array.push(particle);
      } else {
        spatialGrid.set(key, [particle]);
      }
    }

    // Use cached rect instead of calling getBoundingClientRect every frame
    if (!cachedCanvasRect) {
      cachedCanvasRect = canvas.getBoundingClientRect();
    }
    const mousePosXInCanvas = mousePosition.x - cachedCanvasRect.left;
    const mousePosYInCanvas = mousePosition.y - cachedCanvasRect.top;
    const mouseCellX = Math.floor(mousePosXInCanvas / cellSize);
    const mouseCellY = Math.floor(mousePosYInCanvas / cellSize);

    const radiusSquared = cursorCollectRadiusPx * cursorCollectRadiusPx;
    let count = 0;
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        const key = `${mouseCellX + offsetX},${mouseCellY + offsetY}`;
        const cell = spatialGrid.get(key);
        if (!cell) {
          continue;
        }
        for (const particle of cell) {
          const distanceX = particle.x - mousePosXInCanvas;
          const distanceY = particle.y - mousePosYInCanvas;
          if (distanceX * distanceX + distanceY * distanceY < radiusSquared) {
            count++;
          }
        }
      }
    }
    return count;
  };

  const animate = () => {
    const { clientWidth, clientHeight } = canvas;
    context.clearRect(0, 0, clientWidth, clientHeight);
    for (const p of particles) {
      p.update({
        clientWidth,
        clientHeight,
        mouseX:
          status.value === CanvasGameStatus.ALL_COLLECTED
            ? -9999
            : mousePosition.x,
        mouseY:
          status.value === CanvasGameStatus.ALL_COLLECTED
            ? -9999
            : mousePosition.y,
      });
      p.draw(
        context,
        status.value === CanvasGameStatus.STARTED ? 0.6 : undefined
      );
    }
    if (status.value === CanvasGameStatus.COMPLETED) {
      context.clearRect(0, 0, clientWidth, clientHeight);
      cancelAnimationFrame(requestAnimationFrameID!);
      return;
    }
    if (status.value === CanvasGameStatus.ALL_COLLECTED) {
      requestAnimationFrameID = requestAnimationFrame(animate);
      return;
    }

    const collectedCount = getCollectedCount(mousePosition);
    hoverCount.value = collectedCount;
    if (
      status.value === CanvasGameStatus.IDLE &&
      collectedCount >= CANVAS_GAME_CONFIG.showCounterThreshold
    ) {
      onGameStart();
    }
    if (collectedCount === CANVAS_GAME_CONFIG.particlesCount) {
      onAllCollected();
    }
    requestAnimationFrameID = requestAnimationFrame(animate);
  };

  const checkCanInit = (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    const isReducedMotion =
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      return false;
    }
    if (window.innerWidth < CANVAS_GAME_CONFIG.minScreenWidth) {
      return false;
    }
    return true;
  };

  const init = () => {
    const canvasEl = document.getElementById(
      CANVAS_GAME_CONFIG.canvasID
    ) as HTMLCanvasElement | null;
    if (!canvasEl) {
      return;
    }
    canvas = canvasEl;
    const canvasContext = canvasEl.getContext('2d');
    if (!canvasContext) {
      return;
    }
    context = canvasContext;
    context.globalCompositeOperation = 'lighter';
    resizeCanvas();
    createParticles();
    cachedCanvasRect = canvas.getBoundingClientRect();
    requestAnimationFrameID = requestAnimationFrame(animate);

    window.addEventListener('resize', onScreenResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  };

  watch(
    () => status.value,
    (newStatus) => {
      if (newStatus === CanvasGameStatus.COMPLETED) {
        particles = [];
      }
    }
  );

  onMounted(() => {
    const canInit = checkCanInit();
    if (!canInit) {
      return;
    }
    init();
  });

  onUnmounted(() => {
    if (requestAnimationFrameID) {
      cancelAnimationFrame(requestAnimationFrameID);
    }
    window.removeEventListener('resize', onScreenResize);
    window.removeEventListener('mousemove', onMouseMove);
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
  });
</script>

<template>
  <div class="pointer-events-none fixed inset-0 hidden lg:block">
    <canvas
      :id="CANVAS_GAME_CONFIG.canvasID"
      class="absolute inset-0 block h-full w-full"
      :class="{
        'blur-md': status !== CanvasGameStatus.STARTED,
        'blur-xs': status === CanvasGameStatus.STARTED,
      }"
      aria-hidden="true"
    ></canvas>
  </div>
  <div
    v-if="
      status === CanvasGameStatus.STARTED ||
      status === CanvasGameStatus.ALL_COLLECTED
    "
    class="pointer-events-none fixed right-4 bottom-4 z-1200 rounded-md bg-yellow-400 px-3 py-2 text-[13px] text-black shadow-sm backdrop-blur-sm"
    aria-hidden="true"
  >
    <div>
      {{ $t('canvas.game.collected') }} {{ hoverCount }} /
      {{ CANVAS_GAME_CONFIG.particlesCount }}
    </div>
  </div>
  <LeaderBoard />
</template>
