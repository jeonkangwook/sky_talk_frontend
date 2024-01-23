<script setup lang="ts">
import { inject, ref,computed,watch,onMounted  } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore()

const loginId = ref('');
const $axios = inject<any>('$axios');
const nickname = ref(null);
const imgPath = ref(null);
const status = ref(null);
const friUserNo = ref('');
const myUserNo = ref(sessionStore.userno);
const userloginid = ref(sessionStore.userId);
const friendList = ref<Friend[]>([]);
const notFri = ref(false);
const double = ref<Friend | null>(null);
const doubleFri = ref(false);
const router = useRouter();


interface Friend {
  userNo: number;
  nickname: string;
  imgPath: string;
  status: string;
}

onMounted(async () => {
    try {
      const response = await $axios.get('/api/friendList', {
        params: {
          userNo: myUserNo.value
        }
      });
      friendList.value = response.data;
    } catch (error) {
      console.error('문제 발생:', error);
    }
});

const handleFindFriend = async () => {
  console.log(loginId.value);
    try {
      if(loginId.value!==userloginid.value){
        const response = await $axios.get('/api/findFriend', {
          params: {
            loginId: loginId.value
          }
        });
        double.value = friendList.value.find(
          (item) => item.userNo === response.data.userNo
        )|| null;
        if(double.value!==null){
          doubleFri.value = true;
        }else{
          doubleFri.value = false;
        }
        nickname.value = response.data.nickname; // API로부터 받은 데이터를 변수에 저장
        imgPath.value = response.data.imgPath; // API로부터 받은 데이터를 변수에 저장
        status.value = response.data.status; // API로부터 받은 데이터를 변수에 저장
        friUserNo.value = response.data.userNo;
        if(response.data===''){
          notFri.value = true;
        }else{
          notFri.value = false;
        }
      }else{
        return alert("본인입니다.");
      }
    } catch (error) {
      console.error('문제발생:', error);
    }
};

const handleAddFriend = async () => {
    try {
      const response = await $axios.post('/api/addFriend', {
        friUserNo: friUserNo.value,
        myUserNo: myUserNo.value
    });
    const res = await $axios.get('/api/friendList', {
      params: {
        userNo: myUserNo.value
      }
    });
    friendList.value = res.data;
    doubleFri.value = true;
    } catch (error) {
      console.error('문제발생:', error);
    }
};

function getLocalImagePath(imagePath: string | undefined): string {
    if (imagePath) {
      return `http://localhost:8080/getImage?path=${imagePath}`;
    }
    return ''; // 경로가 없는 경우 빈 문자열 반환하거나 다른 처리를 할 수 있습니다.
}

// const chatStart = async (userNo: number) => {
//   router.push({ name: 'chatRoom', params: { userNo } });
//   console.log("ccc");
// };
function chatStart(userNo: number) {
  const confirmMessage = `채팅을 시작하시겠습니까?`;

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
    FriendListView
    <div>
      <RouterLink to="/Profile">프로필 관리</RouterLink>
      <br>
      <RouterLink to="/chatChat">소켓</RouterLink>
    </div>
    <div>
      <p>친구찾기</p>
      <input type="text" placeholder="이름이나 아이디" v-model="loginId">
      <button type="button" @click="handleFindFriend">찾기</button>
    </div>
    <div v-if="nickname">
      <!-- API로부터 받은 데이터를 화면에 표시 -->
      <p>이름 : {{ nickname }}</p>
      <p>상태 메시지 : {{ status }}</p>
      <img :src="getLocalImagePath(imgPath)" alt="프로필 사진" v-if="imgPath">
      <button type="button" v-show="nickname" :disabled="doubleFri" @click="handleAddFriend">친구추가</button>
    </div>
    <div v-if="doubleFri">
      <p>이미 등록된 친구입니다.</p>
    </div>
    <div v-else-if="notFri">
      <p>찾는 친구가 없습니다.</p>
    </div>
    <div>
      <p>친구 리스트</p>
      <hr>
      <div v-for="friend in friendList" :key="friend.userNo" @click="chatStart(friend.userNo)">
        <!-- 친구의 정보를 표시하는 예시 -->
        <p>이름:{{ friend.nickname }}</p>
        <p>상태 메시지:{{ friend.status }}</p>
        <img :src="getLocalImagePath(friend.imgPath)" alt="프로필 사진" v-if="friend.imgPath">
        <hr>
      </div>
    </div>

  </div>
</template>

<style scoped>
img {
  max-width: 100px;
  max-height: 100px;
}
</style>