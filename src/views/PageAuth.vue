<script setup lang="ts">
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";

const toast = useToast();

const isLogin = ref<boolean>(true);
const email = ref('');
const password = ref('');
const isLoading = ref<boolean>(false);
const router = useRouter();

const toggleAuth = () => {
  isLogin.value = !isLogin.value;
}

const subtitleText = computed<string>(() => {
  return isLogin.value === true ? "Don't have an account yet?" : "Do you have an account?"
});

const linkAccountText = computed<string>(() => {
  return isLogin.value === true ? "Create it now" : "Sign in"
});

const submitButtonText = computed<string>(() => {
  return isLogin.value === true ? "Sign in" : "Sign up"
});

const signUp = async (): Promise<void> => {
  isLoading.value = true;
  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value);
    await router.push('/');
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({severity: 'error', summary: 'error', detail: error.message, life: 3000})
    }
  } finally {
    isLoading.value = false;
  }
};

const signIn = async (): Promise<void> => {
  isLoading.value = true;
  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value);
    await router.push('/');
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({severity: 'error', summary: 'error', detail: error.message, life: 3000})
    }
  } finally {
    isLoading.value = false;
  }
};

const submitForm = ():void => {
  if (isLogin.value) {
    signIn();
  } else {
    signUp();
  }
};
</script>

<template>
  <app-toast position="bottom-right" />
  <div class="flex justify-content-center p-2">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
        <span class="text-600 font-medium line-height-3">{{ subtitleText }}</span>
        <a class="font-medium no-underline ml-2 cursor-pointer" style="color: rgb(13, 110, 253)" @click="toggleAuth">
          {{ linkAccountText }}
        </a>
      </div>

      <form @submit.prevent="submitForm">
        <label for="email1" class="block text-900 font-medium mb-2">Email</label>
        <app-input-text v-model="email" id="email1" type="email" class="w-full mb-3" />

        <label for="password1" class="block text-900 font-medium mb-2">Password</label>
        <app-input-text v-model="password" id="password1" type="password" class="w-full mb-3" />

        <app-button
            :label="submitButtonText"
            type="submit"
            icon="pi pi-user"
            :loading="isLoading"
            class="w-full"
        ></app-button>
      </form>
    </div>
  </div>
</template>