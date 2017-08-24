<template>
  <div class='newcomment'> 
    <div contentEditable='true' class='newcomment-input' placeholder='leave a comment...'></div>
    <a class='post-button' v-on:click='postComment'>Post</a>
    <a class='cancel-button' v-on:click='hideNewComment'>Cancel</a>
  </div>
</template>

<script>
  export default {
    props: ['info', 'delay', 'hideNewComment', 'postNewCommentHandler'],
    methods: {
      postComment (e) {
        e.preventDefault()
        let comment = this.$el.querySelector('.newcomment-input').innerHTML
        this.postNewCommentHandler(comment)
      }
    }
  }
</script>

<style>
  @keyframes fadeInBoi {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .newcomment {
    position: relative;
    padding: 10px;
    background-color: rgba(230, 255, 255, 1);
    margin-top: 3px;
  }

  .newcomment-input,
  .newcomment-name,
  .newcomment-date,
  .newcomment-form {
    display: inline;
  }

  .newcomment-input {
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 14px;
    width: 70%;
    font-family: Roboto;
    background-color: rgba(200, 200, 200, 0.4);
    padding: 8px;

    /* Auto Resizing: */
    display: inline-block;
    min-height: 10px;
    color: black;
  }

  [contenteditable=true]:empty:before {
    content: attr(placeholder);
    display: block;
    color: grey;
  }



</style>
