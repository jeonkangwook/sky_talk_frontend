import { ref } from 'vue'
import { defineStore } from 'pinia'

interface ISessionInfo {
  username: string;
  usermobile: string;
  userno: number;
  userId: string;
  birth: string;
  joinDtm: string;
  isLoggedIn: boolean;
}

export const useSessionStore = defineStore('session', () => {
  const username = ref('')
  const usermobile = ref('')
  const userno = ref<number>(0)
  const userId = ref('')
  const birth = ref('')
  const joinDtm = ref('')
  const isLoggedIn = ref(false)

  function setSession(params: ISessionInfo) {
    username.value = params.username
    usermobile.value = params.usermobile
    userno.value = params.userno
    userId.value = params.userId
    birth.value = params.birth
    joinDtm.value = params.joinDtm
    isLoggedIn.value = !!username.value
  }

  function clearSession() {
    username.value = ''
    usermobile.value = ''
    isLoggedIn.value = false
  }

  return { username, usermobile, isLoggedIn,userno, userId,setSession, clearSession }
})
