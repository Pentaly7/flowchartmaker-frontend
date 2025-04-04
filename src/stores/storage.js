import {reactive} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";

export const useStorageStore = defineStore('storageStore', () => {

  const api = axios.create({
    baseURL: "http://localhost:8080"
  })

  const storage = reactive({
    list: null,
    selectedNode: {},
    selectedContent: '',
    contentChanged: false
  })

  const fetchFlowcharts = async () => {
    const {data} = await api.get("/flowcharts/")
    storage.list = data
  }

  const fetchFile = async (node) => {
    let url = "/flowcharts/"
    if (node.path) {
      url += node.path
    }
    const {data} = await api.get(url)
    storage.selectedNode = node
    storage.selectedContent = data
  }

  const createFolder = async (path) => {
    const url = "/flowcharts/" + path
    return await api.post(url, {})
  }
  const createFile = async (path) => {
    const url = "/flowcharts/" + path
    const title = path.split("/").pop()
    return await api.post(url, {
      title: title
    })
  }
  const saveFile = async (path, content) => {
    const url = "/flowcharts/" + path.split(".")[0]
    const title = path.split("/").pop()
    return await api.post(url, {
      title: title,
      content: content
    })
  }

  const deleteEntry = async (path) => {
    const url = "/flowcharts/" + path
    return await api.delete(url)
  }

  return {storage, fetchFlowcharts, createFolder, createFile, fetchFile, saveFile, deleteEntry}
})
