<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='big-title'>Login</div>
    <form class='login-form' v-on:submit='handleLogin'>
      <div class='section-title'>email:</div>
      <input name='email' type='text' class='form-input'/>
      <div class='section-title'>password:</div>
      <input name='password' type='password' class='form-input'/>
      <button type='submit' style='margin-bottom: 15px;'>login</button>
      <router-link to='/signup'>Don't have an account? Signup!</router-link>
    </form>

    <button v-on:click='showToken' v-if='dev_mode'>show token</button>
    <button v-on:click='deleteToken' v-if='dev_mode'>delete token</button>
    <div id='token-disp'></div>
  </div>
</template>

<script>
  import ax from 'axios'

  export default {
    props: ['updateLoginStatus', 'updateUserID'],
    data () {
      return {
        dev_mode: window.dev_mode
      }
    },
    methods: {
      handleLogin (e) {
        e.preventDefault()
        let _this = this
        ax.get(window.backend_url + '/getSession?' +
          'email=' + e.target.elements.email.value +
          '&password=' + e.target.elements.password.value)
          .then((response) => {
            if (!response.data.error && response.data.verified) {
              window.setCookie(
                'sessionToken',
                response.data.sessionToken,
                window.cookie_expire_time
              )
              window.setCookie(
                'email',
                e.target.elements.email.value,
                window.cookie_expire_time
              )
              window.setCookie(
                'userID',
                response.data.userID,
                1
              )
              _this.updateLoginStatus()
              _this.updateUserID()
              _this.$router.push({path: '/'})
            } else {
              if (response.data.error === 'verify email') {
                _this.$router.push({path: '/verify'})
              }
              window.notify(_this, response.data.error)
            }
          })
          .catch((error) => {
            window.notify(_this, error)
          })
      },
      showToken () {
        let sessionToken = window.getCookie('sessionToken')
        document.getElementById('token-disp').innerHTML = sessionToken
      },
      deleteToken () {
        window.deleteCookie('sessionToken')
      }
    }
  }
</script>

<style>
  .login-form {
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

  .login-form button {
    display: block;
    font-size: 17px;
    text-align: center;
    margin-top: 5px;
  }
</style>

