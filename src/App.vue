<template>
  <div class="flex flex-col gap-5 w-full h-full">
    <FilepathHeader/>
    <Splitter class="w-full h-full">
      <SplitterPanel class="flex items-center justify-center" :size="25">
        <Textarea v-model="flowchartValue" class="w-full h-full" @value-change="renderFlowchart"/>
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center" :size="75">
        <div ref="flowchartContainer"></div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
import FilepathHeader from "@/components/FilepathHeader.vue";
import flowchart from "flowchart.js";
import {ref} from "vue";

const flowchartValue = ref('')
const flowchartContainer = ref(null)

let debounceTimer = null;

const renderFlowchart = (text) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      if (!text) {
        flowchartContainer.value.innerHTML = "";
        return;
      }
      const diagram = flowchart.parse(text);
      flowchartContainer.value.innerHTML = "";
      diagram.drawSVG(flowchartContainer.value);
    } catch (error) {
      console.log(error)
    }
  }, 300); // 300ms debounce delay
};


</script>
