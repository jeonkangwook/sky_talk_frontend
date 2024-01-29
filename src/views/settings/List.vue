<script setup lang="ts">
import { useSessionStore } from '@/stores/session';
import { useRouter,useRoute } from 'vue-router';

const router = useRouter();

const { clearSession } = useSessionStore()
const logout = async () => {
  const confirmMessage = `로그아웃 하시겠습니까?`;

  if (confirm(confirmMessage)) {
    clearSession();
    await alert("로그아웃되었습니다.");
    router.push("/login");
  }
};

</script>

<template>
  <div style="height: 1000px;">
    SettingView
    <ul class="list-group">
      <li class="list-group-item"><RouterLink to="/Profile">프로필 관리</RouterLink></li>
      <li class="list-group-item"><RouterLink to="/friendSetting">친구 관리</RouterLink></li>
      <li class="list-group-item"><a href="" @click="logout">로그아웃</a></li>
      <li class="list-group-item">A fourth item</li>
      <li class="list-group-item">And a fifth one</li>
    </ul>
  </div>
</template>

<style scoped>
.list-group{
  margin-top: 10px;
}
</style>