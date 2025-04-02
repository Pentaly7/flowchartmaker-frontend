<template>
<div class="px-5 pt-3 flex gap-3 items-center">
  <Button icon="pi pi-folder"  @click="visible = true" ></Button>
  <span class="font-bold text-lg">C://PERSONAL/NOTHING</span>
  <Drawer v-model:visible="visible" header="Drawer">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </Drawer>
</div>
</template>
<script setup>
import { ref } from "vue";
const visible = ref(false);
</script>

