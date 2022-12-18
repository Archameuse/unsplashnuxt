<template>
    <div class="contents">
        <div @click="openModal" class="group w-full h-full rounded-2xl shadow-md overflow-hidden bg-black flex flex-col grid-flow-dense justify-between relative" :class="ratio === 1 ? 'aspect-square' : ratio < 1 ? 'aspect-[1/2] [grid-row:span_2]' : 'aspect-[2/1] [grid-column:span_2]'">
            <img class="absolute group-hover:opacity-70 transition-opacity cursor-pointer top-0 left-0 w-full h-full object-cover" :src="image.link">
            <button @click.stop="openDelModal" class="absolute hidden group-hover:block py-1 top-5 right-10 w-24 border-solid border border-[salmon] text-[salmon] rounded-2xl">delete</button>
        </div>
        <ImageModal v-if="showModal" :link="image.link" @close-modal="closeModal" :heading="image.heading"/>
        <DelModal v-if="showDelModal" :loading="loading" @delete="del" :heading="image.heading" @close-modal="closeDelModal" />
    </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
    export default defineNuxtComponent({
        props: {
            image: {
                type: Object as PropType<Post>,
                required: true
            },
            refresh: {
                type: Function,
                required: true
            }
        },
        data() {
            const showModal:boolean = false
            const showDelModal:boolean = false
            const ratio:number = 1
            const loading:boolean = false
            return {
                ratio,
                showModal,
                showDelModal,
                loading
            }
        }, 
        mounted() {
            let img = new Image()
            img.onload = () => {
                const difX = 0.25
                const difY = 0.15
                const width:number = img.naturalWidth
                const height: number = img.naturalHeight
                const calc: number = width/height
                this.ratio = (calc>=1-difY && calc<=1+difX) ? 1 : calc > 1+difY ? 2 : 0.5
            }   
            img.src = this.image.link
        },
        methods: {
            openModal() {
                this.showModal = true
            },
            closeModal() {
                this.showModal = false
            },
            openDelModal() {
                this.showDelModal = true
            },
            closeDelModal() {
                this.showDelModal = false
            },
            async del() {
                this.loading = true
                const res = $fetch('/api/images', {
                method: 'DELETE',
                body: {id: this.image.id, delhash: this.image.delHash}
                })
                .then(async () => {
                    await this.refresh()
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    alert('Something went wrong')
                })
                .finally(() => this.closeDelModal())
            }
        }
    })
</script>