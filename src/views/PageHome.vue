<script setup lang="ts">
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {getAuth} from "firebase/auth";
import {getFirestore, setDoc, doc} from "firebase/firestore";
import type {Interview} from "@/types/Interview";
import {v4 as uuidv4} from 'uuid';

const db = getFirestore();
const router = useRouter();

const company = ref<string>('');
const vacancyLink = ref<string>('');
const hrName = ref<string>('');
const contactTelegram = ref<string>('');
const contactWhatsApp = ref<string>('');
const contactPhone = ref<string>('');
const loading = ref<boolean>(false);

const addNewInterview = async (): Promise<void> => {
  loading.value = true;

  const payload: Interview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date()
  }

  const userId = getAuth().currentUser?.uid;
  if (userId) {
    await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload).then(() => {
      router.push('/list');
    });
  }

  loading.value = false;
};

const disabledSaveButton = computed<boolean>(() => {
  return !(company.value && vacancyLink.value && hrName.value)
});
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>New interview</template>
      <template #content>
        <app-input-text class="input mb-3" placeholder="Company" v-model="company" />
        <app-input-text
            v-model="vacancyLink"
            class="input mb-3"
            placeholder="Job Description (link)"
        />
        <app-input-text v-model="hrName" class="input mb-3" placeholder="Contact (name)" />
        <app-input-text
            v-model="contactTelegram"
            class="input mb-3"
            placeholder="Telegram username HR"
        />
        <app-input-text
            v-model="contactWhatsApp"
            class="input mb-3"
            placeholder="WhatsApp phone HR"
        />
        <app-input-text v-model="contactPhone" class="input mb-3" placeholder="HR Phone" />
        <app-button
            @click="addNewInterview"
            label="Create an interview"
            :disabled="disabledSaveButton"
            :loading="loading"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
}
.content-interview {
  max-width: 600px;
  margin: auto;
}
</style>
