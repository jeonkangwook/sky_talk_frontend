<script setup lang="ts">
import { inject, ref,computed,watch,onMounted  } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore()

const $axios = inject<any>('$axios');
const nickname = ref(null);
const imgPath = ref(null);
const status = ref(null);
const myUserNo = ref(sessionStore.userno);
const friendList = ref<Friend[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref('');
const router = useRouter();



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
      friendList.value = response.data;
      nickname.value = response.data.nickname; // API로부터 받은 데이터를 변수에 저장
      imgPath.value = response.data.imgPath; // API로부터 받은 데이터를 변수에 저장
      status.value = response.data.status; // API로부터 받은 데이터를 변수에 저장
      console.log(response);
      console.log(friendList.value);
    } catch (error) {
      console.error('문제 발생:', error);
    }
});
const onSubmit = async () => {
  
  try {
    // API로 프로필 업데이트
    await $axios.post('/api/updateProfile', {
      userNo: myUserNo.value,
      nickname: nickname.value,
      status: status.value
    });
    if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0) {
      const formData = new FormData();
      formData.append('image', fileInput.value.files[0]);
      console.log("form",fileInput.value.files[0]);                                                                                                                               
      try {
        // API로 프로필 업데이트
        await $axios.post('/api/updateImage?userNo=' + myUserNo.value, formData);
      } catch (error) {
        console.error('저장 중 문제 발생:', error);
      }
    } 
    await alert("저장되었습니다.");
  } catch (error) {
    console.error('저장 중 문제 발생:', error);
  }
  router.push('/Profile');
};
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.files) {
    const files = target.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target) {
          imageUrl.value = ev.target.result as string;
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }
};
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
    <form @submit.prevent="onSubmit">
      <div>
        <input type="text" placeholder="이름" v-model="nickname">
      </div>
      <div>
        <input type="text" placeholder="상태 메시지" v-model="status">
      </div>
      <div>
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image">
        <img :src="getLocalImagePath(imgPath)" alt="프로필 사진" v-if="imgPath" v-show="!imageUrl">
        <input type="file" ref="fileInput" @change="handleFileChange">
      </div>
      <button type="submit">저장</button>
    </form>
  </div>
</template>

<style scoped>
img {
  max-width: 100px;
  max-height: 100px;
}
</style>