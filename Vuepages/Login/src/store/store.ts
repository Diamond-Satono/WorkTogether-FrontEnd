// store.ts 内存存储（临时）
import { reactive, toRefs ,watch} from 'vue';

const state = reactive({
  email: '',
  code: '',
  password: '',
  confirmpassword: '',
  Authorization: localStorage.getItem('Authorization') || ''
});

export default function useStore() {


  return toRefs(state);
}

export {};