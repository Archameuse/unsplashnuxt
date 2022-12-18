<template>
    <ModalMain headline="Add a new photo">
        <div @drop.prevent="drop" @dragover.prevent @dragenter.prevent class="width-full flex flex-col p-5 gap-5" v-if="!progress">
            <div class="flex flex-col gap-2 font-semibold">
                <label for="label" class="text-md w-fit">Label</label>
                <input type="text" id="label" v-model="label"
                class="outline-2 placeholder-shown:truncate focus:placeholder:text-transparent outline-gray-300 outline rounded-lg p-4 w-full text-sm"
                placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae veniam fuga itaque laborum quas placeat voluptate saepe qui ullam nisi vitae alias iusto, similique ratione velit ad eos animi excepturi?" 
                >
            </div>
            <div class="flex justify-center align-center gap-5">
                <button @click="select" class="bg-[#318CE7] w-[220px] h-[60px] text-white font-thin text-2xl rounded-2xl flex justify-center items-center shadow-md cursor-pointer">
                    Select a file
                </button>
                <div class="h-full flex flex-col justify-center">
                    <h3 class="text-center m-0 p-0 text-xl">Or drop file on this modal</h3>
                </div>
            </div>
            <input @change="change" class="hidden" type="file" ref="fileInput" accept="image/*">
        </div>
        <div v-else>
            <div class="p-5">
                <div class="mb-1 text-base font-medium dark:text-white">Upload</div>
                <div class="w-full bg-gray-200 rounded-full">
                    <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all" :style="`width: ${progress}%`"> {{ progress }}%</div>
                </div>
            </div>
        </div>
    </ModalMain>
</template>

<script lang="ts">
import axios from 'axios'
const isImage = /^image\//
    export default defineNuxtComponent({
        props: {
            refresh: {
                type: Function,
                required: true
            }
        },
        setup() {
            const config = useRuntimeConfig()
            return {
                iId: config.IMGUR_ID
            }
        },
        data() {
            return {
                label: '',
                progress: 0
            }
        },
        methods: {
            async drop(event:DragEvent) {
                const file = event.dataTransfer?.files?.[0]
                if(!file) return alert('No file selected')
                if(!isImage.test(file.type)) return alert('Wrong filetype')
                if(!this.label.length) return alert('Fill label first')
                await this.upload(file)
            },
            select() {
                const fileInput = this.$refs.fileInput as HTMLInputElement
                fileInput.click()
            },
            async change(event:Event) {
                const fileInput = event.target as HTMLInputElement
                if(!fileInput.files || !isImage.test(fileInput.files[0].type)) {
                    fileInput.value = ''
                    return alert('Unexpected error')
                }
                if(!this.label.length) {
                    fileInput.value = ''
                    return alert('Fill label first')
                }
                await this.upload(fileInput.files[0])
                fileInput.value = ''
            },
            async upload(file:File) {
                const data = new FormData()
                data.append('image', file)
                const res = await axios.post('https://api.imgur.com/3/image', data, {
                headers: {
                    'Authorization': 'Client-ID ' + this.iId,
                    'Accept': 'application/json'
                },
                onUploadProgress: (progress) => {
                    if(!progress.progress) return
                    this.progress = Math.round(progress.progress * 100)
                }
                }).catch(err => alert('imgur upload error')) as {data:{data:{link:string,deletehash:string}}}
                const driveRes = await $fetch('/api/images', {
                    method: 'POST',
                    body: {
                        link: res.data.data.link,
                        heading: this.label,
                        delHash: res.data.data.deletehash
                    }
                }).catch(err => alert('db upload error'))
                .finally(async () => {
                    await this.refresh()
                    this.progress = 0
                    this.$emit('close-modal')
                })
            }
        }
    })
</script>