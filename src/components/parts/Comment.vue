<template>
  <div class='comment'> 
    <div class='comment-body'>{{ info.body }}</div>
    <router-link :to='"/profile/" + info.userID' class='comment-name'>{{ info.name }}</router-link>
    <div class='comment-date'>- {{ info.date }}</div>
  </div>
</template>

<script>
  export default {
    props: ['info', 'delay']
  }
</script>

<style>
  .comment {
    opacity: 0;
    position: relative;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #eee;
    margin-top: 2px;
    border-left: 2px solid #aaa;
    line-height: 15px;
  }


  .comment-body,
  .comment-name,
  .comment-date {
    display: inline;
  }

  .comment-name {
    margin-left: 10px;
    color: rgba(100, 100, 250, 1);
    font-size: 13px;
  }

  .comment-date {
    color: #888;
    font-size: 13px;
  }

  .comment-body {
    font-size: 14px;
    font-family: Roboto;
    color: black;
  }
</style>
