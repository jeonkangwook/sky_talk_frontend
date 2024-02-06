<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-container" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps(['show']);
const emit = defineEmits();

const close = () => emit('close');
</script>

<style scoped>
/* 스타일링은 프로젝트에 맞게 수정 가능 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 70%;
  height: 50%;
  position: relative;
}
</style>