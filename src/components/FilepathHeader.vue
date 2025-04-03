<template>
  <div class="px-5 pt-3 flex gap-3 items-center">
    <Button icon="pi pi-folder" @click="visible = true"></Button>
    <span class="font-bold text-lg">C://PERSONAL/NOTHING</span>
    <Drawer v-model:visible="visible" header="Project Browser" @contextmenu="onRightClick($event, '')">
      <Tree v-model:expandedKeys="expandedKeys" :value="storage.list"
            class="w-full" :pt="{
              root:{
                class:'!p-0'
              },
              nodeContent: {
                class:'p-ripple cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200 !px-0  flex relative w-full h-full',
              },
              nodeLabel:{
                class:' flex items-center gap-2'
              }
            }">
        <template #nodeicon="{node}">
          <!-- VERY NOT OPTIMAL, BUT KEEP IT THIS WAY FOR NOW -->
          <Button
              class="!absolute w-full h-full bg-transparent"
              variant="text"
              @click="onTreeContentClick(node)"
              @contextmenu="onRightClick($event, node)"
          />
        </template>
        <template #default="{node}">
          <span :class="getIcon(node)"/>
          <p class="cursor-pointer font-semibold">{{
              node.key
            }}</p>
        </template>
      </Tree>
    </Drawer>
    <ContextMenu ref="menu" :model="items">
      <template #item="{ item }">
        <Button v-if="(item.label ==='New File' && rightClickNode) || (item.label ==='New Folder')"
                class="p-1 cursor-pointer"
                unstyled>
          <span :class="item.icon"/>
          <span class="ml-2">{{ item.label }}</span>
        </Button>

      </template>
    </ContextMenu>

    <!--DIALOG SECTION-->
    <Dialog v-model:visible="dialogVisible" modal :header="`Create New ${dialogType}`" :style="{ width: '25rem' }">
      <form @submit.prevent="createEntry">
        <div class="flex items-center gap-4 mb-4">
          <InputText class="flex-auto"/>
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="dialogVisible = false"></Button>
          <Button type="submit" label="Create"></Button>
        </div>
      </form>
    </Dialog>
  </div>

</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {useStorageStore} from "@/stores/storage.js";

const {fetchFlowchart, storage} = useStorageStore()
const visible = ref(false);
const dialogVisible = ref(false)
const dialogType = ref('')
const expandedKeys = ref({})

const rightClickNode = ref()
const menu = ref();
const items = ref([
  {
    label: "New File",
    icon: "pi pi-file-plus",
    command: () => {
      dialogType.value = 'File'
      dialogVisible.value = true
      menu.value.hide();
    },
  },
  {
    label: "New Folder",
    icon: "pi pi-folder-plus",
    command: () => {
      dialogType.value = 'Folder'
      dialogVisible.value = true
      menu.value.hide();
    },
  },
]);

const onRightClick = (event, node) => {

  // prevent right click on file and when global right click on file
  if (!node && rightClickNode.value?.type === "file") {
    event.preventDefault();
    menu.value.hide();
    rightClickNode.value = node;
    return
  }
  rightClickNode.value = node;

  // prevent right click on file
  if (node?.type === 'file') {
    event.preventDefault();
    return
  }
  menu.value.show(event);
};

const onTreeContentClick = (node) => {
  if (node.type === 'dir') {
    expandedKeys.value[node.key] = !expandedKeys.value[node.key]
  }
}

const getIcon = (node) => {
  if (expandedKeys.value[node.key]) {
    return 'pi pi-folder-open'
  }
  return node.type === 'dir' ? 'pi pi-folder' : 'pi pi-file'
}

const createEntry = () => {

}

onBeforeMount(() => {
  fetchFlowchart()
})
</script>

