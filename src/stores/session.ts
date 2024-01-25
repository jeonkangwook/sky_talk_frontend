import { ref, computed } from 'vue'
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

type Ref<T = any> = import('vue').Ref<T>;

export const useSessionStore = defineStore('session', () => {
  const username = ref('')
  const usermobile = ref('')
  const userno = ref<number>(0)
  const userId = ref('')
  const birth = ref('')
  const joinDtm = ref('')
  const isLoggedIn = ref(false)

  // 세션 스토리지 이용할 때
  const loadSession = () => {
    const sessionData = sessionStorage.getItem('sessionData');
    if (sessionData) {
      const parsedData: ISessionInfo = JSON.parse(sessionData);
      setSession(parsedData);
    }
  };

  function setSession(params: ISessionInfo) {
    username.value = params.username
    usermobile.value = params.usermobile
    userno.value = params.userno
    userId.value = params.userId
    birth.value = params.birth
    joinDtm.value = params.joinDtm
    isLoggedIn.value = !!username.value

    // 세션스토리지에 저장할 떄
    sessionStorage.setItem('sessionData', JSON.stringify(params));
  }

  function clearSession() {
    userId.value = ''
    username.value = ''
    usermobile.value = ''
    userno.value = 0
    isLoggedIn.value = false

    sessionStorage.removeItem('sessionData');

    // 로컬 스토리지 이용할 때 localStorage.removeItem('session'); 가 안 통한다. 하지만 데이터는 공백으로 처리해주니 괜찮을거같다.
  }

  const sessionInfo: Ref<ISessionInfo> = computed(() => ({
    username: username.value,
    usermobile: usermobile.value,
    userno: userno.value,
    userId: userId.value,
    birth: birth.value,
    joinDtm: joinDtm.value,
    isLoggedIn: isLoggedIn.value,
  }));

  // 세션 스토리지 이용할 때
  loadSession();

  return { username, usermobile, isLoggedIn,userno, userId,setSession, clearSession,sessionInfo }
},
// 로컬스토리지에 저장할 때
// {persist:true},


)
export default useSessionStore;

