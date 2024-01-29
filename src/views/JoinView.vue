<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';

  const $axios = inject<any>('$axios');

  const router = useRouter();
  const loginId = ref('');
  const password = ref('');
  const name = ref('');
  const birth = ref('');
  const mobile = ref('');

  const handleSubmit = async () => {
    console.log("zzz",location.origin);
    try {


      // TODO Get, Set session 
      // const res= await $axios.get('https://jsonplaceholder.typicode.com/todos/1')
      // const res= await $axios.get('/api/login')
      // console.log(res)

    const response = await $axios.post('/api/join', {
      loginId: loginId.value,
      password: password.value,
      name: name.value,
      birth: birth.value,
      mobile: mobile.value,
    });
    console.log(response.data);
      if(response.data === "성공"){
        console.log('가입 성공');
        router.push("/login");
      }else{
        console.log('가입 실패');
      }

    } catch (error) {
      console.error('문제발생:', error);
    }
  };

</script>

<template>
  <div style="height: 1000px;">
    JoinView
    <form @submit.prevent="handleSubmit">
      <div>
        <input type="text" v-model="loginId" placeholder="아이디" class="form-control">
      </div>
      <div>
        <input type="password" v-model="password" placeholder="비밀번호" class="form-control">
      </div>
      <div>
        <input type="name" v-model="name" placeholder="이름" class="form-control">
      </div>
      <div>
        <input type="date" v-model="birth" placeholder="생년월일" class="form-control">
      </div>
      <div>
        <input type="text" v-model="mobile" placeholder="휴대폰 번호" class="form-control">
      </div>
      <button type="submit" class="btn btn-dark">가입</button>
    </form>
  </div>
</template>

<style scoped>
  .form-control{
    margin-top: 5px;
    margin-bottom: 5px;

  }
</style>