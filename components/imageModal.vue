<template>
    <!-- <div> -->
        <ModalMain :headline="heading">
            <div class="w-full overflow-y-auto">
                <nuxt-img :src="link" :preload="true" class="w-full object-contain" :alt="heading"/>
            </div>
        </ModalMain>
    <!-- </div> -->
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            heading: {
                type: String,
                default: ''
            },
            link: {
                type: String,
                required: true
            }
        },
        methods: {
            test() {
                console.log('asd')
            }
        }
    })
</script>