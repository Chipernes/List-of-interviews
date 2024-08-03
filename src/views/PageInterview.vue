<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {getFirestore, doc, getDoc, updateDoc} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import type {Interview} from "@/types/Interview";
import dayjs from "dayjs";

const db= getFirestore();
const userStore = useUserStore();
const route = useRoute();

const isLoading = ref<boolean>(true);
const interview = ref<Interview>();

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string);

const getData = async (): Promise<void> => {
  isLoading.value = true;
  const docSnap = await getDoc(docref);
  interview.value = docSnap.data() as Interview;
  isLoading.value = false;
};

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = [];
    }
    interview.value.stages.push({name: '', date: '', description: ''})
  }
};

const deleteStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1);
    }
  }
};

const saveInterview = async (): Promise<void> => {
  isLoading.value = true;

  await updateDoc(docref, {...interview.value});
  await getData();
  isLoading.value = false;
};

const saveDateStage = (index: number) => {
  if (interview.value?.stages && interview.value.stages.length) {
    const date = interview.value.stages[index].date;
    interview.value.stages[index].date = dayjs(date).format('DD.MM.YYYY');
  }
};

onMounted(async () => await getData());
</script>

<template>
  <app-progress class="progress-spinner" v-if="isLoading"/>
  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    <app-card>
      <template #title>Interview in company {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Company</label>
          <app-input-text class="input mb-3" id="company" v-model="interview.company"/>
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Description of the vacancy (link)</label>
          <app-input-text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink"/>
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Contact (name)</label>
          <app-input-text class="input mb-3" id="hrName" v-model="interview.hrName"/>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram username HR</label>
          <app-input-text class="input mb-3" id="contactTelegram" v-model="interview.contactTelegram"/>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp phone HR</label>
          <app-input-text class="input mb-3" id="contactWhatsApp" v-model="interview.contactWhatsApp"/>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Phone number HR</label>
          <app-input-text class="input mb-3" id="contactPhone" v-model="interview.contactPhone"/>
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number input-id="salaryFrom" placeholder="Salary range from" v-model="interview.salaryFrom"/>
          </div>
          <div class="flex-auto">
            <app-input-number input-id="salaryTo" placeholder="Salary range to" v-model="interview.salaryTo"/>
          </div>
        </div>

        <app-button label="Add stage" severity="info" icon="pi pi-plus" class="mb-3" @click="addStage"/>
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Stage name</label>
              <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name"/>
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Stage completion date</label>
              <app-calendar
                  class="input mb-3"
                  :id="`stage-date-${index}`"
                  date-format="dd.mm.yy"
                  v-model="stage.date"
                  @date-select="saveDateStage(index)"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Commentaries</label>
              <app-textarea class="input mb-3" :id="`stage-description-${index}`" rows="5" v-model="stage.description"/>
            </div>
            <app-button severity="danger" label="Delete stage" @click="deleteStage"/>
          </div>
        </template>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio input-id="interviewResult1" name="result" value="Refusal" v-model="interview.result"/>
            <label for="interviewResult1" class="ml-2">Refusal</label>
          </div>
          <div class="flex align-items-center">
            <app-radio input-id="interviewResult2" name="result" value="Offer" v-model="interview.result"/>
            <label for="interviewResult1" class="ml-2">Offer</label>
          </div>
        </div>
        <app-button label="Save" icon="pi pi-save" @click="saveInterview"/>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>