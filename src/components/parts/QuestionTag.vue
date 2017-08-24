<template>
  <router-link to='/question'>
    <div class='question-tag' :style='styleQuestionListItem'>
      <div class='tag-voter-amt'><p>{{ info.amt }}</p></div>
      <h2 class="tag-title">{{ info.title }}</h2>
    </div>
  </router-link>
</template>

<script>
  export default {
    props: ['info', 'delay'],
    data () {
      return {
        styleQuestionListItem: {
          animation: '0.3s ease-out 1 slideIn ' + this.delay + 'ms forwards'
        }
      }
    }
  }
</script>

<style scoped>
  .question-tag {
    opacity: 0;
    background-color: #eee;
    padding: 10px;
    width: 95%;
    height: 40px;
    margin: 0 auto;
    position: relative;
    display: flex;
    margin-bottom: 15px;
    animation: 0.3s ease-out 1 slideIn forwards;
  }

  .question-tag:hover {
    background-color: #e1e1e1;
  }

  .question-tag:active {
    left: 4px;
    top: 4px;
    box-shadow: none;
  }

  .tag-voter-amt {
    font-size: 25px;
    text-align: center;
    color: #666;
    width: 50px;
    position: relative;
    left: -6px;
  }

  .tag-voter-amt p {
    line-height: 40px;
    margin: 0px;
  }

  .tag-title {
    font-size: 16px;
    width: 90%;
    text-align: left;
    height: 100%;
    margin: 0px;
    text-decoration: none;
    color: black;
    overflow: hidden;
  }

</style>
