<script setup lang="ts">
import { inject, ref,computed,watch,onMounted ,onBeforeUnmount } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter,useRoute } from 'vue-router';
import { io } from 'socket.io-client';

const router = useRouter();
const route = useRoute();
const $axios = inject<any>('$axios');
const chatContent = ref('');
const chatRoomNo = ref(0);
const chatList = ref<chat[]>([]);
const sessionStore = useSessionStore();
const UserNo = ref(sessionStore.userno);
const friUserNo = route.query.friUserNo;
const currentUser = ref(friUserNo as unknown as number);

const socket = io('http://localhost:3000', { 
  path: '/socket.io',
  transports: ['websocket', 'polling'] ,
  withCredentials: true,
});


interface chat {
  content: string;
  chatDtm: string;
  getUserName: string;
  sendUserName: string;
  chatNo: number;
  getUserNo: number;
  sendUserNo: number;
  userNo: number;
}



const formatTimestamp = (timestamp: string) => {
    const day = String(timestamp[2]).padStart(2, '0');
    const hours = String(timestamp[3]).padStart(2, '0');
    const minutes = String(timestamp[4]).padStart(2, '0');

    return `${day}일 ${hours}:${minutes}`;
};
const fetchData = async () => {
  const response = await $axios.get('/api/chatContent', {
    params: {
      chatRoomNo: chatRoomNo.value
    }
  });
  chatList.value = response.data;
};
socket.on('message', (data) => {
    console.log('chat-message event received', data);
    // 수신된 메시지 처리
    // chatList를 업데이트하거나 다른 로직 수행
    fetchData();
});
// socket.on('message', (data) => {
//     console.log('Received message from server:', data.text);
//     msg.value = data.text;
//   });
console.log('Socket connected:', socket.connected);

onMounted(async () => {
  const res = await $axios.get('/api/findChatRoom', {params: 
    {
      sendUserNo : UserNo.value,
      getUserNo : friUserNo
    }
  });
  if(res.data !== 0){
    chatRoomNo.value = res.data;
  }
  const response = await $axios.get('/api/chatContent', {params: 
    {
      chatRoomNo : chatRoomNo.value
    }
  });
  chatList.value = response.data;
});
onBeforeUnmount(() => {
    // 컴포넌트가 언마운트될 때 소켓 정리 또는 연결 종료
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});

const onSubmit = async() => {
  socket.emit('chat-message', {
    chatRoomNo : chatRoomNo.value
  });
    console.log("chatContent",chatContent.value);
    console.log("UserNo",UserNo.value);
    console.log("friUserNo",friUserNo);
  const res = await $axios.post('/api/chatSend', {
    content : chatContent.value,
    sendUserNo : UserNo.value,
    userNo : friUserNo
  });
  chatRoomNo.value = res.data;
  console.log("res.data",res.data);
  const response = await $axios.get('/api/chatContent', {params: 
    {
        chatRoomNo : chatRoomNo.value
    }
  });
  console.log("response",response);
  chatList.value = response.data;
  chatContent.value = "";
}
</script>

<template>
    <h3>채팅</h3>
    <div v-for="chat in chatList" :key="chat.chatNo" class="chat-container" ref="chatContainer">
        <p v-if="chat.sendUserNo == currentUser" style="text-align: left;">
        {{ chat.sendUserName }}: {{ chat.content }}<br> {{ formatTimestamp(chat.chatDtm) }}
        </p>
        <!-- 받는 사람이면 오른쪽으로 표시 -->
        <p v-else style="text-align: right;">
        {{ chat.sendUserName }}: {{ chat.content }}<br> {{ formatTimestamp(chat.chatDtm) }}
        </p>
    </div>
    <form @submit.prevent="onSubmit" class="chat-form">
        <textarea name="content" id="content" cols="30" rows="10" v-model="chatContent"></textarea>
        <button type="submit">전송</button>
    </form>
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