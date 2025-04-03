import {reactive} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";

export const useStorageStore = defineStore('storageStore', () => {

  const api = axios.create({
    baseURL: "http://localhost:8080"
  })

  const storage = reactive({
    list: null,
    selected: null
  })

  const fetchFlowchart = async () => {
    const {data} = await api.get("/flowcharts/")
    storage.list = data
  }

  return {storage, fetchFlowchart}
})
