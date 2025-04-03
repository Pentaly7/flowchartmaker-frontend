<template>
  <div class="flex flex-col gap-5 w-full h-full">
    <FilepathHeader @fileSelected="renderFlowchart"/>
    <Splitter class="w-full h-full">
      <SplitterPanel class="flex items-center justify-center" :size="25">
        <Textarea v-model="storage.selectedContent" class="w-full h-full" @value-change="renderFlowchart"/>
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center" :size="75">
        <div ref="parentContainer" class="w-full h-full overflow-hidden relative">
          <Button icon="pi pi-download" class="!absolute top-5 right-5 z-99 shadow-lg !border !border-gray-500"
                  @click="downloadPNG"/>
          <div ref="flowchartContainer"
               class="relative bg-white w-full h-auto min-h-full overflow-hidden  flex justify-center"></div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
import FilepathHeader from "@/components/FilepathHeader.vue";
import flowchart from "flowchart.js";
import {onMounted, ref} from "vue";
import {useStorageStore} from "@/stores/storage.js";
import panzoom from '@panzoom/panzoom'

const {storage} = useStorageStore()
const parentContainer = ref(null)
const flowchartContainer = ref(null)

let debounceTimer = null;

const renderFlowchart = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      if (!storage.selected) {
        flowchartContainer.value.innerHTML = "";
        return;
      }
      const diagram = flowchart.parse(storage.selected);
      flowchartContainer.value.innerHTML = "";
      diagram.drawSVG(flowchartContainer.value);
    } catch (error) {
      console.log(error)
    }
  }, 300); // 300ms debounce delay
};


const downloadPNG = () => {
  const svgElement = flowchartContainer.value.querySelector('svg');
  if (!svgElement) {
    console.error("SVG not found!");
    return;
  }

  const svgString = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  const svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Set canvas size to match SVG size
    canvas.width = svgElement.clientWidth || 1000; // Default size if not defined
    canvas.height = svgElement.clientHeight || 1000;

    // Fill the canvas with a white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // White background

    // Draw SVG onto Canvas
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Convert Canvas to PNG and trigger download
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    const filename = storage.selectedNode.key.split(".")[0] || "flowchart.png";
    link.download = filename;
    link.click();
  };

  img.src = url;
};


onMounted(() => {
  if (flowchartContainer.value) {
    const pz = panzoom(flowchartContainer.value, {
      zoomDoubleClickSpeed: 1,
      maxZoom: 2,
      minZoom: 0.5,
      smoothScroll: true
    });
    // Enable zooming with the mouse scroll wheel
    parentContainer.value.addEventListener('wheel', (event) => {
      event.preventDefault();
      pz.zoomWithWheel(event);
    });

  }
});

</script>

