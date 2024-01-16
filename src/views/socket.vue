<template>
    <div>
      <h3>WebSocket Example</h3>
      <button @click="connectWebSocket">Connect WebSocket</button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { Client } from '@stomp/stompjs';
  
  export default {
    methods: {
      connectWebSocket() {
        const stompClient = new Client({
          brokerURL: 'ws://localhost:8080/ws',
          debug: function (str) {
            console.log(str);
          },
        });
  
        stompClient.onConnect = () => {
          console.log('WebSocket connected');
          // 여기에서 필요한 로직을 추가하세요.
        };
  
        stompClient.activate();
      },
    },
  };
  </script>