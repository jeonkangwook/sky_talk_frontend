<script setup lang="ts">
  import { inject, ref } from 'vue';
  import axios from 'axios';
  import router from '@/router';
  import { useSessionStore } from '@/stores/session';
  

  const { setSession } = useSessionStore()
  const $axios = inject<any>('$axios')
  const username = ref('');
  const password = ref('');

  const handleSubmit = async () => {
    console.log("zzz",location.origin);
    try {


      // TODO Get, Set session 
      // const res= await $axios.get('https://jsonplaceholder.typicode.com/todos/1')
      // const res= await $axios.get('/api/login')
      // console.log(res)

    const response = await $axios.post('/api/login', {
      username: username.value,
      password: password.value,
    });
      console.log("asd",username.value);
      console.log("asdㅁㄴㅇㅁ",response);
      console.log("asdㅁㄴㅇㅁ",response.data.name);
      if(response.data !== ""){
        console.log('로그인 성공');
        setSession({
          username: response.data.name,
          usermobile: response.data.mobile,
          userno: response.data.userNo,
          userId: response.data.loginId,
          birth: response.data.birth,
          joinDtm: response.data.joinDtm,
          isLoggedIn: true
        });
        router.push("/");
      }else{
        console.log('로그인 실패');
      }

    } catch (error) {
      console.error('문제발생:', error);
    }
  };

  const handleJoin = () => {
    router.push({ name: 'join' });
    console.log('Join button clicked');
    // Redirect to the join page or perform related actions
  };
</script>

<template>
  <div style="height: 1000px;">
    LoginView
    <div>
      <input type="text" placeholder="아이디" v-model="username">
    </div>
    <div>
      <input type="password" placeholder="비밀번호" v-model="password">
    </div>
    <div>
      <button type="button" @click="handleSubmit">로그인</button>
      <button type="button" @click="handleJoin">회원가입</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>