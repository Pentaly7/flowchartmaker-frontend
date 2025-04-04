<template>
  <div class="px-5 pt-3 flex gap-3 items-center">

    <Button icon="pi pi-folder" @click="visible = true"></Button>
    <span class="font-bold text-lg flex-1">{{
        storage.selectedNode.path?.split(".")[0] || 'NO FILE SELECTED'
      }}</span>
    <Message v-if="storage.contentChanged" class="" severity="warn">file changed, press ctrl + s to save</Message>
    <!--Drawer Section    -->
    <Drawer v-model:visible="visible" header="Project Browser" @contextmenu="onRightClick($event,'')">
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
              class="!absolute w-full h-full z-99"
              variant="text"
              @click="onTreeContentClick(node)"
              @contextmenu="onRightClick($event, node)"
          />
        </template>
        <template #default="{node}">
          <span :class="getIcon(node)"/>
          <p class="cursor-pointer font-semibold">{{
              node.key.split(".")[0]
            }}</p>
        </template>
      </Tree>
    </Drawer>

    <!--Context menu section-->
    <ContextMenu ref="menu" :model="items">
      <template #item="{ item }">
        <Button
            class="p-1 cursor-pointer"
            unstyled>
          <span :class="item.icon"/>
          <span class="ml-2">{{ item.label }}</span>
        </Button>
      </template>
    </ContextMenu>

    <!--DIALOG SECTION-->
    <Dialog v-model:visible="dialogVisible" modal :header="`Create New ${dialogType}`" :style="{ width: '25rem' }"
    >
      <form @submit.prevent="createEntry(dialogType)">
        <div class="flex items-center gap-4 mb-4">
          <InputText ref="newEntryRef" autofocus v-model="newEntryName" class="flex-auto"
                     @keydown="preventInvalidChars"/>
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
import {onBeforeMount, onMounted, onUnmounted, ref} from "vue";
import {useStorageStore} from "@/stores/storage.js";

const {fetchFlowcharts, storage, createFolder, createFile, fetchFile, saveFile, deleteEntry} = useStorageStore()
const visible = ref(false);
const dialogVisible = ref(false)
const dialogType = ref('')
const expandedKeys = ref({})
const newEntryName = ref('')
const newEntryRef = ref(null)

const emit = defineEmits(['fileSelected'])

const rightClickNode = ref()
const selectedNode = ref(null)
const menu = ref();
const menuItems = [
  {
    label: "New Folder",
    icon: "pi pi-folder-plus",
    command: () => {
      dialogType.value = 'Folder'
      dialogVisible.value = true
      menu.value.hide();
    },
  },
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
    separator: true
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: async () => {
      menu.value.hide();
      await deleteEntry(rightClickNode.value.path)
      fetchFlowcharts()
    },
  },
]
const items = ref([]);

const onRightClick = (event, node) => {
  if (!node && rightClickNode.value?.type === 'file') {
    rightClickNode.value = node
    return
  }
  if (!node) {
    items.value = menuItems.filter(el => {
      return el.label === 'New Folder'
    })
  } else if (node?.type === 'dir') {
    items.value = menuItems
  } else if (node?.type === 'file') {
    items.value = menuItems.filter(el => {
      return el.label === 'Delete'
    })
  }
  rightClickNode.value = node;
  menu.value.show(event);
};

const onTreeContentClick = async (node) => {
  if (node.type === 'dir') {
    expandedKeys.value[node.key] = !expandedKeys.value[node.key]
  } else if (node.type === 'file') {
    selectedNode.value = node
    visible.value = false
    await fetchFile(node)
    emit('fileSelected')
  }
}

const getIcon = (node) => {
  if (expandedKeys.value[node.key]) {
    return 'pi pi-folder-open'
  }
  return node.type === 'dir' ? 'pi pi-folder' : 'pi pi-file'
}

const createEntry = async (type) => {
  dialogVisible.value = false
  try {
    let path = newEntryName.value
    console.log(rightClickNode.value)
    if (rightClickNode.value) {
      path = rightClickNode.value.path + '/' + newEntryName.value
    }
    if (type === 'Folder') {
      await createFolder(path)
    } else {
      await createFile(path)
    }
    fetchFlowcharts()
  } catch (error) {
    console.log(error)
  } finally {
    newEntryName.value = ''
  }
}

const handleSaveShortcut = (event) => {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // Prevent browser's default save action
    console.log("Ctrl + S pressed! Saving...");
    saveFlowchart(); // Call your function here
  }
};


const saveFlowchart = async () => {
  if (storage.selectedContent) {
    await saveFile(storage.selectedNode.path, storage.selectedContent)
    storage.contentChanged = false
    fetchFlowcharts()
  }
};

// List of invalid characters
const invalidChars = /[<>:"/\\.,|?*\x00-\x1F]/;
// Function to remove invalid characters
const preventInvalidChars = (event) => {
  if (invalidChars.test(event.key)) {
    event.preventDefault(); // Block the input
  }
};

onBeforeMount(() => {
  fetchFlowcharts()
})

onMounted(() => {
  window.addEventListener("keydown", handleSaveShortcut);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleSaveShortcut);
});
</script>

