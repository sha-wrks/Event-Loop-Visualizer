<script setup lang="ts">
import { ArrowRight, Zap, Clock } from '@lucide/vue'

defineProps<{ micro: string[], macro: string[] }>()
</script>

<template>
  <div class="queues-root">

    <!-- Header -->
    <div class="queues-header">
      <span class="queues-title">03_QUEUE_SCHEDULING</span>
      <span class="queues-sub">FIFO · Event Loop Priority</span>
    </div>

    <!-- Both queues side by side -->
    <div class="queues-body">

      <!-- Microtask Queue -->
      <div class="queue-section">
        <div class="queue-label">
          <div class="queue-label-dot dot-purple" />
          <Zap :size="10" class="text-purple-400/60" />
          <span class="queue-label-text" style="color:rgba(192,132,252,.58)">MICROTASK QUEUE</span>
          <span class="queue-priority" style="color:rgba(192,132,252,.32)">HIGH</span>
        </div>

        <div class="queue-track track-purple">
          <ArrowRight :size="10" class="queue-arrow" style="color:rgba(168,85,247,.3)" />
          <div class="queue-items">
            <TransitionGroup
              enter-active-class="q-enter-active"
              enter-from-class="q-enter-from"
              leave-active-class="q-leave-active"
              leave-to-class="q-leave-to"
            >
              <div
                v-for="(q, i) in micro"
                :key="`micro-${q}-${i}`"
                class="queue-item item-purple"
              >
                <span class="queue-item-dot bg-purple-500" style="box-shadow:0 0 6px rgba(168,85,247,.7)" />
                <span>{{ q }}</span>
              </div>
            </TransitionGroup>
            <span v-if="micro.length === 0" class="queue-empty" style="color:rgba(168,85,247,.18)">EMPTY</span>
          </div>
        </div>
      </div>

      <!-- Macrotask / Callback Queue -->
      <div class="queue-section">
        <div class="queue-label">
          <div class="queue-label-dot dot-amber" />
          <Clock :size="10" class="text-amber-400/60" />
          <span class="queue-label-text" style="color:rgba(251,191,36,.58)">MACROTASK QUEUE</span>
          <span class="queue-priority" style="color:rgba(251,191,36,.32)">NORMAL</span>
        </div>

        <div class="queue-track track-amber">
          <ArrowRight :size="10" class="queue-arrow" style="color:rgba(245,158,11,.3)" />
          <div class="queue-items">
            <TransitionGroup
              enter-active-class="q-enter-active"
              enter-from-class="q-enter-from"
              leave-active-class="q-leave-active"
              leave-to-class="q-leave-to"
            >
              <div
                v-for="(q, i) in macro"
                :key="`macro-${q}-${i}`"
                class="queue-item item-amber"
              >
                <span class="queue-item-dot bg-amber-500" style="box-shadow:0 0 6px rgba(245,158,11,.7)" />
                <span>{{ q }}</span>
              </div>
            </TransitionGroup>
            <span v-if="macro.length === 0" class="queue-empty" style="color:rgba(245,158,11,.18)">EMPTY</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.queues-root { width: 100%; }

/* ── Header ── */
.queues-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 11px;
  margin-bottom: 13px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.queues-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(203, 213, 225, 0.38);
}

.queues-sub {
  font-size: 9px;
  color: rgba(148, 163, 184, 0.26);
  letter-spacing: 0.1em;
}

/* ── Body ── */
.queues-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 480px) {
  .queues-body {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

/* ── Queue Section ── */
.queue-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.queue-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.queue-label-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-purple { background: #a855f7; box-shadow: 0 0 7px rgba(168,85,247,.65); }
.dot-amber  { background: #f59e0b; box-shadow: 0 0 7px rgba(245,158,11,.65); }

.queue-label-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  flex: 1;
}

.queue-priority {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── Track ── */
.queue-track {
  min-height: 54px;
  border-radius: 7px;
  padding: 8px 10px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  overflow-x: auto;
}

.track-purple {
  background: rgba(168, 85, 247, 0.038);
  border: 1px solid rgba(168, 85, 247, 0.14);
  box-shadow: inset 0 0 18px rgba(168, 85, 247, 0.025);
}

.track-amber {
  background: rgba(245, 158, 11, 0.038);
  border: 1px solid rgba(245, 158, 11, 0.14);
  box-shadow: inset 0 0 18px rgba(245, 158, 11, 0.025);
}

.queue-arrow {
  flex-shrink: 0;
  margin-top: 3px;
}

.queue-items {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
  min-width: 0;
}

/* ── Queue item ── */
.queue-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 5px;
  font-size: 10.5px;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.18s ease;
}

.item-purple {
  background: rgba(168, 85, 247, 0.11);
  border: 1px solid rgba(168, 85, 247, 0.28);
  color: #c084fc;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.09);
}

.item-purple:hover {
  background: rgba(168, 85, 247, 0.18);
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.16);
}

.item-amber {
  background: rgba(245, 158, 11, 0.11);
  border: 1px solid rgba(245, 158, 11, 0.28);
  color: #fcd34d;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.09);
}

.item-amber:hover {
  background: rgba(245, 158, 11, 0.18);
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.16);
}

.queue-item-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  display: block;
  flex-shrink: 0;
}

/* ── Empty ── */
.queue-empty {
  font-size: 10px;
  font-style: italic;
  letter-spacing: 0.1em;
  padding: 3px 0;
}

/* ── Transitions ── */
.q-enter-active {
  transition: all 0.36s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.q-enter-from {
  opacity: 0;
  transform: translateY(-9px) scale(0.88);
}
.q-leave-active {
  transition: all 0.22s ease-in;
}
.q-leave-to {
  opacity: 0;
  transform: translateY(9px) scale(0.88);
}
</style>
