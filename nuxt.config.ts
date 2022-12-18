// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@vueuse/nuxt',
        'formidable',
        '@nuxt/image-edge'
    ],
    typescript: {
        strict: true
    },
    runtimeConfig: {
        public: {
            IMGUR_ID: process.env.IMGUR_ID
        }
    }
})
