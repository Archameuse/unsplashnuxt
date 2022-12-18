<template>
    <div class="bg-[whitesmoke] flex justify-center items-center min-h-screen min-w-screen p-0 m-0">
      <main class="bg-white flex flex-col justify-center items-center w-full shadow-md rounded-lg text-center h-[500px] max-w-[400px]">
        <div>
          <h1 class="text-[rgba(0,0,0,0.65)]">Upload your image</h1>
          <h3 class="text-[rgba(0,0,0,0.45)]">File should be an image</h3>
        </div>
        <div ref="dropzone" class="w-[90%] h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-[lightskyblue] bg-[aliceblue] rounded-[5px] text-[rgba(0,0,0,0.2)]">
          <img src="/image.svg" width="200" height="100">
          <h2 class="text-[rgba(0,0,0,0.65)] mt-0 mb-6 w-full">Drag & Drop your image in here</h2>
        </div>
        <div>
          <h2 class="text-[rgba(0,0,0,0.3)] text-sm">Or</h2>
        </div>
        <div @click="fileClick" class="bg-[#318CE7] w-[220px] h-[60px] rounded-2xl flex justify-center items-center mb-5 shadow-md cursor-pointer">
          <h3 class="text-white font-thin text-2xl">Choose a file</h3>
        </div>
        <input @change="upload" class="hidden" type="file" ref="fileInput" accept="image/*">
      </main>
    </div>
  </template>
  
  <script lang="ts">
  import axios from 'axios'
  const isImage = /^image\//
    export default defineNuxtComponent({
      setup() {
        const config = useRuntimeConfig()
        return {
          iId: config.IMGUR_ID
        }
      },
      methods: {
        fileClick() {
          const fileInput = this.$refs.fileInput as HTMLInputElement
          fileInput.click()
        },
        async upload(event:Event) {
          const target = event.currentTarget as HTMLInputElement
          if(!target.files) return
          const data = new FormData()
          data.append('image', target.files[0])
          if(isImage.test(target.files[0].type)) {
            const res = await axios.post('https://api.imgur.com/3/image', data, {
              headers: {
                'Authorization': 'Client-ID ' + this.iId,
                'Accept': 'application/json'
              },
              onUploadProgress(progress) {
                console.log(progress)
              }
            })
            const driveUpload = await $fetch('/api/images', {
              method: 'POST',
              body: {
                link: res.data.data.link,
                heading: 'Test heading'
              }
            })
          } else {
            alert('This extension is not supported')
          }
        }
      }
    })
  </script>