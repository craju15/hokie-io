<template>
  <div class='quick-search-results'>
    <QuestionListItem
      v-for='(result, index) in results'
      :info='result'
      :delay='(index + 1) * 50'
      :key='index'
    />
  </div>
</template>

<script>
  import QuestionListItem from '@/components/parts/QuestionListItem'
  export default {
    props: ['results'],
    components: {
      QuestionListItem
    }
  }
</script>

<style>
  .quick-search-results {
    width: 500px;
    min-height: 100px;
    position: absolute;
    top: 50px;
    left: 200px;
    background-color: #e1e1e1;
    transition: all 0.15s linear;
  }
</style>
