<template>
  <router-link :to='"/question/" + info._id'>
    <div class='question-list-item' :style='styleQuestionListItem'>
      <div class='list-item-voter-amt'><p>{{ info.amt }}</p></div>
      <h2 class="list-item-title">{{ info.title }}</h2>
      <div class='list-item-qa-person-info'>
        <router-link :to='"/profile/" + info.userID' class='qa-name'>
          {{ info.name }}
        </router-link>
        <span class='qa-date'>- {{ info.date }}</span>
      </div>
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

<style>
  .question-list-item {
    opacity: 0;
    background-color: #eee;
    padding: 4px;
    padding-bottom: 1px;
    padding-top: 1px;
    width: 95%;
    margin: 0 auto;
    position: relative;
    display: flex;
    margin-bottom: 5px;
    animation: 0.3s ease-out 1 slideIn forwards;
  }

  .question-list-item:hover {
    background-color: #e1e1e1;
  }

  .question-list-item:active {
    /* left: 4px;*/
    /*top: 4px;*/
    background-color: grey;
    box-shadow: none;
  }

  .list-item-voter-amt {
    font-size: 25px;
    text-align: center;
    color: #666;
    width: 50px;
    position: relative;
    left: -6px;
  }

  .list-item-voter-amt p {
    position: relative;
    margin: 0px;
    top: 50%;
    transform: translateY(-50%);
  }

  .list-item-title {
    font-size: 20px;
    width: 90%;
    text-align: left;
    height: 100%;
    line-height: 25px;
    margin: 0px;
    margin-bottom: 20px;
    text-decoration: none;
    color: black;
  }

  .list-item-qa-person-info {
    position: absolute;
    bottom: 4px;
    left: 55px;
  }

</style>
