<template>
  <div>
    <div class='newanswer'>
        <p class='qa-body'>
          <div class='answer-editor'></div>
        <!-- <textarea class='newanswer-input' placeholder='write your answer here...'></textarea> -->
        </p>
        <a class='post-button' v-on:click='postNewAnswer'>Post</a>
        <a class='cancel-button' v-on:click='hideNewAnswer'>Cancel</a>
    </div>
  </div>
</template>

<script>
  import Quill from 'quill'

  export default {
    props: ['hideNewAnswer', 'postNewAnswerHandler'],
    mounted () {
      let toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike', 'link'],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }]
      ]
      let editorOptions = {
        placeholder: 'You\'re a wizard Harry...',
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      }
      this.editor = new Quill('.answer-editor', editorOptions)
    },
    methods: {
      postNewAnswer (e) {
        e.preventDefault()
        let answer = this.$el.querySelector('.answer-editor').childNodes[0].innerHTML
        this.postNewAnswerHandler(answer)
      }
    }
  }
</script>

<style>

  .newanswer {
    background-color: #eee;
    padding: 10px;
    width: 95%;
    margin: 0 auto;
    position: relative;
    display: block;
    margin-bottom: 30px;
  }

</style>
