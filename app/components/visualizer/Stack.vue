<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Layers } from '@lucide/vue'

const props = defineProps<{ items: string[] }>()

const listRef = ref<HTMLElement | null>(null)

watch(
  () => props.items.length,
  async (newLen, oldLen) => {
    if (newLen <= oldLen || !listRef.value) return
    await nextTick()
    // Animate the topmost visible stack item (last child in DOM with flex-col-reverse)
    const items = listRef.value.querySelectorAll('.stack-item')
    if (items.length === 0) return
    const newest = items[items.length - 1] as HTMLElement
    gsap.fromTo(
      newest,
      { x: -12, opacity: 0, scale: 0.93 },
      { x: 0, opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.8)' }
    )
  },
  { flush: 'post' }
)
</script>

<template>
  <div class="stack-root">

    <!-- Header -->
    <div class="stack-header">
      <div class="stack-header-left">
        <Layers :size="12" class="text-emerald-400" />
        <span class="stack-title">01_CALL_STACK</span>
      </div>
      <span class="stack-badge">LIFO</span>
    </div>

    <!-- Items container -->
    <div ref="listRef" class="stack-body">
      <TransitionGroup
        tag="div"
        class="stack-list"
        enter-active-class="stack-enter-active"
        enter-from-class="stack-enter-from"
        leave-active-class="stack-leave-active"
        leave-to-class="stack-leave-to"
      >
        <div
          v-for="(item, i) in items"
          :key="`${item}-${i}`"
          class="stack-item"
        >
          <span class="stack-item-glow" />
          <span class="stack-item-dot" />
          <span class="stack-item-name">{{ item }}</span>
          <span class="stack-item-depth">{{ i }}</span>
        </div>
      </TransitionGroup>

      <div v-if="items.length === 0" class="stack-empty">
        STACK_EMPTY
      </div>
    </div>

    <!-- Ground line -->
    <div class="stack-ground">
      <div class="stack-ground-line" />
      <span class="stack-ground-label">GROUND</span>
    </div>

  </div>
</template>

<style scoped>
.stack-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 260px;
  gap: 10px;
}

/* ── Header ── */
.stack-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 11px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.stack-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stack-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(52, 211, 153, 0.58);
}

.stack-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(52, 211, 153, 0.32);
}

/* ── Body ── */
.stack-body {
  flex: 1;
  position: relative;
  min-height: 100px;
}

.stack-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 7px;
}

/* ── Item ── */
.stack-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 13px;
  background: rgba(52, 211, 153, 0.055);
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-left: 3px solid rgba(52, 211, 153, 0.75);
  border-radius: 5px;
  overflow: hidden;
  transition: background 0.2s, box-shadow 0.2s;
}

.stack-item:hover {
  background: rgba(52, 211, 153, 0.09);
  box-shadow: 0 0 14px rgba(52, 211, 153, 0.1);
}

/* Subtle inner glow streak */
.stack-item-glow {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(52,211,153,0.5) 0%, transparent 70%);
  pointer-events: none;
}

.stack-item-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.7);
  flex-shrink: 0;
  display: block;
}

.stack-item-name {
  flex: 1;
  font-size: 12.5px;
  font-weight: 700;
  color: #6ee7b7;
  letter-spacing: 0.02em;
}

.stack-item-depth {
  font-size: 9px;
  color: rgba(52, 211, 153, 0.28);
  font-weight: 600;
  font-style: italic;
}

/* ── Empty state ── */
.stack-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-style: italic;
  letter-spacing: 0.12em;
  color: rgba(52, 211, 153, 0.13);
  border: 2px dashed rgba(52, 211, 153, 0.07);
  border-radius: 7px;
}

/* ── Ground indicator ── */
.stack-ground {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stack-ground-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg,
    rgba(52, 211, 153, 0.45) 0%,
    rgba(52, 211, 153, 0.04) 100%
  );
  border-radius: 1px;
}

.stack-ground-label {
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(52, 211, 153, 0.28);
  flex-shrink: 0;
}

/* ── Transitions ── */
.stack-enter-active {
  transition: all 0.34s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stack-enter-from {
  opacity: 0;
  transform: translateX(-12px) scale(0.94);
}

.stack-leave-active {
  transition: all 0.24s ease-in;
  position: absolute;
  width: 100%;
}

.stack-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.94);
}
</style>
