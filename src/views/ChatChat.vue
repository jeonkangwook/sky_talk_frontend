<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input v-model="inputMessage" placeholder="Type a message" />
    <button @click="sendMessage">Send Message</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

const msg = ref('Hello from Vue!');
const inputMessage = ref('');


const socket = io('http://localhost:3000', { 
  path: '/socket.io',
  transports: ['websocket', 'polling'] ,
  withCredentials: true,
});

onMounted(() => {
  // 서버로부터의 메시지 수신
  socket.on('message', (data) => {
    console.log('Received message from server:', data.text);
    msg.value = data.text;
  });

  // 연결 해제 시 처리
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});

const sendMessage = () => {
  // 서버로 메시지 전송
  socket.emit('message', { text: inputMessage.value });
};
</script>
  
  <style>
  /* 스타일은 필요에 따라 추가하세요. */
  </style>