<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <p style='width: 100%; text-align: center; background-color: yellow; opacity: 0.3'>this section is under construction:</p>
    <Category style='opacity: 0.3' :key='name' v-for='name in categoryNames' :name='name'/>
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
