<script setup lang="ts">
import {ref, onMounted} from "vue";
import type {Interview} from "@/types/Interview";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import {useConfirm} from "primevue/useconfirm";

const userStore = useUserStore();
const db = getFirestore();
const confirm = useConfirm();

const interviews = ref<Interview[]>([]);
const isLoading = ref<boolean>(true);

const getAllInterviews = async <T extends Interview>(): Promise<T[]> => {
  const getData = query(collection(db, `users/${userStore.userId}/interviews`), orderBy('createdAt', 'desc'));

  const listDocs = await getDocs(getData);

  return listDocs.docs.map((doc) => doc.data() as T);
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: "Do you want to delete an interview?",
    header: 'Delete an interview',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true;
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id));

      const listInterviews: Array<Interview> = await getAllInterviews();
      interviews.value = [...listInterviews];

      isLoading.value = false;
    }
  })
};

onMounted(async () => {
  const listInterviews: Array<Interview> =  await getAllInterviews();
  interviews.value = [...listInterviews];

  isLoading.value = false;
});

</script>

<template>
  <app-dialog/>
  <app-progress class="progress-spinner" v-if="isLoading"/>
  <app-message
      v-else-if="!isLoading && !interviews.length"
      severity="info"
  >
    The list is empty (no interviews have been added)
  </app-message>
  <div v-else>
    <h1>List of interviews</h1>
    <app-datatable :value="interviews">
      <app-column field="company" header="Company"></app-column>
      <app-column field="hrName" header="HR name"></app-column>
      <app-column field="vacancyLink" header="Vacancy Link">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
        </template>
      </app-column>
      <app-column header="Contacts">
        <template #body="slotProps">
          <div class="contacts">
            <a
                v-if="slotProps.data.contactTelegram"
                :href="`https://t.me/${slotProps.data.contactTelegram}`"
                target="_blank"
                class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
                v-if="slotProps.data.contactWhatsApp"
                :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
                target="_blank"
                class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>

            <a
                v-if="slotProps.data.contactPhone"
                :href="`tel:${slotProps.data.contactPhone}`"
                target="_blank"
                class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info"/>
            </router-link>
            <app-button icon="pi pi-trash" severity="danger" @click="confirmRemoveInterview(slotProps.data.id)"/>
          </div>
        </template>
      </app-column>
    </app-datatable>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>