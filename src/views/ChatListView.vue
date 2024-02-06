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
    const month = String(timestamp[1]).padStart(2, '0');
    const day = String(timestamp[2]).padStart(2, '0');
    const hours = String(timestamp[3]).padStart(2, '0');
    const minutes = String(timestamp[4]).padStart(2, '0');

    return `${month}-${day} ${hours}:${minutes}`;
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
  <!-- <div v-for="room in chatRoomList" :key="room.chatRoomNo" @click="chatStart(room.userNo,room.sendUserNo)">
    <div v-if="room.exclusiveFriendData">
      <img :src="getLocalImagePath(room.exclusiveFriendData.imgPath)" alt="프로필 사진" v-if="room.exclusiveFriendData.imgPath">
      <img src="../assets/images/noimage.png" alt="프로필 사진" v-else class="profile-image">
      <div class="friend-info">
        <p>{{ room.exclusiveFriendData.nickName }}</p>
        <p>{{ room.content }}</p>
        <p>{{ formatTimestamp(room.chatDtm) }}</p>
        <div v-if="room.readYn != '0' && room.userNo == UserNo" class="badge bg-danger">{{ room.readYn }}</div>
      </div>
    </div>
    <hr>
  </div> -->
  <div v-for="room in chatRoomList" :key="room.chatRoomNo" @click="chatStart(room.userNo,room.sendUserNo)" class="chat-room">
    <div v-if="room.exclusiveFriendData" class="chat-content">
      <div class="profile-info">
        <img :src="getLocalImagePath(room.exclusiveFriendData.imgPath)" alt="프로필 사진" v-if="room.exclusiveFriendData.imgPath" class="profile-image">
        <img src="../assets/images/noimage.png" alt="프로필 사진" v-else class="profile-image">
        <div class="friend-info">
          <p>{{ room.exclusiveFriendData.nickName }}</p>
          <p>{{ room.content }}</p>
        </div>
      </div>
      <div class="date-info">
        <div v-if="room.readYn != '0' && room.userNo == UserNo" class="badge bg-danger read">{{ room.readYn }}</div>
        <p>{{ formatTimestamp(room.chatDtm) }}</p>
      </div>
    </div>
    <hr>
  </div>
</template>

<style scoped>
img {
  width: 60px; /* 이미지의 너비를 200px로 설정 */
  height: 50px;
  border-radius: 70%;
  overflow: hidden;
  object-fit: cover;
}
.friend-info {
    flex-grow: 1; /* 이름 부분이 남은 공간을 모두 차지하도록 설정 */
}
.chat-room {
  display: flex;
  align-items: center;
  position: relative;
}

.chat-content {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ced4da;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-image {
  max-width: 50px; /* 이미지의 최대 너비 설정 */
  margin-right: 10px; /* 이미지와 닉네임 간격 설정 */
}

.friend-info {
  display: flex;
  flex-direction: column;
}

.date-info {
  position: absolute; /* 날짜를 절대 위치로 설정합니다. */
  bottom: 0; /* 하단에 위치하도록 설정합니다. */
  right: 10px; /* 우측에 위치하도록 설정합니다. */
  font-size: small;
}
</style>