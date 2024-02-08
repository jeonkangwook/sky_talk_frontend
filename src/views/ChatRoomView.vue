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
  imgPath: string;
  getImgPath: string;
  sendImgPath: string;
}



const formatTimestamp = (timestamp: string) => {
    const month = String(timestamp[1]).padStart(2, '0');
    const day = String(timestamp[2]).padStart(2, '0');
    const hours = String(timestamp[3]).padStart(2, '0');
    const minutes = String(timestamp[4]).padStart(2, '0');

    return `${month}-${day} ${hours}:${minutes}`;
};

const charList = async () => {
  if(chatRoomNo.value != ""){
    const response = await $axios.get('/api/chatContent', {
      params: {
        chatRoomNo: chatRoomNo.value
      }
    });
    chatList.value = response.data;
  }
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
  
    if(res.data != 0){
      chatRoomNo.value = res.data;
    }
  }else{
    chatRoomNo.value = route.query.chatRoomNo;
  }

  console.log("두둥",chatRoomNo);
  console.log("두둥두둥",chatRoomNo.value);
  if(chatRoomNo.value == ""){
    console.log("두둥두둥두둥");
    const re = await $axios.post('/api/chatRoomCreate', {
      sendUserNo : UserNo.value,
      userNo : friUserNo
    });
  }else{
    const response = await $axios.get('/api/chatContent', {
      params: {
        chatRoomNo: chatRoomNo.value
      }
    });
    chatList.value = response.data;
  }


  read();

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
  
const back = () => {
  router.go(-1);
};

const exit = async () => {
  const confirmMessage = `채팅방을 나가시겠습니까?`;
  if (confirm(confirmMessage)) {
    const respon = await $axios.post('/api/chatExit', {
        chatRoomNo : chatRoomNo.value,
        userNo : UserNo.value,
        sendUserNo : friUserNo
    });
    await router.push('/chat');
      
  }
};

function getLocalImagePath(getImgPath: string | undefined): string {
    if (getImgPath) {
      return `http://localhost:8080/getImage?path=${getImgPath}`;
    }
    return ''; // 경로가 없는 경우 빈 문자열 반환하거나 다른 처리를 할 수 있습니다.
}
</script>

<template>
    <div class="top">
      <div class="back">
        <i class="bi bi-chevron-left size-up" @click="back"></i>
      </div>
      <div class="chat-title">
        <h3>채팅</h3>
      </div>
      <div class="exit">
        <div>
          <button class="btn btn-secondary btn-sm" @click="exit">나가기</button>
        </div>
      </div>
    </div>
    <div ref="chatContainer" class="chat-container" id="chatContainer">
      <div v-for="chat in chatList" :key="chat.chatNo">
          <br>
          <div v-if="chat.sendUserNo != UserNo" style="text-align: left; word-break: break-all;" class="left-chat">
            <img :src="getLocalImagePath(chat.sendImgPath)" alt="프로필 사진" v-if="chat.sendImgPath && chat.sendUserNo != UserNo" class="profile-image">
            <img :src="getLocalImagePath(chat.getImgPath)" alt="프로필 사진" v-else-if="chat.getImgPath && chat.sendUserNo != UserNo" class="profile-image">
            <img src="../assets/images/noimage.png" alt="프로필 사진" v-else class="profile-image">
            <div class="friend-info">
              <div class="name">{{ chat.sendUserName }}</div>
              <div>{{ chat.content }}</div>
              <div class="date"> {{ formatTimestamp(chat.chatDtm) }}</div>
            </div>
          </div>
          <!-- 받는 사람이면 오른쪽으로 표시 -->
          <div v-else style="text-align: right; word-break: break-all;" class="right-chat">
            {{ chat.content }}<br> 
            <span v-if="chat.readYn == 'N'" class="num-add">1</span>
            <span class="date">{{ formatTimestamp(chat.chatDtm) }}</span>
          </div>
      </div>
    </div>
    <div class="chat-form-container">
      <form @submit.prevent="onSubmit" class="chat-form mb-3">
          <textarea name="content" id="content" cols="30" rows="10" v-model="chatContent" class="form-control" @keyup.enter="onSubmit"></textarea>
          <button type="submit" class="btn btn-info right">전송</button>
      </form>
    </div>
    <!-- <div>
      파일첨부할곳
    </div> -->
</template>
<style scoped>
  img {
    width: 60px; /* 이미지의 너비를 200px로 설정 */
    height: 50px;
    border-radius: 70%;
    object-fit: cover;
  }
  textarea{
      width: 100%;
      height: 100px;
  }
  .right{
    float: right;
  }
  .chat-container {
    overflow-y: auto !important;
    height: 75%;
    background-color: skyblue;
    padding-bottom: 30px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .num-add{
    padding-right: 20px;
    font-weight: bold;
  }
  .date{
    font-size: small;
  }
  .name{
    font-weight: bold;
  }
  .size-up{
    font-size: x-large;
    margin-right: auto;
  }
  .chat-title {
    display: flex;
    align-items: center;
    margin-left: auto; 
    margin-right: auto;
    text-align: center;
  }
  .exit{
    width: 30%;
    text-align: right;
  }
  .back{
    width: 30%;
  }
  .right-chat{
    margin-left: 20%;
    margin-right: 10px;
  }
  .left-chat{
    margin-right: 20%;
    display: flex;
    align-items: center;
  }
  .profile-image {
    max-width: 50px; /* 이미지의 최대 너비 설정 */
    margin-right: 10px; /* 이미지와 닉네임 간격 설정 */
    margin-left: 10px;
  }
  .friend-info {
    display: flex;
    flex-direction: column;
  }
  .hide{
    visibility: hidden;
  }
</style>