import { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "./GameContext";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const GAME_DURATION = 90; // seconds
const SHIP_RADIUS = 22; // px – collision
const BUG_COLLECT_RADIUS_FACTOR = 0.68;
const KEYWORD_COLLECT_BUFFER = 14; // extra px on keyword radius
const BASE_KW_SPEED = 115; // px / s
const BASE_BUG_SPEED = 145; // px / s
const TRAIL_LENGTH = 24;

const TECH_KEYWORDS = [
  "React",
  "Node.js",
  "TypeScript",
  "MySQL",
  "WPF/.NET",
  "DirectX",
  "Redux",
  "Express",
  "Tailwind",
  "C#",
  "MVVM",
  "SQLite",
  "Sequelize",
  "REST API",
  "PWA",
  "Vite",
  "Git",
  "HelixToolkit",
  "MSAL Auth",
  "QuestPDF",
];

const BUG_LABELS = [
  "NullRefError",
  "StackOverflow",
  "404 Error",
  "TypeError",
  "Deadlock",
  "Memory Leak",
  "CORS Block",
  "Undefined",
];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type GamePhase = "countdown" | "playing" | "gameover";

interface Keyword {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  w: number;
  collected: boolean;
  floatUp: number; // offset applied when collected (fades out floating up)
  alpha: number;
}

interface Bug {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rot: number;
  rotSpeed: number;
  label: string;
}

interface Popup {
  id: number;
  x: number;
  y: number;
  text: string;
  life: number; // 0→1, counts down
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

interface TrailPt {
  x: number;
  y: number;
}

interface GameData {
  ship: { x: number; y: number; angle: number };
  keywords: Keyword[];
  bugs: Bug[];
  trail: TrailPt[];
  popups: Popup[];
  stars: Star[];
  score: number;
  lives: number;
  combo: number;
  stack: string[];
  time: number;
  hitFlash: number; // 0–1, decays to 0
  lastKwSpawn: number; // timestamp
  lastBugSpawn: number;
  nextId: number;
  lastTs: number;
}

interface FinalStats {
  score: number;
  stack: string[];
  highScore: number;
  survived: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: geometry
// ─────────────────────────────────────────────────────────────────────────────

function lerpAngle(cur: number, tgt: number, t: number): number {
  let d = tgt - cur;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return cur + d * t;
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx,
    dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: spawn
// ─────────────────────────────────────────────────────────────────────────────

function generateStars(W: number, H: number): Star[] {
  return Array.from({ length: 160 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 1.6 + 0.4,
    alpha: Math.random() * 0.55 + 0.15,
  }));
}

function spawnKeyword(g: GameData, W: number, H: number): void {
  const text = TECH_KEYWORDS[Math.floor(Math.random() * TECH_KEYWORDS.length)];
  const w = text.length * 9 + 28;
  g.keywords.push({
    id: g.nextId++,
    text,
    x: W + w / 2 + 20,
    y: 90 + Math.random() * (H - 180),
    speed: BASE_KW_SPEED + Math.random() * 55,
    w,
    collected: false,
    floatUp: 0,
    alpha: 1,
  });
}

function spawnBug(g: GameData, W: number, H: number, diff: number): void {
  g.bugs.push({
    id: g.nextId++,
    x: W + 60,
    y: 90 + Math.random() * (H - 180),
    speed: BASE_BUG_SPEED + Math.random() * 60 * diff,
    size: 20 + Math.random() * 12,
    rot: 0,
    rotSpeed: 1.4 + Math.random() * 2.2,
    label: BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: 2-D drawing
// ─────────────────────────────────────────────────────────────────────────────

function drawBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  stars: Star[],
  hitFlash: number,
): void {
  // Space gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#010b1a");
  grad.addColorStop(1, "#020617");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Stars
  stars.forEach((s) => {
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Subtle nebula vignette
  const nb = ctx.createRadialGradient(
    W * 0.3,
    H * 0.4,
    0,
    W * 0.3,
    H * 0.4,
    W * 0.55,
  );
  nb.addColorStop(0, "rgba(251,191,36,0.03)");
  nb.addColorStop(1, "transparent");
  ctx.fillStyle = nb;
  ctx.fillRect(0, 0, W, H);

  // Hit flash
  if (hitFlash > 0) {
    ctx.fillStyle = `rgba(248,113,113,${hitFlash * 0.28})`;
    ctx.fillRect(0, 0, W, H);
    // Red border pulse
    ctx.strokeStyle = `rgba(248,113,113,${hitFlash * 0.7})`;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, W - 8, H - 8);
  }
}

function drawTrail(ctx: CanvasRenderingContext2D, trail: TrailPt[]): void {
  trail.forEach((pt, i) => {
    const frac = 1 - i / trail.length;
    const alpha = frac * 0.55;
    const size = frac * 5;
    ctx.save();
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#22d3ee";
    ctx.fillStyle = `rgba(34,211,238,${alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y + 17, size, 0, Math.PI * 2); // +17 = engine offset
    ctx.fill();
    ctx.restore();
  });
}

function drawShip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Engine core glow
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#22d3ee";
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.arc(0, 18, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Engine outer halo
  ctx.shadowBlur = 4;
  ctx.strokeStyle = "rgba(34,211,238,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 18, 10, 0, Math.PI * 2);
  ctx.stroke();

  // Fuselage
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#fbbf24";
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -22); // nose
  ctx.lineTo(10, 15); // bottom-right
  ctx.lineTo(0, 9); // centre notch
  ctx.lineTo(-10, 15); // bottom-left
  ctx.closePath();
  ctx.stroke();

  // Nose accent
  ctx.fillStyle = "#fde68a";
  ctx.beginPath();
  ctx.arc(0, -22, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Left wing
  ctx.shadowColor = "#d97706";
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-10, 6);
  ctx.lineTo(-24, 22);
  ctx.lineTo(-12, 13);
  ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(10, 6);
  ctx.lineTo(24, 22);
  ctx.lineTo(12, 13);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawKeyword(ctx: CanvasRenderingContext2D, kw: Keyword): void {
  if (kw.alpha <= 0) return;
  const h = 34,
    r = 12;
  const rx = kw.x - kw.w / 2;
  const ry = kw.y - h / 2 - kw.floatUp;

  ctx.save();
  ctx.globalAlpha = kw.alpha;
  ctx.shadowBlur = kw.collected ? 0 : 10;
  ctx.shadowColor = "#fbbf24";
  ctx.strokeStyle = "#fbbf24";
  ctx.fillStyle = "rgba(251,191,36,0.10)";
  ctx.lineWidth = 1.5;

  // Rounded rect
  ctx.beginPath();
  ctx.moveTo(rx + r, ry);
  ctx.arcTo(rx + kw.w, ry, rx + kw.w, ry + h, r);
  ctx.arcTo(rx + kw.w, ry + h, rx, ry + h, r);
  ctx.arcTo(rx, ry + h, rx, ry, r);
  ctx.arcTo(rx, ry, rx + kw.w, ry, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Label
  ctx.shadowBlur = 0;
  ctx.fillStyle = kw.collected ? "#34d399" : "#fde68a";
  ctx.font = 'bold 13px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(kw.text, kw.x, kw.y - kw.floatUp);
  ctx.restore();
}

function drawBug(ctx: CanvasRenderingContext2D, bug: Bug): void {
  ctx.save();
  ctx.translate(bug.x, bug.y);
  ctx.rotate(bug.rot);

  const N = 6,
    outerR = bug.size,
    innerR = bug.size * 0.42;

  ctx.shadowBlur = 14;
  ctx.shadowColor = "#f87171";
  ctx.strokeStyle = "#f87171";
  ctx.lineWidth = 1.6;

  // 6-pointed star
  ctx.beginPath();
  for (let i = 0; i < N * 2; i++) {
    const ang = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? outerR : innerR;
    const px = Math.cos(ang) * rr,
      py = Math.sin(ang) * rr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Core dot
  ctx.fillStyle = "#f87171";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.restore();

  // Label below bug (non-rotated)
  ctx.fillStyle = "rgba(248,113,113,0.7)";
  ctx.font = '10px "Space Grotesk", system-ui';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(bug.label, bug.x, bug.y + bug.size + 4);
}

function drawPopup(ctx: CanvasRenderingContext2D, p: Popup): void {
  ctx.save();
  ctx.globalAlpha = p.life;
  ctx.shadowBlur = 10;
  ctx.shadowColor = p.color;
  ctx.fillStyle = p.color;
  ctx.font = 'bold 17px "Space Grotesk", system-ui';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.text, p.x, p.y);
  ctx.shadowBlur = 0;
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure update function (no React – called every rAF)
// ─────────────────────────────────────────────────────────────────────────────

function updateGame(
  g: GameData,
  dt: number,
  ts: number,
  W: number,
  H: number,
  mouseX: number,
  mouseY: number,
): "playing" | "gameover" {
  // ── Ship ──────────────────────────────────────────────────────────────────
  const prevX = g.ship.x;
  const prevY = g.ship.y;
  g.ship.x += (mouseX - g.ship.x) * 0.11;
  g.ship.y += (mouseY - g.ship.y) * 0.11;

  const vx = g.ship.x - prevX;
  const vy = g.ship.y - prevY;
  if (Math.abs(vx) + Math.abs(vy) > 0.5) {
    const targetAngle = Math.atan2(vx, -vy);
    g.ship.angle = lerpAngle(g.ship.angle, targetAngle, 0.11);
  }

  // ── Trail ─────────────────────────────────────────────────────────────────
  g.trail.unshift({ x: g.ship.x, y: g.ship.y });
  if (g.trail.length > TRAIL_LENGTH) g.trail.pop();

  // ── Timer ─────────────────────────────────────────────────────────────────
  g.time -= dt;
  if (g.time <= 0) {
    g.time = 0;
    return "gameover";
  }

  // ── Difficulty ────────────────────────────────────────────────────────────
  const elapsed = GAME_DURATION - g.time;
  const diff = 1 + (elapsed / GAME_DURATION) * 1.9;

  // ── Spawn ─────────────────────────────────────────────────────────────────
  const kwInterval = 1700 / diff;
  const bgInterval = 3200 / diff;

  if (ts - g.lastKwSpawn > kwInterval) {
    spawnKeyword(g, W, H);
    g.lastKwSpawn = ts;
  }
  if (ts - g.lastBugSpawn > bgInterval) {
    spawnBug(g, W, H, diff);
    g.lastBugSpawn = ts;
  }

  // ── Move keywords ─────────────────────────────────────────────────────────
  g.keywords.forEach((kw) => {
    if (!kw.collected) {
      kw.x -= kw.speed * dt * diff;
    } else {
      kw.floatUp += 55 * dt;
      kw.alpha = Math.max(0, kw.alpha - dt * 3.2);
    }
  });
  g.keywords = g.keywords.filter(
    (kw) => kw.x > -300 && (kw.alpha > 0 || !kw.collected),
  );

  // ── Move bugs ─────────────────────────────────────────────────────────────
  g.bugs.forEach((bug) => {
    bug.x -= bug.speed * dt * diff;
    bug.rot += bug.rotSpeed * dt;
  });
  g.bugs = g.bugs.filter((b) => b.x > -120);

  // ── Move popups ───────────────────────────────────────────────────────────
  g.popups.forEach((p) => {
    p.y -= 48 * dt;
    p.life -= dt * 2.0;
  });
  g.popups = g.popups.filter((p) => p.life > 0);

  // ── Hit flash decay ───────────────────────────────────────────────────────
  g.hitFlash = Math.max(0, g.hitFlash - dt * 3.5);

  // ── Collisions: keywords ──────────────────────────────────────────────────
  g.keywords.forEach((kw) => {
    if (kw.collected) return;
    const d = dist(g.ship.x, g.ship.y, kw.x, kw.y);
    if (d < SHIP_RADIUS + kw.w / 2 + KEYWORD_COLLECT_BUFFER) {
      kw.collected = true;
      const pts = 10 * g.combo;
      g.score += pts;
      g.combo = Math.min(g.combo + 1, 10);
      g.stack.push(kw.text);
      g.popups.push({
        id: g.nextId++,
        x: kw.x,
        y: kw.y - 18,
        text: `+${pts}${g.combo > 2 ? ` ×${g.combo}` : ""}`,
        life: 1.0,
        color: "#fde68a",
      });
    }
  });

  // ── Collisions: bugs ──────────────────────────────────────────────────────
  for (const bug of g.bugs) {
    const d = dist(g.ship.x, g.ship.y, bug.x, bug.y);
    if (d < SHIP_RADIUS + bug.size * BUG_COLLECT_RADIUS_FACTOR) {
      bug.x = -600; // teleport away
      g.lives -= 1;
      g.combo = 1;
      g.hitFlash = 1.0;
      g.popups.push({
        id: g.nextId++,
        x: g.ship.x,
        y: g.ship.y - 32,
        text: "💥 BUG HIT!",
        life: 1.2,
        color: "#f87171",
      });
      if (g.lives <= 0) {
        g.lives = 0;
        return "gameover";
      }
    }
  }

  return "playing";
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD sub-components
// ─────────────────────────────────────────────────────────────────────────────

function LifeIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 19 C11 19 3 13.5 3 8 A4 4 0 0 1 11 6.5 A4 4 0 0 1 19 8 C19 13.5 11 19 11 19Z"
        fill={filled ? "#fbbf24" : "transparent"}
        stroke={filled ? "#fbbf24" : "#fbbf2455"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

interface HUDProps {
  score: number;
  lives: number;
  time: number;
  stack: string[];
  combo: number;
}
function HUD({ score, lives, time, stack, combo }: HUDProps) {
  const pct = Math.max(0, (time / GAME_DURATION) * 100);
  const urgentTime = time <= 20;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 bg-gradient-to-b from-slate-950/85 to-transparent">
        {/* Score + combo */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-amber-200 tabular-nums drop-shadow-lg">
            {score.toLocaleString()}
          </span>
          {combo > 1 && (
            <span className="text-sm font-bold text-cyan-300 animate-pulse">
              ×{combo} COMBO
            </span>
          )}
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <LifeIcon key={i} filled={i < lives} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 pb-4 pt-2 bg-gradient-to-t from-slate-950/85 to-transparent">
        {/* Collected stack */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
          {stack.slice(-10).map((s, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Timer bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                urgentTime
                  ? "bg-red-400 animate-pulse"
                  : "bg-gradient-to-r from-amber-400 to-cyan-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={`text-xs font-bold tabular-nums w-10 text-right ${
              urgentTime ? "text-red-400" : "text-slate-400"
            }`}
          >
            {Math.ceil(time)}s
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Countdown overlay
// ─────────────────────────────────────────────────────────────────────────────

function CountdownOverlay({ count }: { count: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="text-center space-y-6 px-8">
        {/* Title */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold text-amber-200 mb-2">
            🚀 Dev Sprint
          </h2>
          <p className="text-slate-300/80 text-sm sm:text-base max-w-sm mx-auto">
            Collect your tech skills. Dodge the bugs. Build the ultimate stack.
          </p>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs text-slate-400/80">
          <div className="card py-2 text-center">
            <div className="text-amber-300 text-lg mb-1">🎯</div>
            Collect skill pills
          </div>
          <div className="card py-2 text-center">
            <div className="text-red-400 text-lg mb-1">⚠️</div>
            Avoid red bugs
          </div>
          <div className="card py-2 text-center">
            <div className="text-cyan-300 text-lg mb-1">🖱️</div>
            Move your cursor
          </div>
          <div className="card py-2 text-center">
            <div className="text-emerald-300 text-lg mb-1">⚡</div>
            Chain for combos
          </div>
        </div>

        {/* Countdown number */}
        <div
          className="text-8xl font-black text-amber-300"
          key={count}
          style={{ animation: "scalePop 0.5s ease-out" }}
        >
          {count > 0 ? count : "GO!"}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Game-over overlay
// ─────────────────────────────────────────────────────────────────────────────

interface GameOverProps {
  stats: FinalStats;
  onRestart: () => void;
  onClose: () => void;
}

function GameOverOverlay({ stats, onRestart, onClose }: GameOverProps) {
  const { score, stack, highScore, survived } = stats;
  const isNewRecord = score >= highScore && score > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
      <div className="w-full max-w-md card border border-white/15 space-y-5">
        {/* Title */}
        <div className="text-center">
          <div className="text-4xl mb-2">{survived ? "🚀" : "💥"}</div>
          <h2 className="text-2xl font-bold text-slate-50">
            {survived ? "Mission Complete!" : "Game Over"}
          </h2>
          {isNewRecord && (
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-200 animate-pulse">
              ✨ NEW HIGH SCORE
            </span>
          )}
        </div>

        {/* Score row */}
        <div className="flex justify-around text-center">
          <div>
            <div className="text-3xl font-black text-amber-300 tabular-nums">
              {score.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
              Score
            </div>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <div className="text-3xl font-black text-cyan-300 tabular-nums">
              {highScore.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
              Best
            </div>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <div className="text-3xl font-black text-emerald-300 tabular-nums">
              {stack.length}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
              Collected
            </div>
          </div>
        </div>

        {/* Stack */}
        {stack.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              Your Stack
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {stack.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onRestart}
            className="btn-primary flex-1 justify-center text-sm py-2.5"
          >
            🔁 Play Again
          </button>
          <button
            onClick={onClose}
            className="btn-secondary flex-1 justify-center text-sm py-2.5"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

function makeInitialGameData(): GameData {
  return {
    ship: { x: 0, y: 0, angle: 0 },
    keywords: [],
    bugs: [],
    trail: [],
    popups: [],
    stars: [],
    score: 0,
    lives: 3,
    combo: 1,
    stack: [],
    time: GAME_DURATION,
    hitFlash: 0,
    lastKwSpawn: 0,
    lastBugSpawn: 0,
    nextId: 0,
    lastTs: 0,
  };
}

export default function DevSprintGame() {
  const { close, complete } = useGame();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const gRef = useRef<GameData>(makeInitialGameData());
  const phaseRef = useRef<GamePhase>("countdown");
  const mouseRef = useRef({ x: 0, y: 0 });

  // ── React state: only UI / phase ──────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [finalStats, setFinalStats] = useState<FinalStats | null>(null);

  // HUD state (updated at ~10 fps via interval, not every canvas frame)
  const [hudScore, setHudScore] = useState(0);
  const [hudLives, setHudLives] = useState(3);
  const [hudTime, setHudTime] = useState(GAME_DURATION);
  const [hudStack, setHudStack] = useState<string[]>([]);
  const [hudCombo, setHudCombo] = useState(1);

  // ── Canvas resize (container-based via ResizeObserver) ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
      gRef.current.stars = generateStars(w, h);
      if (gRef.current.ship.x === 0) {
        gRef.current.ship.x = w * 0.18;
        gRef.current.ship.y = h * 0.5;
        mouseRef.current = { x: w * 0.18, y: h * 0.5 };
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── Input: mouse / touch (canvas-relative coords) ────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x =
        ((clientX - rect.left) / rect.width) * canvas.width;
      mouseRef.current.y =
        ((clientY - rect.top) / rect.height) * canvas.height;
    };

    const onMove = (e: MouseEvent) => toLocal(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        e.preventDefault();
        toLocal(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, []);

  // ── Input: ESC to exit ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "countdown") return;
    let n = 3;
    setCountdown(n);

    const id = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(id);
        phaseRef.current = "playing";
        setPhase("playing");
      } else {
        setCountdown(n);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [phase]);

  // ── End-game helper ───────────────────────────────────────────────────────
  const endGame = useCallback(
    (survived: boolean) => {
      const g = gRef.current;
      const stored = parseInt(
        localStorage.getItem("devSprintHighScore") ?? "0",
        10,
      );
      const newHigh = Math.max(stored, g.score);
      localStorage.setItem("devSprintHighScore", String(newHigh));

      complete({
        score: g.score,
        stack: [...g.stack],
        completedAt: Date.now(),
      });

      setFinalStats({
        score: g.score,
        stack: [...g.stack],
        highScore: newHigh,
        survived,
      });

      phaseRef.current = "gameover";
      setPhase("gameover");
      cancelAnimationFrame(rafRef.current);
    },
    [complete],
  );

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    gRef.current.lastTs = performance.now();

    const loop = (ts: number) => {
      if (phaseRef.current !== "playing") return;

      const g = gRef.current;
      const dt = Math.min((ts - g.lastTs) / 1000, 0.05);
      g.lastTs = ts;

      const W = canvas.width;
      const H = canvas.height;

      const result = updateGame(
        g,
        dt,
        ts,
        W,
        H,
        mouseRef.current.x,
        mouseRef.current.y,
      );

      // Draw
      drawBackground(ctx, W, H, g.stars, g.hitFlash);
      drawTrail(ctx, g.trail);
      g.keywords.forEach((kw) => drawKeyword(ctx, kw));
      g.bugs.forEach((b) => drawBug(ctx, b));
      drawShip(ctx, g.ship.x, g.ship.y, g.ship.angle);
      g.popups.forEach((p) => drawPopup(ctx, p));

      if (result === "gameover") {
        endGame(g.time <= 0); // survived = ran out of time (not lives)
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // HUD update at ~10 fps (no need to update React state at 60 fps)
    const hudInterval = setInterval(() => {
      const g = gRef.current;
      setHudScore(g.score);
      setHudLives(g.lives);
      setHudTime(g.time);
      setHudStack([...g.stack].slice(-10));
      setHudCombo(g.combo);
    }, 100);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(hudInterval);
    };
  }, [phase, endGame]);

  // ── Restart ───────────────────────────────────────────────────────────────
  const restart = useCallback(() => {
    const canvas = canvasRef.current;
    const g = makeInitialGameData();
    g.ship.x = (canvas?.width ?? 400) * 0.18;
    g.ship.y = (canvas?.height ?? 400) * 0.5;
    g.stars = generateStars(canvas?.width ?? 800, canvas?.height ?? 600);
    gRef.current = g;

    setHudScore(0);
    setHudLives(3);
    setHudTime(GAME_DURATION);
    setHudStack([]);
    setHudCombo(1);
    setFinalStats(null);
    setCountdown(3);
    phaseRef.current = "countdown";
    setPhase("countdown");
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Scale-pop keyframe injected once */}
      <style>{`
        @keyframes scalePop {
          0%  { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.15); }
          100%{ transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75"
      >
        {/* 2-D canvas — the actual game rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: "none" }}
        />

        {/* HUD (playing state only) */}
        {phase === "playing" && (
          <HUD
            score={hudScore}
            lives={hudLives}
            time={hudTime}
            stack={hudStack}
            combo={hudCombo}
          />
        )}

        {/* Countdown overlay */}
        {phase === "countdown" && <CountdownOverlay count={countdown} />}

        {/* Game-over overlay */}
        {phase === "gameover" && finalStats && (
          <GameOverOverlay
            stats={finalStats}
            onRestart={restart}
            onClose={close}
          />
        )}

        {/* Always-visible exit button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-[110] flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/8 border border-white/15 text-slate-300 hover:bg-white/15 hover:text-white transition-all duration-150 backdrop-blur-sm"
          aria-label="Close game"
        >
          ESC&nbsp;/&nbsp;✕
        </button>
      </div>
    </>
  );
}
