<script setup lang="ts">
import { inject, ref,computed,watch,onMounted ,onBeforeUnmount } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter,useRoute } from 'vue-router';
import { io } from 'socket.io-client';


const $axios = inject<any>('$axios');
const router = useRouter();
const route = useRoute();
const chatRoomList = ref<room[]>([]);
const sessionStore = useSessionStore();
const UserNo = ref(sessionStore.userno);
const friUserNo = ref(0);
const friendList = ref<Friend[]>([]);

// interface room {
//   content: string;
//   chatDtm: string;
//   nickName: String;
//   imgPath: string;
//   chatRoomNo: number;
//   userNo: number;
//   readYn: string;
//   sendUserNo: number;
// }

interface room {
  content: string;
  chatDtm: string;
  nickName: String;
  imgPath: string;
  chatRoomNo: number;
  userNo: number;
  readYn: string;
  sendUserNo: number;
  exclusiveFriendData?: {
    imgPath: string;
    nickName: string;
    userNo: number;
  };
}

interface Friend {
  userNo: number;
  nickname: string;
  imgPath: string;
  status: string;
}

const socket = io('http://localhost:3000', { 
  path: '/socket.io',
  transports: ['websocket', 'polling'] ,
  withCredentials: true,
});

const charList = async () => {
  const res = await $axios.get('/api/chatRoomList', {params: 
    {
      userNo : UserNo.value,
    }
  });
  chatRoomList.value = res.data;

  const response = await $axios.get('/api/friendList', {
    params: {
      userNo: UserNo.value
    }
  });
  friendList.value = response.data;

  const currentUserNo = UserNo.value;

  // 현재 사용자가 아닌 친구 목록을 필터링합니다.
  const otherFriends = friendList.value.filter((friend) => friend.userNo != currentUserNo);

  // 친구 목록과 채팅방 목록을 비교하여 필요한 정보를 추가합니다.
  const exclusiveFriendData = otherFriends.filter((friend) =>
    chatRoomList.value.some((chatRoom) => chatRoom.userNo === friend.userNo || chatRoom.sendUserNo === friend.userNo)
  );

  // chatRoomList 배열의 각 요소에 exclusiveFriendData 속성을 추가합니다.
  chatRoomList.value.forEach((chatRoom) => {
    const matchingFriend = exclusiveFriendData.find(
      (friend) => friend.userNo === chatRoom.userNo || friend.userNo === chatRoom.sendUserNo
    );
    // matchingFriend이 존재할 때만 데이터를 추가합니다.
    if (matchingFriend) {
      // chatRoomList.imgPath = 
      chatRoom.exclusiveFriendData = {
        imgPath: matchingFriend.imgPath,
        nickName: matchingFriend.nickname,
        userNo: matchingFriend.userNo,
      };
    }
  });
};

socket.on('message', (data) => {
    console.log('chat-message event received', data);
    // 수신된 메시지 처리
    // chatList를 업데이트하거나 다른 로직 수행
    charList();
});

const formatTimestamp = (timestamp: string) => {
    const day = String(timestamp[2]).padStart(2, '0');
    const hours = String(timestamp[3]).padStart(2, '0');
    const minutes = String(timestamp[4]).padStart(2, '0');

    return `${day}일 ${hours}:${minutes}`;
};

onMounted(async () => {
  const res = await $axios.get('/api/chatRoomList', {params: 
    {
      userNo : UserNo.value,
    }
  });
  chatRoomList.value = res.data;

  const response = await $axios.get('/api/friendList', {
    params: {
      userNo: UserNo.value
    }
  });
  friendList.value = response.data;

  const currentUserNo = UserNo.value;

  // 현재 사용자가 아닌 친구 목록을 필터링합니다.
  const otherFriends = friendList.value.filter((friend) => friend.userNo != currentUserNo);

  // 친구 목록과 채팅방 목록을 비교하여 필요한 정보를 추가합니다.
  const exclusiveFriendData = otherFriends.filter((friend) =>
    chatRoomList.value.some((chatRoom) => chatRoom.userNo === friend.userNo || chatRoom.sendUserNo === friend.userNo)
  );

  // chatRoomList 배열의 각 요소에 exclusiveFriendData 속성을 추가합니다.
  chatRoomList.value.forEach((chatRoom) => {
    const matchingFriend = exclusiveFriendData.find(
      (friend) => friend.userNo === chatRoom.userNo || friend.userNo === chatRoom.sendUserNo
    );
    // matchingFriend이 존재할 때만 데이터를 추가합니다.
    if (matchingFriend) {
      // chatRoomList.imgPath = 
      chatRoom.exclusiveFriendData = {
        imgPath: matchingFriend.imgPath,
        nickName: matchingFriend.nickname,
        userNo: matchingFriend.userNo,
      };
    }
  });
});

function getLocalImagePath(imagePath: string | undefined): string {
    if (imagePath) {
      return `http://localhost:8080/getImage?path=${imagePath}`;
    }
    return ''; // 경로가 없는 경우 빈 문자열 반환하거나 다른 처리를 할 수 있습니다.
}

function chatStart(userNo: number,sendUserNo: number) {
  const confirmMessage = `채팅을 시작하시겠습니까?`;
  if(UserNo.value==userNo){
    userNo = sendUserNo;
  }

  if (confirm(confirmMessage)) {
    console.log("gasd", userNo);
    router.push({
      name: 'chatRoom',
      query: {
        friUserNo: userNo,
      },
    });
  }

}

</script>

<template>
  <div>
    대화목록
  </div>
  <hr>
  <div v-for="room in chatRoomList" :key="room.chatRoomNo" @click="chatStart(room.userNo,room.sendUserNo)">
    <div v-if="room.exclusiveFriendData">
      <img :src="getLocalImagePath(room.exclusiveFriendData.imgPath)" alt="프로필 사진" v-if="room.exclusiveFriendData.imgPath">
      <p>{{ room.exclusiveFriendData.nickName }}</p>
      <p>{{ room.content }}</p>
      <p>{{ formatTimestamp(room.chatDtm) }}</p>
      <!-- 추가적인 친구 정보를 여기에 표시 -->
    </div>
    <div v-if="room.readYn == 'N' && room.userNo == UserNo">1</div>
    <!-- <p><img :src="getLocalImagePath(room.imgPath)" alt="프로필 사진" v-if="room.imgPath"></p>
    <p>{{ room.nickName }}</p>
    <p>{{ room.content }}</p>
    <p>{{ formatTimestamp(room.chatDtm) }}</p> -->
    <hr>
  </div>


</template>

<style scoped>
img {
  max-width: 50px;
  max-height: 50px;
}
</style>