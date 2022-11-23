<template>
  <div>
    我是Register
    {{ user.name }},{{ user.age }}
  </div>
</template>
<script lang='ts' setup>
import { reactive } from 'vue'
const user = reactive({
  name: 'zs',
  age: 15
})

</script>
<style scoped lang='scss'>

</style>