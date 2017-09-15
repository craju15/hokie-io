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
  methods: {
    resendVerificationCode () {
      ax.get('/emailUserWithVerificationCode' +
      '?email=' + window.getCookie('email'))
        .then(function (response) {
          window.notify(null, 'Email sent!')
        })
        .catch(function (err) {
          window.notify(null, err)
        })
    },
    handleVerify () {
      let _this = this
      ax.get('/verifyEmail' +
      '?email=' + window.getCookie('email'))
        .then(function (response) {
          if (!response.err) {
            _this.$router.push({path: '/'})
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
