<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <Notification ref='notification'/>
    <div class='big-title'>Sign Up</div>
    <form class='signup-form' v-on:submit='handleSignUp'>
      <div class='section-title'>first name:</div>
      <input name='fn' type='text' class='form-input'/>

      <div class='section-title'>last name:</div>
      <input name='ln' type='text' class='form-input'/>

      <div class='section-title'>Virginia Tech email:</div>
      <input name='email' type='text' class='form-input'/>

      <div class='section-title'>primary major:</div>
      <select name='major' type='text' class='form-input'>
        <option value='default'>Choose one...</option>
        <option v-for='majorOption in majorOptions' :value='majorOption._id'>
          {{ majorOption._id + ': ' + majorOption.title }}
        </option>
      </select>

      <div class='section-title'>new password:</div>
      <input name='password' type='password' class='form-input'/>

      <div class='section-title'>confirm password:</div>
      <input name='confimpassword' type='password' class='form-input'/>

      <div id='recaptcha' class="g-recaptcha" data-sitekey="6LcxFSsUAAAAANMVh5tgNeiVqBBk2Xucwumlfwc1"></div>

      <button type='submit'>sign up</button>
    </form>
    <div id='token-disp'></div>
  </div>
</template>

<script>
  import Notification from '@/components/parts/Notification'
  import ax from 'axios'

  export default {
    props: ['updateLoginStatus', 'updateUserID'],
    components: {
      Notification
    },
    data () {
      return {
        majorOptions: []
      }
    },
    mounted () {
      let _this = this
      grecaptcha.render('recaptcha', {
        sitekey: '6LcxFSsUAAAAANMVh5tgNeiVqBBk2Xucwumlfwc1',
        theme: 'light'
      })

      ax.get(window.backend_url + '/getMajors' +
      '?email=' + window.getCookie('email'))
        .then(function (response) {
          _this.majorOptions = response.data.results
        })
        .catch(function (error) {
          window.notify(null, error)
        })
    },
    methods: {
      handleSignUp (e) {
        e.preventDefault()
        let _this = this
        if (!e.target.elements['g-recaptcha-response']) {
          location.reload()
        } else if (!e.target.elements['g-recaptcha-response'].value) {
          window.notify(_this, 'Please prove your mortality!')
        } else {
          ax.get(window.backend_url + '/addNewUser/?' +
            'firstName=' + e.target.elements.fn.value +
            '&lastName=' + e.target.elements.ln.value +
            '&email=' + e.target.elements.email.value +
            '&password=' + e.target.elements.password.value +
            '&major=' + e.target.elements.major.value +
            '&recaptcha=' + e.target.elements['g-recaptcha-response'].value
          ).then((response) => {
            if (response.data.err) {
              window.notify(_this, response.data.err)
            } else {
              console.log(response.data.userInfo)
              console.log(e.target.elements.password.value)
              ax.get(window.backend_url + '/getSession?' +
                'email=' + response.data.userInfo.email +
                '&password=' + e.target.elements.password.value)
                .then((response2) => {
                  if (!response2.data.error && response2.data.verified) {
                    window.setCookie(
                      'sessionToken',
                      response2.data.sessionToken,
                      window.cookie_expire_time
                    )
                    window.setCookie(
                      'email',
                      response.data.userInfo.email,
                      window.cookie_expire_time
                    )
                    window.setCookie(
                      'userID',
                      response2.data.userID,
                      window.cookie_expire_time
                    )
                    _this.updateLoginStatus()
                    _this.updateUserID()
                    _this.$router.push({path: '/profile/' + response.data.userInfo.userID})
                  } else {
                    window.notify(_this, response2.data.error)
                  }
                })
                .catch((error) => {
                  console.log('promise error:')
                  window.notify(_this, error)
                })
            }
          })

//          ax.get(window.backend_url + '/signup2/?' +
//            // 'firstName=' + e.target.elements.fn.value +
//            // '&lastName=' + e.target.elements.ln.value +
//            '&email=' + e.target.elements.email.value +
//            '&password=' + e.target.elements.password.value +
//            '&recaptcha=' + e.target.elements['g-recaptcha-response'].value
//          ).then((response) => {
//            if (response.data.err) {
//              window.notify(_this, response.data.err)
//            } else {
//              console.log(response.data.userInfo)
//              console.log(e.target.elements.password.value)
//              ax.get(window.backend_url + '/getSession?' +
//                'email=' + response.data.userInfo.email +
//                '&password=' + e.target.elements.password.value)
//                .then((response2) => {
//                  if (!response2.data.error && response2.data.verified) {
//                    window.setCookie(
//                      'sessionToken',
//                      response2.data.sessionToken,
//                      window.cookie_expire_time
//                    )
//                    window.setCookie(
//                      'email',
//                      response.data.userInfo.email,
//                      window.cookie_expire_time
//                    )
//                    window.setCookie(
//                      'userID',
//                      response2.data.userID,
//                      window.cookie_expire_time
//                    )
//                    _this.updateLoginStatus()
//                    _this.updateUserID()
//                    _this.$router.push({path: '/profile/' + response.data.userInfo.userID})
//                  } else {
//                    window.notify(_this, response2.data.error)
//                  }
//                })
//                .catch((error) => {
//                  console.log('promise error:')
//                  window.notify(_this, error)
//                })
//            }
//          })
        }
      }
    }
  }
</script>

<style>
  .signup-form {
    background-color: #eee;
    display: block;
    padding: 10px;
    font-family: "PT Sans";
  }

  .form-input {
    padding: 4px;
    width: 200px;
    margin-bottom: 10px;
    font-size: 17px;
  }

  .signup-form button {
    display: block;
    font-size: 17px;
    text-align: center;
    margin-top: 5px;
  }
</style>
