import type { Particle } from '~/types/particle';
import type { ParticleVelocity } from '~/types/particle';
import type { ParticleInitProps } from '~/types/particle';
import type { ParticleUpdateProps } from '~/types/particle';

export class ParticleImpl implements Particle {
  private readonly velocityModifier: number;
  private readonly influenceRadius: number;
  private readonly strengthFactor: number;
  // slow autonomous drift when not under mouse influence
  private driftPhase: number;
  private driftAmplitude: number;
  private driftSpeed: number;
  private readonly radius = 12 + Math.random() * 24;
  private hue = 190 + Math.random() * 120;
  public x: number;
  public y: number;
  private readonly velocity: ParticleVelocity;

  constructor(props: ParticleInitProps) {
    this.velocityModifier = props.velocityModifier;
    this.influenceRadius = props.influenceRadius;
    this.strengthFactor = props.strengthFactor;
    this.x = Math.random() * props.clientWidth;
    this.y = Math.random() * props.clientHeight;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
    };
    this.driftPhase = Math.random() * Math.PI * 2;
    this.driftAmplitude = 0.004 + Math.random() * 0.004;
    this.driftSpeed = 0.002 + Math.random() * 0.004;
    this.reset(props.clientWidth, props.clientHeight);
  }

  reset(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    const velocityBase = (Math.random() - 0.5) * 0.03 * this.velocityModifier;
    this.velocity.x = velocityBase;
    this.velocity.y = velocityBase;
  }

  update(props: ParticleUpdateProps) {
    // gentle drift
    this.velocity.x = this.velocity.x * 0.98;
    this.velocity.y = this.velocity.y * 0.98;

    // attraction only when particle is reasonably close to mouse
    const dx = props.mouseX - this.x;
    const dy = props.mouseY - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    const isInfluenced = dist < this.influenceRadius;

    // apply slow autonomous spatial drift when NOT influenced by the cursor
    if (!isInfluenced) {
      const driftX = Math.cos(this.driftPhase) * this.driftAmplitude;
      const driftY = Math.sin(this.driftPhase) * this.driftAmplitude;
      this.driftPhase += this.driftSpeed;
      this.velocity.x = this.velocity.x + driftX;
      this.velocity.y = this.velocity.y + driftY;
    }

    if (isInfluenced) {
      const strength =
        (1 - dist / this.influenceRadius) *
        this.strengthFactor *
        this.velocityModifier; // scaled by particle speed
      this.velocity.x = this.velocity.x + (dx / dist) * strength;
      this.velocity.y = this.velocity.y + (dy / dist) * strength;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    // bounce off edges
    if (this.x < 0) {
      this.x = 0;
      this.velocity.x = -this.velocity.x;
    } else if (this.x > props.clientWidth) {
      this.x = props.clientWidth;
      this.velocity.x = -this.velocity.x;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity.y = -this.velocity.y;
    } else if (this.y > props.clientHeight) {
      this.y = props.clientHeight;
      this.velocity.y = -this.velocity.y;
    }
  }

  setVelocity(velocity: ParticleVelocity): void {
    this.velocity.x = velocity.x;
    this.velocity.y = velocity.y;
  }

  draw(context: CanvasRenderingContext2D, alpha = 0.3) {
    context.save();
    const fill = `hsla(${this.hue}, 80%, 60%, ${alpha})`;
    context.fillStyle = fill;
    // soft canvas-side blur (will not affect page-level CSS; user can still add filter: blur externally)
    context.shadowBlur = Math.max(2, this.radius * 0.6);
    context.shadowColor = fill;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}
