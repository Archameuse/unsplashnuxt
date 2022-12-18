<template>
  <div class="p-8 flex flex-col items-center">
    <header class="w-full flex justify-between flex-wrap">
      <div class="flex items-center justify-center max-[643px]:flex-grow">
        <img src="/my_unsplash_logo.svg" width="200" height="60">
        <div class="flex justify-between rounded-lg p-2 shadow-md border-2 border-solid border-[rgba(0,0,0,0.2)]">
          <img src="/search.svg" width="24" height="24" class="opacity-30">
          <input type="text" v-model="search" placeholder="Search by name" class="ml-4 border-none focus:border-none focus:outline-none placeholder:text-[rgba(0,0,0,0.3)] text-sm">
        </div>
      </div>
      <div class="m-0 text-center max-[643px]:flex-grow max-[643px]:mt-5">
        <button @click="openAddModal" class="text-white bg-[#219654b9] text-sm min-w-[10rem] h-12 rounded-lg shadow-md cursor-pointer flex justify-center items-center">Add a photo</button>
      </div>
    </header>
    <main class="mt-14 grid w-full min-w-[600px] max-w-[1200px] grid-cols-3 justify-center items-center justify-items-center gap-5 [grid-auto-flow:dense]">
      <ImageComponent v-for="image in filter" :refresh="refresh" :image="image" :key="image.link+image.id"/>
    </main>
    <!-- <ImageUpload/> -->
    <AddModal v-if="showAddModal" :refresh="refresh" @close-modal="closeAddModal"/>
  </div>
</template>

<script lang="ts">
  export default defineNuxtComponent({
    data() {
      const showAddModal:boolean = false
      return {
        search: '',
        showAddModal
      }
    },
    async setup() {
      const { data:images, refresh } = await useFetch<Post[]>('/api/images')
      return {
        images,
        refresh
      }
    },
    methods: {
      openAddModal() {
        this.showAddModal = true
      },
      closeAddModal() {
        this.showAddModal = false
      },
    },
    computed: {
      filter() {
        return this.images?.filter(post => {
          return post.heading.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    }
  })
</script>


<style>
body.stopscroll{
  overflow-y: hidden;
}
</style>