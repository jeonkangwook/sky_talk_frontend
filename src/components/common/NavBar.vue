<script setup lang="ts">

</script>

<template>
  <nav class="nav-bar">
    <ul class="nav-list">
      <li class="nav-item">
        <RouterLink to="/">Friends</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/chat">Chat</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/settings">Settings</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-bar {
  width: 100%;
  height: 60px;
}

.nav-list {
  display: flex;
  height: 100%;
}

.nav-item {
  flex-basis: 33.333%;
  height: 100%;
}

.nav-item > a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>