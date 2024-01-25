<script setup lang="ts">
import { inject, ref,computed,watch,onMounted ,onBeforeUnmount,watchEffect, nextTick  } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter,useRoute } from 'vue-router';
import { io } from 'socket.io-client';

const router = useRouter();
const route = useRoute();
const $axios = inject<any>('$axios');
const chatContent = ref('');
const chatRoomNo = ref<any>('');
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
  readYn: string;
}



const formatTimestamp = (timestamp: string) => {
    const day = String(timestamp[2]).padStart(2, '0');
    const hours = String(timestamp[3]).padStart(2, '0');
    const minutes = String(timestamp[4]).padStart(2, '0');

    return `${day}일 ${hours}:${minutes}`;
};

const charList = async () => {
  const response = await $axios.get('/api/chatContent', {
    params: {
      chatRoomNo: chatRoomNo.value
    }
  });
  chatList.value = response.data;
};

const read = async () => {
  const respon = await $axios.post('/api/chatRead', {
      chatRoomNo : chatRoomNo.value,
      userNo : UserNo.value,
  });
};
socket.on('message', (data) => {
    read();
    console.log('chat-message event received', data);
    // 수신된 메시지 처리
    // chatList를 업데이트하거나 다른 로직 수행
    charList();
});
// socket.on('message', (data) => {
//     console.log('Received message from server:', data.text);
//     msg.value = data.text;
//   });

onMounted(async () => {
  socket.emit('chat-message', {
    chatRoomNo : chatRoomNo.value,
    sendUserNo : UserNo.value,
  });
  console.log("UserNo",UserNo.value);
  console.log("friUserNo",friUserNo);
  if(friUserNo){
    const res = await $axios.get('/api/findChatRoom', {params: 
      {
        sendUserNo : UserNo.value,
        getUserNo : friUserNo
      }
    });
    console.log("ressss",res);
  
    if(res.data !== 0){
      chatRoomNo.value = res.data;
    }
  }else{
    chatRoomNo.value = route.query.chatRoomNo;
  }

  const response = await $axios.get('/api/chatContent', {params: 
    {
      chatRoomNo : chatRoomNo.value
    }
  });

  const respon = await $axios.post('/api/chatRead', {
      chatRoomNo : chatRoomNo.value,
      userNo : UserNo.value,
  });

  chatList.value = response.data;
  scrollToBottom();
  
});


onBeforeUnmount(() => {
    // 컴포넌트가 언마운트될 때 소켓 정리 또는 연결 종료
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
  socket.disconnect();
});

const onSubmit = async() => {
  socket.emit('chat-message', {
    chatRoomNo : chatRoomNo.value,
    sendUserNo : UserNo.value,
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
  scrollToBottom();
}

const scrollToBottom = async () => {
    await nextTick(() => {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
          chatContainer.scrollTo(0, chatContainer.scrollHeight)
        }
      });
    };
</script>

<template>
    <h3 class="top">채팅</h3>
    <div ref="chatContainer" class="chat-container" id="chatContainer">
      <div v-for="chat in chatList" :key="chat.chatNo">
          <br>
          <div v-if="chat.sendUserNo != UserNo" style="text-align: left;">
            {{ chat.sendUserName }}<br> {{ chat.content }}<br> {{ formatTimestamp(chat.chatDtm) }}
          </div>
          <!-- 받는 사람이면 오른쪽으로 표시 -->
          <div v-else style="text-align: right;">
            {{ chat.content }}<br> {{ formatTimestamp(chat.chatDtm) }}
            <p v-if="chat.readYn == 'N'">1</p>
          </div>
      </div>
    </div>
    <div class="chat-form-container">
      <form @submit.prevent="onSubmit" class="chat-form mb-3">
          <textarea name="content" id="content" cols="30" rows="10" v-model="chatContent" class="form-control" @keyup.enter="onSubmit"></textarea>
          <button type="submit" class="btn btn-info right">전송</button>
      </form>
    </div>
</template>
<style scoped>
textarea{
    width: 100%;
    height: 100px;
}
.right{
  float: right;
}
  .chat-container {
    overflow-y: auto !important;
    max-height: 70%;
    background-color: skyblue;
  }

  .chat-form-container {
    position: sticky;
    bottom: 0;
    background-color: white;
    padding: 10px;
    margin-top: 10px;
    z-index: 1; /* 채팅창 위로 올리기 위해 z-index 추가 */
  }

  .chat-form {
    display: flex;
  }

  textarea {
    resize: none;
    flex: 1; /* textarea가 남은 공간을 모두 차지하도록 함 */
  }

  button {
    margin-left: 10px; /* 버튼과 textarea 사이에 간격 추가 */
  }
  .top{
    position: sticky;
    top: 0;
    background-color: white;
  }

  
  

</style>