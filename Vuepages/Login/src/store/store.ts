// store.ts
import { reactive, toRefs } from 'vue';

const state = reactive({
  email: '',
  code: '',
  password: '',
  confirmpassword: '',
  Authorization: ''
});

export default function useStore() {
  return toRefs(state);
}

export {};