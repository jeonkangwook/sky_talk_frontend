<script setup lang="ts">
import { inject, ref,computed,watch,onMounted  } from 'vue';
import { useSessionStore } from '@/stores/session';

const sessionStore = useSessionStore()

// const loginId = ref('');
const $axios = inject<any>('$axios');
const nickname = ref(null);
const imgPath = ref(null);
const status = ref(null);
// const friUserNo = ref('');
const myUserNo = ref(sessionStore.userno);
const profile = ref<Friend[]>([]);
// const notFri = ref(false);
// const double = ref<Friend | null>(null);
// const doubleFri = ref(false);


interface Friend {
  userNo: number;
  nickname: string;
  imgPath: string;
  status: string;
}

onMounted(async () => {
    try {
      const response = await $axios.get('/api/profile', {
        params: {
          userNo: myUserNo.value
        }
      });
      profile.value = response.data;
      nickname.value = response.data.nickname; // API로부터 받은 데이터를 변수에 저장
      imgPath.value = response.data.imgPath; // API로부터 받은 데이터를 변수에 저장
      status.value = response.data.status; // API로부터 받은 데이터를 변수에 저장
    } catch (error) {
      console.error('문제 발생:', error);
    }
});

function getLocalImagePath(imgPath: string | undefined): string {
    if (imgPath) {
      return `http://localhost:8080/getImage?path=${imgPath}`;
    }
    return ''; // 경로가 없는 경우 빈 문자열 반환하거나 다른 처리를 할 수 있습니다.
};
</script>

<template>
  <div>
    프로필 관리
    <div>
      <router-link to="/ProfileCreate">프로필 등록</router-link>
    </div>
    <div>
      <!-- API로부터 받은 데이터를 화면에 표시 -->
      <p v-if="nickname">이름 : {{ nickname }}</p>
      <p v-else>프로필을 등록해주세요.</p>
      <p v-if="status">상태 메시지 : {{ status }}</p>
      <p v-else>프로필을 등록해주세요.</p>
      <img :src="getLocalImagePath(imgPath)" alt="프로필 사진" v-if="imgPath">
      <p v-else>프로필 사진을 등록해주세요.</p>
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 100px;
  max-height: 100px;
}
</style>