<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <Notification ref='notification'/>
    <div class='big-title'>Verify Email</div>
    <div class='simple-box'>
      <form class='login-form' v-on:submit='handleVerify'>
        <div class='section-title'>You should receive an email with your verification code. Please type that code in here:</div>
        <input name='verificationCode' type='text' class='form-input'/>
        <button type='submit' style='margin-bottom: 15px;'>verify email</button>
        Didn't receive an email? <a href='#' @click='resendVerificationCode'> Resend your verification code.</a>
        <p :style='emailSentStyles'>Email sent!</p>
      </form>

    </div>
  </div>
</template>

<script>
import Notification from '@/components/parts/Notification'
import ax from 'axios'

export default {
  components: {
    Notification
  },
  data () {
    return {
      emailSentStyles: {
        color: 'green',
        margin: 0,
        display: 'none'
      }
    }
  },
  methods: {
    resendVerificationCode () {
      let _this = this
      _this.emailSentStyles.display = 'none'
      ax.get(window.backend_url + '/emailUserWithVerificationCode' +
      '?email=' + window.getCookie('email'))
        .then(function (response) {
          _this.emailSentStyles.display = 'block'
        })
        .catch(function (err) {
          window.notify(null, err)
        })
    },
    handleVerify (e) {
      let _this = this
      ax.get(window.backend_url + '/verifyEmail' +
      '?email=' + window.getCookie('email') +
      '&code=' + e.target.elements.code.value)
        .then(function (response) {
          if (!response.err) {
            ax.get(window.backend_url + '/getSession?' +
              'email=' + response.data.userInfo.email +
              '&password=' + window.password_temp)
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
          } else {
            window.notify(null, response.err)
          }
        })
        .catch(function (error) {
          window.notify(null, error)
        })
    }
  }
}
</script>
