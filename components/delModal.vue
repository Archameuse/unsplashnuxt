<template>
    <ModalMain :headline="'Delete ' + heading">
        <div class="w-full flex justify-end p-5 " v-if="!loading">
            <div class="flex flex-row-reverse gap-5">
                <button @click="$emit('delete')" class="text-white bg-[salmon] text-md w-28 h-12 rounded-lg shadow-md cursor-pointer flex justify-center items-center">Delete</button>
                <button @click="$emit('close-modal')" class="text-gray-500 h-12 test-md w-20">Cancel</button>
            </div>
        </div>
        <div class="w-full p-5 flex justify-center" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
        </div>
    </ModalMain>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            heading: {
                type: String,
                default: ''
            },
            loading: {
                type: Boolean,
                default: false
            }
        }
    })
</script>