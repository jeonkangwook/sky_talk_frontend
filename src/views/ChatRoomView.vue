<script setup lang="ts">
import { inject, ref,computed,watch,onMounted ,onBeforeUnmount } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter,useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { createServer } from "http";
import { Server } from "socket.io";

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

const connected = ref(false);
const message = ref('');




const socket = io('ws://localhost:8080/ws', {
    path: '/ws', // WebSocket 핸들러가 등록된 엔드포인트 경로
    transports: ['websocket'],
    upgrade: true,
});


console.log('socket object:', socket);
const sendMessage = () => {
    console.log("연결");
    if (connected.value) {
      console.log("연결이되나");
      socket.emit('chat-message', message.value);
      message.value = '';
    }
  };

onMounted(() => {
    // socket.disconnect();
    // socket.close();
    // socket.off();
    socket.send('asdasd');
    socket.on('connection', (socket) => {
      connected.value = true;
      console.log('Connected to WebSocket');
      console.log('socket');
    });

    socket.on('disconnect', () => {
      connected.value = false;
      console.log('Disconnected from WebSocket');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
      // 처리 로직 작성...
    });
    console.log('socket object:', socket);
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
// socket.on('connect', () => {
//     console.log('Connected to WebSocket');
// });

// socket.on('message', (message) => {
//     console.log('Received message:', message);
// });

// socket.on('disconnect', () => {
//     console.log('Disconnected from WebSocket');
// });



// onMounted(async () => {

//     console.log('onMounted executed');
//     console.log('Socket connected:', socket.connected);
//     console.log('Socket connected:', socket.emit);
//     console.log('Socket connected:', socket.io);
//     console.log('Socket connected:', socket.on);
//     socket.connect();
//     socket.on('chat-message', async (message) => {
//         console.log('chat-message event received', message);
//         // 수신된 메시지 처리
//         // chatList를 업데이트하거나 다른 로직 수행
//         const res = await $axios.get('/api/findChatRoom', {params: 
//             {
//                 sendUserNo : UserNo.value,
//                 getUserNo : friUserNo
//             }
//         });
//         if(res.data !== 0){
//             chatRoomNo.value = res.data;
//         }
//         const response = await $axios.get('/api/chatContent', {params: 
//             {
//                 chatRoomNo : chatRoomNo.value
//             }
//         });
//         console.log("response",response);
//         chatList.value = response.data;
//         console.log("푸히히",currentUser.value);
//     });
//     console.log('Socket connected:', socket.connected);
//     // socket.disconnect();
//     // socket.close();
//     // socket.off();
// });
onBeforeUnmount(() => {
    // 컴포넌트가 언마운트될 때 소켓 정리 또는 연결 종료
    socket.disconnect();
});

const onSubmit = async() => {
  socket.emit('chat-message', {
    content: chatContent.value,
    sendUserNo: UserNo.value,
    userNo: friUserNo
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
    <div>
        <input v-model="message" />
        <button type="button" @click="sendMessage">Send Message</button>
    </div>
    <!-- TODO - 내용을 전부 가져오다보니 작성자 읽는자 구분을 못한다 api를 하나 더 만들어야되나 생각을 해봐야겠다 -->
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