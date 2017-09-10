<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <Category :key='name' v-for='name in categoryNames' :name='name'/>
  </div>

</template>

<script>
import Category from '@/components/parts/Category'

export default {
  components: {
    Category
  },
  data () {
    return {
      categoryNames: [
        'One',
        'Two',
        'Three',
        'Four'
      ]
    }
  }
}
</script>

<style>

</style>
