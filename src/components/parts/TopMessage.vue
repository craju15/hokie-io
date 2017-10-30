<template>
  <div class='top-message'>
    <div class='top-message-body'>This is the message body!</div>
    <a @click='handleClose' href='#'>dismiss</a>
  </div>
</template>

<script>
  export default {
    methods: {
      display (message) {
        this.$el.querySelector('.top-message-body').innerHTML = message
        this.$el.style.display = 'block'
      },
      handleClose (e) {
        e.preventDefault()
        this.$el.style.display = 'none'
      }
    }
  }
</script>

<style>

  .top-message {
    background-color: lightgreen;
    color: darkgreen;
    display: none;
    padding: 7px;
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 19px;
    transition: all 0.25s;
  }

  .top-message-body {
    display: inline-block;
  }

  .top-message a {
    display: inline-block;
    float: right;
    color: darkgreen;
    font-weight: bold;
    font-size: 15px;
  }

</style>
