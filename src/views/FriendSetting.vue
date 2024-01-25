<script setup lang="ts">
import { inject, ref,computed,watch,onMounted  } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';

const $axios = inject<any>('$axios');
const sessionStore = useSessionStore();
const myUserNo = ref(sessionStore.userno);
const friendList = ref<Friend[]>([]);
const router = useRouter();
const currentRoute = router.currentRoute.value;

interface Friend {
  userNo: number;
  nickname: string;
  imgPath: string;
  status: string;
  friCode: number;
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

function reloadCurrentPage() {
  const currentPath = router.currentRoute.value.path;
  const currentQuery = router.currentRoute.value.query;

  // Query Parameters를 유지하면서 현재 페이지로 이동
  router.push({
    path: currentPath,
    query: currentQuery
  });
}


function getLocalImagePath(imagePath: string | undefined): string {
    if (imagePath) {
      return `http://localhost:8080/getImage?path=${imagePath}`;
    }
    return ''; // 경로가 없는 경우 빈 문자열 반환하거나 다른 처리를 할 수 있습니다.
}

async function friHidden(userNo: number) {
  const confirmMessage = `친구을 숨기시겠습니까?`;
  if (confirm(confirmMessage)) {
    const res = await $axios.post('/api/friSetting', {
        friCode : 1,
        userNo : myUserNo.value,
        friUserNo : userNo
    });
    await alert("친구가 숨김되었습니다.");
  }
  router.go(0);
     
}

async function friDelete(userNo: number) {
  const confirmMessage = `친구을 차단하시겠습니까?`;
  if (confirm(confirmMessage)) {
    const res = await $axios.post('/api/friSetting', {
        friCode : 2,
        userNo : myUserNo.value,
        friUserNo : userNo
    });
    await alert("친구가 차단되었습니다.");
  }
  router.go(0);
     
}

async function friRollback(userNo: number) {
  const confirmMessage = `복구하시겠습니까?`;
  if (confirm(confirmMessage)) {
    const res = await $axios.post('/api/friSetting', {
        friCode : 0,
        userNo : myUserNo.value,
        friUserNo : userNo
    });
    await alert("복구가 완료되었습니다.");
  }
  router.go(0);
     
}

</script>

<template>
  <div>
    친구관리
    <hr>
    <div v-for="friend in friendList" :key="friend.userNo">
        <div v-if="friend.nickname">
            <!-- 친구의 정보를 표시하는 예시 -->
            <p>이름:{{ friend.nickname }}</p>
            <p>상태 메시지:{{ friend.status }}</p>
            <img :src="getLocalImagePath(friend.imgPath)" alt="프로필 사진" v-if="friend.imgPath">
            <div v-if="friend.friCode == 1">
                <p>숨김상태</p>
                <button @click="friRollback(friend.userNo)" class="btn btn-success">복구</button>
            </div>
            <div v-if="friend.friCode == 2">
                <p >차단상태</p>
                <button @click="friRollback(friend.userNo)" class="btn btn-success">복구</button>
            </div>
            <div v-if="friend.friCode != 1">
                <button @click="friHidden(friend.userNo)" class="btn btn-warning">숨김</button>
            </div>
            <div v-if="friend.friCode != 2">
                <button @click="friDelete(friend.userNo)" class="btn btn-danger">차단</button>
            </div>
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