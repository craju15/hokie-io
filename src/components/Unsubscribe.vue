<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <h1>You're subscribed to:</h1>
    <div class='unsubscribe-container'>
      <input
        @click='handleSingleCheck'
        :checked='subLevel.charAt(0) == 1'
        type='checkbox' id='check1' class='css-checkbox' />
      <label for='check1' class='css-label'>
        New <b>answers</b> to your questions
      </label><br><br>
      <!--
      <input
        @click='handleSingleCheck'
        :checked='subLevel.charAt(1) == 1'
        type='checkbox' id='check2' class='css-checkbox' />
      <label for='check2' class='css-label'>
        New <b>comments</b> to your answers
      </label><br><br>
      -->
      <input
        @click='handleSingleCheck'
        :checked='subLevel.charAt(2) == 1'
        type='checkbox' id='check3' class='css-checkbox' />
      <label for='check3' class='css-label'>
        New <b>questions</b> to your groups
      </label><br><br>
      <input
        @click='handleAllCheck'
        :checked='parseInt(subLevel, 2) == 7'
        type='checkbox' id='checkAll' class='css-checkbox' />
      <label for='checkAll' class='css-label'>
        All of the above
      </label><br><br>
      <TopMessage ref='topMessage' />
    </div>
  </div>
</template>

<script>
import TopMessage from '@/components/parts/TopMessage'
import ax from 'axios'

export default {
  components: {
    TopMessage
  },
  mounted () {
    let _this = this
    console.log(window.getCookie('userID'))
    ax.get(window.backend_url + '/getSubLevel' +
    '?email=' + window.getCookie('email') +
    '&sessionToken=' + window.getCookie('sessionToken') +
    '&userID=' + window.getCookie('userID'))
      .then(function (response) {
        if (response.data.err) {
          window.notify(null, response.data.err)
        } else {
          console.log(response.data)
          _this.subLevel = response.data.subLevel
        }
      })
  },
  data () {
    return {
      subLevel: '000'
    }
  },
  methods: {
    handleAllCheck (e) {
      let val = e.target.checked
      let checkBoxes = document.getElementsByClassName('css-checkbox')
      for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].checked = val
      }
      this.submitSubLevel(this.calcSubLevel())
    },
    handleSingleCheck (e) {
      let val = e.target.val
      let allCheck = document.getElementById('checkAll')
      if (!val) {
        allCheck.checked = false
      }
      let checkBoxes = document.getElementsByClassName('css-checkbox')
      let allChecked = true
      for (let i = 0; i < checkBoxes.length - 1; i++) {
        allChecked = allChecked && checkBoxes[i].checked
      }
      if (allChecked) {
        allCheck.checked = true
      }
      this.submitSubLevel(this.calcSubLevel())
    },
    calcSubLevel () {
      // 000 = nothing
      // 111 = everything
      // 001 = just questions
      // 010 = just answers
      // 100 = just weekly group
      let level = ''
      let checkBoxes = document.getElementsByClassName('css-checkbox')
      for (let i = 0; i < checkBoxes.length - 1; i++) {
        level = level + (checkBoxes[i].checked ? '1' : '0')
      }
      return level
    },
    submitSubLevel (level) {
      console.log(level)
      ax.get(window.backend_url + '/changeSubLevel' +
      '?email=' + window.getCookie('email') +
      '&sessionToken=' + window.getCookie('sessionToken') +
      '&userID=' + window.getCookie('userID') +
      '&subLevel=' + level)
        .then((response) => {
          if (response.data.err) {
            window.notify(null, response.data.err)
          } else {
            this.$refs.topMessage.display('Your preferences have been updated!')
          }
        })
    }
  }
}
</script>

<style scope>

  .unsubscribe-container {
    width: 100%;
    background-color: #eee;
    padding: 15px;
    font-size: 20px;
    animation: 0.3s ease-out 1 slideIn forwards;
    margin-bottom: 15px;
  }

  .unsubscribe-container a {
    color: black;
    font-weight: bold;
    text-decoration: underline;
  }

  .unsubscribe-container a:hover {
    color: grey;
  }
</style>
