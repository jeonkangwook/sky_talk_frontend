<script setup lang="ts">
import { inject, ref,computed,watch,onMounted  } from 'vue';
import { useSessionStore } from '@/stores/session';

const sessionStore = useSessionStore()

const loginId = ref('');
const $axios = inject<any>('$axios');
const nickname = ref(null);
const imgPath = ref(null);
const status = ref(null);
const friUserNo = ref('');
const myUserNo = ref(sessionStore.userno);
const friendList = ref<Friend[]>([]);
const notFri = ref(false);
const double = ref<Friend | null>(null);
const doubleFri = ref(false);


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
      console.log(response);
      console.log(friendList.value);
    } catch (error) {
      console.error('문제 발생:', error);
    }
});

const handleFindFriend = async () => {
  console.log(loginId.value);
    try {
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
    console.log("바껴라",double.value);
    console.log("바껴라",response.data);
    console.log("바껴라",doubleFri.value);
    console.log("바껴라222",notFri.value);
    } catch (error) {
      console.error('문제발생:', error);
    }
};

const handleAddFriend = async () => {
  console.log('fri',friUserNo.value);
  console.log('my',myUserNo.value);
  console.log('session',sessionStore);
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
    console.log(res);
    console.log(friendList.value);
    console.log("response",response.data);
    console.log(response);
    } catch (error) {
      console.error('문제발생:', error);
    }
};

</script>

<template>
  <div>
    FriendListView
    <div>
      <p>프로필 관리</p>
      <input type="text" placeholder="이름이나 아이디" v-model="loginId">
      <button type="button" @click="handleFindFriend">찾기</button>
    </div>
    <div>
      <p>친구찾기</p>
      <input type="text" placeholder="이름이나 아이디" v-model="loginId">
      <button type="button" @click="handleFindFriend">찾기</button>
    </div>
    <div>
      <!-- API로부터 받은 데이터를 화면에 표시 -->
      <p>{{ nickname }}</p>
      <p>{{ status }}</p>
      <p>{{ imgPath }}</p>
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
      <div v-for="friend in friendList" :key="friend.userNo">
        <!-- 친구의 정보를 표시하는 예시 -->
        <p>{{ friend.nickname }}</p>
        <p>{{ friend.status }}</p>
        <p>{{ friend.imgPath }}</p>
        <!-- 필요한 친구 정보를 출력하도록 수정 -->
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>