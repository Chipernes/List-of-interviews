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
  where
} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import {useConfirm} from "primevue/useconfirm";

const userStore = useUserStore();
const db = getFirestore();
const confirm = useConfirm();

const interviews = ref<Interview[]>([]);
const isLoading = ref<boolean>(true);
const selectedFilterResult = ref<string>('');

const submitFilter = async (): Promise<void> => {
  isLoading.value = true;
  const listInterviews: Array<Interview> = await getAllInterviews(true);
  interviews.value = listInterviews;
  isLoading.value = false;
}

const clearFilter = async (): Promise<void> => {
  isLoading.value = true;
  const listInterviews: Array<Interview> = await getAllInterviews();
  interviews.value = listInterviews;
  isLoading.value = false;
}

const getAllInterviews = async <T extends Interview>(isFilter?: boolean): Promise<T[]> => {
  let getData;

  if (isFilter) {
    getData = query(
        collection(db, `users/${userStore.userId}/interviews`),
        orderBy('createdAt', 'desc'),
        where('result', '==', selectedFilterResult.value)
    )
  } else {
    getData = query(
        collection(db, `users/${userStore.userId}/interviews`),
        orderBy('createdAt', 'desc')
    )
  }

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
      interviews.value = listInterviews;

      isLoading.value = false;
    }
  })
};

onMounted(async () => {
  const listInterviews: Array<Interview> =  await getAllInterviews();
  interviews.value = listInterviews;

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
    <div class="flex align-items-center mb-4">
      <div class="flex align-items-center mr-2">
        <app-radio
            input-id="interviewResult2"
            name="result"
            value="Refusal"
            v-model="selectedFilterResult"
        />
        <label for="interviewResult1" class="ml-2">Refusal</label>
      </div>
      <div class="flex align-items-center mr-2">
        <app-radio
            input-id="interviewResult2"
            name="result"
            value="Offer"
            v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="ml-2">Offer</label>
      </div>
      <app-button class="mr-2" label="Apply" @click="submitFilter" :disabled="!selectedFilterResult"/>
      <app-button class="mr-2" label="Reset" severity="danger" @click="clearFilter" :disabled="!selectedFilterResult"/>
    </div>
    <app-datatable :value="interviews">
      <app-column field="company" header="Company"></app-column>
      <app-column field="hrName" header="HR name"></app-column>
      <app-column field="vacancyLink" header="Vacancy Link">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Vacancy link</a>
        </template>
      </app-column>
      <app-column header="Stages completed">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">Not filled</span>
          <div v-else class="interview-stages">
            <app-badge
                v-for="(stage, index) in slotProps.data.stages"
                :key="index"
                :value="index + 1"
                rounded
                severity="info"
                v-tooltip.top="stage.name"
            />
          </div>
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
      <app-column header="Salary range">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom || !slotProps.data.salaryTo">Not filled</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>
      <app-column header="Result">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Not filled</span>
          <template v-else>
            <app-badge
                :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
                :value="slotProps.data.result === 'Offer' ? 'Offer' : 'Refusal'"
            />
          </template>
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