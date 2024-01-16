<script setup lang="ts">
import { ref,onBeforeUnmount,onMounted } from 'vue';
import { Client, } from '@stomp/stompjs';
import stomp from '@stomp/stompjs';


const chatMessages = ref<any>([]);
const newMessage = ref<any>('');


const stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    debug: function (str) {
      console.log(str);
    },
  });
stompClient.activate();
  
stompClient.onConnect = () => {
    console.log("제발연결좀돼라");
    stompClient.subscribe('/topic/chat', (message) => {
      const chatMessage = JSON.parse(message.body);
      chatMessages.value.push(chatMessage);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('STOMP protocol level error:', frame);
};

stompClient.onWebSocketError = (event) => {
    console.error('WebSocket error:', event);
};

stompClient.onWebSocketClose = (event) => {
    console.warn('WebSocket closed:', event);
};

  const sendMessage = () => {
  if (stompClient && stompClient.connected && newMessage.value.trim() !== '') {
    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify({
        content: newMessage.value,
        sender: 'username', // 적절한 사용자 이름으로 변경
      }),
    });
    newMessage.value = '';
  } else {
    console.log('WebSocket connection is not active. Reconnecting...');
    // 연결이 끊겼을 경우 재연결 또는 사용자에게 알림을 추가할 수 있습니다.
  }
};


onMounted(() => {
  // stompClient.deactivate();
});

onBeforeUnmount(() => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        console.log('WebSocket connection closed.');
    }
});
</script>

<template>
    <h3>채팅</h3>
    <div>
    <div v-for="message in chatMessages" :key="message.id">
      {{ message.sender }}: {{ message.content }}
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" />
  </div>
</template>
<style scoped>
textarea{
    width: 90%;
    height: 100px;
}

/* .chat-container {
  max-height: 70vh; 
  overflow-y: auto;
} */

/* .chat-form {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  display: flex;
} */

</style>