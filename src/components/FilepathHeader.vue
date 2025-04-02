<template>
  <div class="px-5 pt-3 flex gap-3 items-center">
    <Button icon="pi pi-folder" @click="visible = true"></Button>
    <span class="font-bold text-lg">C://PERSONAL/NOTHING</span>
    <Drawer v-model:visible="visible" header="Drawer">
      <Tree v-model:expandedKeys="expandedKeys" :value="storage.list"
            class="w-full" :pt="{
              nodeContent: {
                class:'cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200'
              }
            }">
        <template #default="{node}">
          <b class="cursor-pointer">{{ getFilenameFromPath(node.path) }}</b>
        </template>
      </Tree>
    </Drawer>
  </div>

</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {useStorageStore} from "@/stores/storage.js";

const {fetchFlowchart, storage} = useStorageStore()
const visible = ref(false);
const expandedKeys = ref({})

const getFilenameFromPath = (path) => {
  const splitPath = path.split("\\")
  return splitPath[splitPath.length - 1]
}

onBeforeMount(() => {
  fetchFlowchart()
})
</script>

