<template>
  <div class='content-container'>
    <Notification ref='notification'/>
    <div class='header-space'></div>
    <div class='big-title'>Ask a New Question</div>
    <div class='tips-section'>
      Tips for Brand New Questions:
      <ul>
        <li>
          Make sure your new question is unique!
        </li>
        <li>
          Ask a specific question and provide enough supporting 
          detail. Avoid open ended questions!
        </li>
        <li>
          Do not post inappropriate/harmful content
        </li>
      </ul>
    </div>
    <div class='new-question-section'>
      <div class='section-title'>
        Question (this should be as brief as possible)
      </div>
      <input />
      <div class='section-title'>
        Body (use this area to give extra detail for your question)
      </div>
      <div class='editor'></div>
      <br />
      <a class='post-button' v-on:click='showModal'>Post</a>
    </div>
    <div class='limit-warning-modal-container' :style='modalStyles'>
      <div class='modal-background'></div>
      <div class='limit-warning-modal'>
        <div class='modal-title'>Are you sure?</div>
        <div class='modal-body'></div>
        <a class='post-button' v-on:click='newQuestionHandler'>Yes!</a>
        <a class='cancel-button' v-on:click='hideModal'>Nope</a>
      </div>
    </div>
  </div>
</template>

<script>
  import ax from 'axios'
  import Notification from '@/components/parts/Notification'
  import Quill from 'quill'

  export default {
    data () {
      return {
        modalStyles: {display: 'none'},
        editor: null
      }
    },
    components: {
      Notification
    },
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
      this.editor = new Quill('.editor', editorOptions)
      ax.get(window.backend_url + '/visitedNewQuestionPage' +
        '?userID=' + window.getCookie('userID') +
        '&email=' + window.getCookie('email'))
    },
    methods: {
      showModal (e) {
        e ? e.preventDefault() : ''
        this.modalStyles = {display: 'block'}
      },
      hideModal (e) {
        e ? e.preventDefault() : ''
        this.modalStyles = {display: 'none'}
      },
      newQuestionHandler (e) {
        e ? e.preventDefault() : ''
        let _this = this
        if (this.$el.querySelector('.editor').childNodes[0].innerHTML === '<p><br></p>') {
          window.notify(null, 'Please include a body!')
        } else {
          ax.get(window.backend_url + '/addNewQuestion/?' +
            'title=' + this.$el.querySelector('input').value +
            '&body=' + this.$el.querySelector('.editor').childNodes[0].innerHTML +
            '&userID=' + window.getCookie('userID') +
            '&email=' + window.getCookie('email') +
            '&sessionToken=' + window.getCookie('sessionToken')
          ).then(function (result) {
            if (result.data.err) {
              window.notify(_this, result.data.err)
            } else {
              _this.$router.push({path: '/question/' + result.data.questionInfo._id})
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

  .tips-section {
    background-color: #eee;
    opacity: 0;
    animation: 0.3s ease-out 1 slideIn forwards;
    color: #444;
    font-family: "PT Sans";
    padding: 10px;
    font-size: 18px;
    margin-bottom: 15px;
  }

  .new-question-section {
    background-color: #eee;
    opacity: 0;
    animation: 0.3s ease-out 1 slideIn forwards;
    font-family: "PT Sans";
    padding: 10px;
  }

  .new-question-section input {
    width: 90%;
    border: none;
    font-size: 20px;
    font-family: "PT Sans";
    outline: none;
    font-weight: bold;
    padding: 5px;
    margin-bottom: 10px;
  }

  .new-question-section textarea {
    width: 90%;
    height: 100px;
    font-family: roboto;
    font-size: 17px;
    padding: 5px;
    border: none;
    outline: none;
    margin-bottom: 10px;
  }

  .limit-warning-modal-container {
    z-index: 200;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }

  .modal-background {
    background-color: black;
    opacity: 0.6;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .limit-warning-modal {
    background-color: #eee;
    width: 300px;
    display: block;
    position: relative;
    margin: auto;
    opacity: 1;
    z-index: 2;
    top: 30%;
    padding: 10px;
  }

  .modal-title {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-bottom: 5px;
  }

  .modal-body {
    font-size: 17px;
    margin-bottom: 5px;
  }

</style>
