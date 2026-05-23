<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useVMStore } from './stores/useVM'
import { useInterpreter } from './logic/engine'
import { gsap } from 'gsap'
import Lenis from 'lenis'
import {
  Play, RefreshCw, Activity, Terminal, Cpu, ArrowRight
} from '@lucide/vue'

const vm = useVMStore()
const { parseAndRun } = useInterpreter()

const codeInput = ref(`console.log('1. Start');

setTimeout(() => {
  console.log('4. Timeout');
}, 0);

Promise.resolve()
  .then(() => console.log('3. Promise'));

console.log('2. End');`)

let lenis: InstanceType<typeof Lenis> | null = null
let rafId: number | null = null

function runSimulation() {
  if (vm.isRunning) return
  parseAndRun(codeInput.value)
}

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  const raf = (time: number) => {
    lenis!.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  // Staggered entrance timeline
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl
    .fromTo('.app-header',
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65 }
    )
    .fromTo('.code-panel',
      { x: -36, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7 },
      '-=0.4'
    )
    .fromTo('.vis-card',
      { y: 36, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
      '-=0.5'
    )
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  lenis?.destroy()
})
</script>

<template>
  <div class="app-root">

    <!-- ── Ambient background ─────────────────────────────── -->
    <div class="app-bg" aria-hidden="true">
      <div class="bg-blob blob-1" />
      <div class="bg-blob blob-2" />
      <div class="bg-blob blob-3" />
      <div class="bg-grid" />
    </div>

    <!-- ── Header ─────────────────────────────────────────── -->
    <header class="app-header">
      <div class="header-inner">

        <!-- Brand -->
        <div class="brand">
          <div class="brand-icon">
            <AppLogo :size="20" />
          </div>
          <div>
            <h1 class="brand-title">JS_RUNTIME_VISUALIZER</h1>
            <p class="brand-sub">Event Loop · Nuxt 4 · v4.0</p>
          </div>
        </div>

        <!-- Legend dots (hidden on small screens) -->
        <div class="legend-row">
          <span class="legend-chip">
            <span class="chip-dot" style="background:#34d399;box-shadow:0 0 6px #34d399" />
            <span style="color:rgba(52,211,153,.55)">CALL STACK</span>
          </span>
          <span class="legend-chip">
            <span class="chip-dot" style="background:#38bdf8;box-shadow:0 0 6px #38bdf8" />
            <span style="color:rgba(56,189,248,.55)">WEB APIs</span>
          </span>
          <span class="legend-chip">
            <span class="chip-dot" style="background:#c084fc;box-shadow:0 0 6px #c084fc" />
            <span style="color:rgba(192,132,252,.55)">MICROTASKS</span>
          </span>
          <span class="legend-chip">
            <span class="chip-dot" style="background:#fbbf24;box-shadow:0 0 6px #fbbf24" />
            <span style="color:rgba(251,191,36,.55)">MACROTASKS</span>
          </span>
        </div>

        <!-- Status -->
        <div :class="['status-pill', vm.isRunning ? 'status-running' : 'status-idle']">
          <span class="status-dot" />
          <span>{{ vm.isRunning ? 'EXECUTING' : 'IDLE' }}</span>
        </div>

      </div>
    </header>

    <!-- ── Main ───────────────────────────────────────────── -->
    <main class="app-main">

      <!-- ── Code Panel ─────────────────────────────────── -->
      <aside class="code-panel">

        <div class="panel-file-label">
          <Cpu :size="11" class="opacity-50" />
          <span>INPUT_BUFFER.js</span>
        </div>

        <div class="textarea-wrap">
          <textarea
            v-model="codeInput"
            class="code-textarea"
            spellcheck="false"
            autocomplete="off"
          />
          <div class="textarea-corner tl" />
          <div class="textarea-corner tr" />
        </div>

        <div class="action-row">
          <button @click="runSimulation" :disabled="vm.isRunning" class="btn-execute">
            <Play :size="13" stroke-width="2.5" />
            <span>{{ vm.isRunning ? 'RUNNING...' : 'EXECUTE' }}</span>
          </button>
          <button @click="vm.reset()" class="btn-reset">
            <RefreshCw :size="12" stroke-width="2" />
            <span>RESET</span>
          </button>
        </div>

        <div class="how-it-works">
          <p class="how-title">// execution order</p>
          <div class="how-list">
            <div class="how-item">
              <span class="how-dot" style="background:#34d399" />
              <span>Sync code → <strong>Call Stack</strong></span>
            </div>
            <div class="how-item">
              <span class="how-dot" style="background:#38bdf8" />
              <span>Async ops → <strong>Web APIs</strong></span>
            </div>
            <div class="how-item">
              <span class="how-dot" style="background:#c084fc" />
              <span>Promise.then → <strong>Microtask Queue</strong></span>
            </div>
            <div class="how-item">
              <span class="how-dot" style="background:#fbbf24" />
              <span>setTimeout → <strong>Callback Queue</strong></span>
            </div>
          </div>
        </div>

      </aside>

      <!-- ── Visualizer ─────────────────────────────────── -->
      <section class="vis-grid">

        <!-- Row 1: Call Stack + Web APIs -->
        <div class="vis-top-row">

          <!-- Call Stack -->
          <div class="vis-card card-green">
            <VisualizerStack :items="vm.callStack" />
          </div>

          <!-- Web APIs -->
          <div class="vis-card card-blue">
            <div class="glass-card-head">
              <Activity :size="12" class="text-sky-400" />
              <span class="glass-card-label" style="color:rgba(56,189,248,.6)">02_WEB_APIS</span>
              <span class="glass-card-badge" style="color:rgba(56,189,248,.35)">ASYNC</span>
            </div>
            <div class="glass-card-body">
              <TransitionGroup
                tag="div"
                class="flex flex-col gap-2"
                enter-active-class="item-enter-active"
                enter-from-class="item-enter-from"
                leave-active-class="item-leave-active"
                leave-to-class="item-leave-to"
              >
                <div v-for="api in vm.webAPIs" :key="api.id" class="api-item">
                  <span class="api-pulse-dot" />
                  <span class="api-label">{{ api.label }}</span>
                  <span class="api-timer">{{ api.timer }}ms</span>
                </div>
              </TransitionGroup>
              <div v-if="vm.webAPIs.length === 0" class="empty-placeholder" style="color:rgba(56,189,248,.15)">
                NO_ACTIVE_APIS
              </div>
            </div>
          </div>

        </div>

        <!-- Row 2: Queue Scheduling -->
        <div class="vis-card card-queues">
          <VisualizerQueues :micro="vm.microtaskQueue" :macro="vm.callbackQueue" />
        </div>

        <!-- Row 3: Console Output -->
        <div class="vis-card card-console">
          <div class="glass-card-head">
            <Terminal :size="12" class="text-teal-400" />
            <span class="glass-card-label" style="color:rgba(45,212,191,.6)">04_CONSOLE_OUTPUT</span>
            <span class="glass-card-badge" style="color:rgba(45,212,191,.35)">STDOUT</span>
          </div>
          <div class="console-body">
            <div v-if="vm.logs.length === 0" class="empty-placeholder" style="color:rgba(45,212,191,.15)">
              // awaiting execution...
            </div>
            <TransitionGroup
              tag="div"
              class="flex flex-col gap-0.5"
              enter-active-class="log-enter-active"
              enter-from-class="log-enter-from"
            >
              <div v-for="(log, i) in vm.logs" :key="`log-${i}`" class="log-line">
                <span class="log-idx">[{{ i.toString().padStart(2, '0') }}]</span>
                <ArrowRight :size="9" class="log-arrow" />
                <span class="log-text">{{ log }}</span>
              </div>
            </TransitionGroup>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<style>
/* ── Reset & Base ──────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: #04040c;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection { background: rgba(52, 211, 153, 0.22); }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

/* ── App root ──────────────────────────────────────────── */
.app-root {
  position: relative;
  min-height: 100vh;
}

/* ── Ambient Background ────────────────────────────────── */
.app-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}

.blob-1 {
  width: 700px; height: 600px;
  top: -150px; left: -200px;
  background: radial-gradient(circle, rgba(109, 40, 217, 0.18) 0%, transparent 65%);
  animation: blobDrift 14s ease-in-out infinite alternate;
}

.blob-2 {
  width: 550px; height: 450px;
  top: 80px; right: -120px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.13) 0%, transparent 65%);
  animation: blobDrift 17s ease-in-out infinite alternate-reverse;
}

.blob-3 {
  width: 450px; height: 350px;
  bottom: -50px; left: 35%;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.09) 0%, transparent 65%);
  animation: blobDrift 11s ease-in-out infinite alternate;
}

@keyframes blobDrift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(28px, 18px) scale(1.04); }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Header ────────────────────────────────────────────── */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(4, 4, 12, 0.82);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom: 1px solid rgba(255,255,255,0.055);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 24px;
  max-width: 1600px;
  margin: 0 auto;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.brand-icon {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(52, 211, 153, 0.08);
  border: 1px solid rgba(52, 211, 153, 0.28);
  border-radius: 7px;
  color: #34d399;
  box-shadow: 0 0 18px rgba(52, 211, 153, 0.18);
  flex-shrink: 0;
}

.brand-title {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.09em;
  color: #34d399;
  text-shadow: 0 0 22px rgba(52, 211, 153, 0.5);
}

.brand-sub {
  font-size: 9px;
  color: rgba(148, 163, 184, 0.42);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-top: 2px;
}

.legend-row {
  display: none;
  align-items: center;
  gap: 20px;
}
@media (min-width: 1024px) { .legend-row { display: flex; } }

.legend-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.chip-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  display: block;
  flex-shrink: 0;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 5px 14px;
  border-radius: 100px;
  border: 1px solid;
  transition: all 0.35s ease;
  flex-shrink: 0;
}

.status-idle {
  color: rgba(148, 163, 184, 0.6);
  border-color: rgba(148, 163, 184, 0.12);
  background: rgba(148, 163, 184, 0.04);
}

.status-running {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.4);
  background: rgba(52, 211, 153, 0.07);
  box-shadow: 0 0 18px rgba(52, 211, 153, 0.18);
}

.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  display: block;
  flex-shrink: 0;
}

.status-idle .status-dot { background: rgba(148, 163, 184, 0.45); }
.status-running .status-dot {
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: statusPulse 1.4s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.45; transform: scale(0.85); }
}

/* ── Main layout ───────────────────────────────────────── */
.app-main {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;
  padding: 18px 24px 48px;
  max-width: 1600px;
  margin: 0 auto;
}

/* ── Code Panel ────────────────────────────────────────── */
.code-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 76px;
  height: fit-content;
}

.panel-file-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.42);
}

.textarea-wrap {
  position: relative;
}

.code-textarea {
  width: 100%;
  height: 360px;
  background: rgba(255, 255, 255, 0.018);
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 10px;
  padding: 16px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  line-height: 1.75;
  color: rgba(167, 243, 208, 0.88);
  caret-color: #34d399;
  outline: none;
  resize: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.code-textarea:focus {
  border-color: rgba(52, 211, 153, 0.32);
  box-shadow:
    0 0 0 1px rgba(52, 211, 153, 0.08),
    0 0 24px rgba(52, 211, 153, 0.07);
}

/* Corner brackets */
.textarea-corner {
  position: absolute;
  width: 10px; height: 10px;
  border-color: rgba(52, 211, 153, 0.45);
  border-style: solid;
  pointer-events: none;
}
.textarea-corner.tl {
  top: 6px; left: 6px;
  border-width: 2px 0 0 2px;
  border-radius: 2px 0 0 0;
}
.textarea-corner.tr {
  top: 6px; right: 6px;
  border-width: 2px 2px 0 0;
  border-radius: 0 2px 0 0;
}

/* ── Action Buttons ────────────────────────────────────── */
.action-row {
  display: flex;
  gap: 10px;
}

.btn-execute {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  color: #04040c;
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow:
    0 0 22px rgba(52, 211, 153, 0.32),
    0 4px 14px rgba(0, 0, 0, 0.28);
}

.btn-execute:hover:not(:disabled) {
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  box-shadow:
    0 0 34px rgba(52, 211, 153, 0.48),
    0 4px 18px rgba(0, 0, 0, 0.28);
  transform: translateY(-1px);
}

.btn-execute:active:not(:disabled) { transform: translateY(0); }
.btn-execute:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-reset {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.09em;
  color: rgba(148, 163, 184, 0.65);
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.22s ease;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.065);
  border-color: rgba(255, 255, 255, 0.14);
  color: rgba(226, 232, 240, 0.85);
}

/* ── How-it-works legend ───────────────────────────────── */
.how-it-works {
  background: rgba(255, 255, 255, 0.018);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 9px;
  padding: 13px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.how-title {
  font-size: 10px;
  color: rgba(148, 163, 184, 0.3);
  font-style: italic;
  letter-spacing: 0.04em;
}

.how-list { display: flex; flex-direction: column; gap: 5px; }

.how-item {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 10.5px;
  color: rgba(148, 163, 184, 0.5);
}

.how-item strong { color: rgba(203, 213, 225, 0.75); font-weight: 600; }

.how-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  display: block;
  flex-shrink: 0;
}

/* ── Visualizer Grid ───────────────────────────────────── */
.vis-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vis-top-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ── Glass Cards ───────────────────────────────────────── */
.vis-card {
  background: rgba(255, 255, 255, 0.022);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border-radius: 11px;
  padding: 16px;
}

.card-green {
  border: 1px solid rgba(52, 211, 153, 0.16);
  box-shadow:
    0 0 32px rgba(52, 211, 153, 0.06),
    inset 0 1px 0 rgba(255,255,255,0.035);
}

.card-green:hover {
  box-shadow:
    0 0 44px rgba(52, 211, 153, 0.11),
    inset 0 1px 0 rgba(255,255,255,0.035);
  transition: box-shadow 0.35s ease;
}

.card-blue {
  border: 1px solid rgba(56, 189, 248, 0.16);
  box-shadow:
    0 0 32px rgba(56, 189, 248, 0.06),
    inset 0 1px 0 rgba(255,255,255,0.035);
}

.card-blue:hover {
  box-shadow:
    0 0 44px rgba(56, 189, 248, 0.11),
    inset 0 1px 0 rgba(255,255,255,0.035);
  transition: box-shadow 0.35s ease;
}

.card-queues {
  border: 1px solid rgba(255, 255, 255, 0.065);
  box-shadow:
    0 0 32px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255,255,255,0.035);
}

.card-console {
  border: 1px solid rgba(45, 212, 191, 0.16);
  box-shadow:
    0 0 32px rgba(45, 212, 191, 0.06),
    inset 0 1px 0 rgba(255,255,255,0.035);
}

/* ── Glass Card internals ──────────────────────────────── */
.glass-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 11px;
  margin-bottom: 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-card-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  flex: 1;
}

.glass-card-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.glass-card-body {
  position: relative;
  min-height: 80px;
}

/* ── Web API items ─────────────────────────────────────── */
.api-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  background: rgba(56, 189, 248, 0.055);
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 7px;
  transition: all 0.2s ease;
}

.api-pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  animation: statusPulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
  display: block;
}

.api-label {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: #7dd3fc;
}

.api-timer {
  font-size: 9px;
  color: rgba(56, 189, 248, 0.5);
  background: rgba(56, 189, 248, 0.1);
  padding: 2px 8px;
  border-radius: 100px;
  animation: statusPulse 2s ease-in-out infinite;
}

/* ── Empty placeholder ─────────────────────────────────── */
.empty-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-style: italic;
  letter-spacing: 0.1em;
  pointer-events: none;
}

/* ── Console ───────────────────────────────────────────── */
.console-body {
  position: relative;
  min-height: 60px;
  max-height: 160px;
  overflow-y: auto;
}

.log-line {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 3.5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  font-size: 11px;
}

.log-idx {
  font-size: 9.5px;
  font-weight: 700;
  color: rgba(45, 212, 191, 0.3);
  flex-shrink: 0;
  min-width: 28px;
}

.log-arrow { color: rgba(45, 212, 191, 0.2); flex-shrink: 0; }

.log-text { color: rgba(203, 213, 225, 0.65); }

/* ── List transitions ──────────────────────────────────── */
.item-enter-active {
  transition: all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.item-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.94);
}
.item-leave-active {
  transition: all 0.22s ease-in;
}
.item-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.94);
}

.log-enter-active {
  transition: all 0.26s ease-out;
}
.log-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 767px) {
  .header-inner {
    padding: 0 14px;
    gap: 10px;
  }

  .brand-title {
    font-size: 11px;
    letter-spacing: 0.06em;
  }

  .brand-sub {
    display: none;
  }

  .brand-icon {
    width: 30px; height: 30px;
  }

  .status-pill {
    font-size: 9px;
    padding: 4px 10px;
    gap: 5px;
  }

  .app-main {
    grid-template-columns: 1fr;
    padding: 14px 14px 48px;
    gap: 14px;
  }

  .code-panel {
    position: static;
  }

  .code-textarea {
    height: 220px;
    font-size: 12px;
  }

  .vis-top-row {
    grid-template-columns: 1fr;
  }

  .how-it-works {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 10px;
  }

  .app-main {
    padding: 12px 12px 40px;
    gap: 12px;
  }

  .vis-card {
    padding: 13px;
  }

  .code-textarea {
    height: 200px;
  }
}
</style>
