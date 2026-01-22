export interface ParticleInitProps {
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly velocityModifier: number;
  readonly influenceRadius: number;
  readonly strengthFactor: number;
}

export interface ParticleUpdateProps {
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly mouseX: number;
  readonly mouseY: number;
}

export interface ParticleVelocity {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  setVelocity(velocity: ParticleVelocity): void;
  update(props: ParticleUpdateProps): void;
  draw(context: CanvasRenderingContext2D, alpha?: number): void;
}
