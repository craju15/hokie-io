<template>
  <div id="app">
    <div class='container'>
      <Notification ref='notification' />
      <PageHeader :isLoggedIn='isLoggedIn' :userID='userID' :updateLoginStatus='updateLoginStatus'/>
      <router-view :isLoggedIn='isLoggedIn' :updateLoginStatus='updateLoginStatus' :updateUserID='updateUserID'/>
      <div class='stupid-ad-container'>
        <div class='header-space'></div>
        <!-- AD SPACE -->
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/parts/Header'
  import Notification from '@/components/parts/Notification'
  // import ax from 'axios'

  export default {
    name: 'app',
    components: {
      'PageHeader': Header,
      Notification
    },
    data () {
      return {
        isLoggedIn: !!window.getCookie('sessionToken'),
        userID: window.getCookie('userID')
      }
    },
    beforeCreate () {
      /* eslint-disable */
      let _this = this;

      // webpack will replace the BACKEND_URL DEV_MODE variables
      window.backend_url = BACKEND_URL;
      
      window.dev_mode = DEV_MODE;

      window.browser_code = 'f5903f51e341a783e69ffc2d9b335048716f5f040a782a2764cd4e728b0f74d9';

      window.cookie_expire_time = 7; // TODO: Make this longer

      window.notify = function (ParentObj, message) {
        _this.$refs.notification.notify(message)
      }

      window.default_pic = 'https://pbs.twimg.com/profile_images/676496806646272000/k2hLF7zz.jpg'

//      window.fbAsyncInit = function() {
//        FB.init({
//          appId: '157550674792199',
//          cookie: true,
//          xfbml: true,
//          version: 'v2.8'
//        });
//        FB.AppEvents.logPageView()
//        FB.getLoginStatus(function (response) {
//          _this.isLoggedIn = !!response.authResponse
//        })
//      };

      window.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      };

      window.deleteCookie = function (cname) {
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      };

      window.getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return undefined;
      };

//      (function(d, s, id){
//         var js, fjs = d.getElementsByTagName(s)[0];
//         if (d.getElementById(id)) {return;}
//         js = d.createElement(s); js.id = id;
//         js.src = "//connect.facebook.net/en_US/sdk.js";
//         fjs.parentNode.insertBefore(js, fjs);
//       }(document, 'script', 'facebook-jssdk'));

      /* eslint-enable */
    },
    methods: {
      updateLoginStatus () {
        this.isLoggedIn = !!window.getCookie('sessionToken')
      },
      updateUserID () {
        this.userID = window.getCookie('userID')
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i');
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  @keyframes slideIn {
    from {
      /* transform: translateX(-5%); */
      opacity: 0;
    }
    to {
      /* transform: translateX(0); */
      opacity: 1;
    }
  }

  .answer,
  .newanswer,
  .comment,
  .newcomment,
  .question,
  .question-list-item,
  .blue-button,
  .post-button,
  .cancel-button {
    /* box-shadow: 4px 4px 2px 0px rgba(60, 60, 60, 0.4); */
  }

  .question-list-item,
  .blue-button,
  .post-button,
  .cancel-button {
    transition: all 0.2s;
  }

  a:focus {
    outline: none;
  }

  #app {
    font-family: 'PT Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
  }

  a {
    cursor: pointer;
    cursor: hand;
    text-decoration: none;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
  }

  .content-container {
    flex: 1;
    position: relative;
  }

  .stupid-ad-container {
    width: 0px;
    background-color: grey;
    margin-left: 10px;
    margin-right: 10px;
  }

  .simple-box {
    width: 100%;
    background-color: #eee;
    padding: 15px;
    font-size: 20px;
    animation: 0.3s ease-out 1 slideIn forwards;
    margin-bottom: 15px;
  }

  @keyframes rainbow {
    0% {background-position: 0% 82%}
    50% {background-position: 100% 19%}
    100% {background-position: 0% 82%}
  }

  /* Q + A SHARED STYLES  */
  .qa-body {
    margin-top: 5px;
    margin-bottom: 5px;
    font-family: Roboto;
  }

  .qa-actions,
  .qa-person-info {
    margin-bottom: 5px;
  }

  .qa-name,
  .qa-action-duplicate,
  .qa-action-report {
    color: rgba(100, 100, 250, 1);
    font-size: 13px;
  }

  .qa-name:hover,
  .qa-action-duplicate:hover,
  .qa-action-report:hover {
    color: rgba(150, 150, 250, 1);
  }

  .header-space {
    height: 60px;
    position: relative;
    width: 100%;
  }

  @media screen and (max-width: 820px) {
    .header-space {
      height: 170px;
    }
  }

  .qa-date {
    color: #888;
    font-size: 13px;
  }

  .qa-action-duplicate,
  .qa-action-report {
    font-weight: bold;
    margin-right: 15px;
  }

  .voter {
    width: 40px;
  }

  .voter-inc {
    border-bottom: 13px solid #555;
  }

  .voter-inc:hover {
    border-bottom: 13px solid #777;
  }

  .voter-dec {
    border-top: 13px solid #555;
  }

  .voter-dec:hover {
    border-top: 13px solid #777;
  }

  .voter-inc, .voter-dec {
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    margin: 0 auto;
  }

  .voter-amt {
    font-size: 25px;
    text-align: center;
    color: #666;
    line-height: 45px;
    width: 70px;
    position: relative;
    left: -16px;
  }

  .comment-section {
    min-width: 50px;
    position: relative;
    top: -12px;
    left: 0px;
    margin-left: 20px;
    margin-right: 100px;
    margin-bottom: 10px;
  }

  @media only screen and (max-width: 600px) {
    .comment-section {
      margin-right: 20px;
    }
  }

  .section-title {
    font-weight: bold;
    padding-left: 6px;
    padding-bottom: 6px;
    animation: 0.3s ease-out 1 slideIn forwards;
  }

  .load-more-button {
    opacity: 0;
    display: block;
    line-height: 15px;
    height: 15px;
    padding: 8px;
    color: white;
    font-weight: bold; 
    width: 100px;
    text-align: center;
    background-color: grey;
    font-size: 18px;
    margin: 0 auto;
    position: relative;
    animation: 0.3s ease-out 1 slideIn 0.3s forwards;
  }

  .load-more-button:hover {
    opacity: 0.5;
  }

  .load-more-button:active {
    background-color: grey;
  }

  .big-title {
    font-size: 23px;
    font-weight: bold;
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .medium-title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .go-back {
    opacity: 0;
    margin-left: 15px;
    height: 30px;
    display: block;
    color: rgba(100, 100, 250, 1);
    font-weight: bold;
    animation: 0.3s ease-out 1 slideIn forwards;
  }

  .vote-state-plus,
  .vote-state-minus {
    animation: 0.3s ease-out 1 slideIn forwards;
    position: absolute;
    left: 18px;
    font-size: 20px;
    color: white;
    font-weight: bold;
    border-radius: 25px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
  }

  .vote-state-plus {
    top: 5px;
    background-color: green;
  }

  .vote-state-minus {
    top: 60px;
    background-color: red;
  }

  /* POST/CANCEL BUTTONS */

  .post-button {
    font-family: 'PT Sans';
    width: 40px;
    height: 25px;
    background-color: green;
    padding: 5px;
    text-align: center;
    line-height: 25px;
    color: white;
    font-weight: bold;
    font-size: 17px;
    display: inline-block;
    position: relative;
  }

  .post-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;

  }

  .post-button:active {
    left: 4px;
    top: 4px;
    box-shadow: none;
  }

  .cancel-button {
    font-family: 'PT Sans';
    height: 25px;
    background-color: red;
    padding: 5px;
    text-align: center;
    line-height: 25px;
    color: white;
    font-weight: bold;
    font-size: 17px;
    display: inline-block;
    position: relative;
    margin-left: 5px;
  }
  
  .cancel-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;

  }

  .cancel-button:active {
    left: 4px;
    top: 4px;
    box-shadow: none;
  }

  /* QUILL EDITOR */
  .editor,
  .answer-editor {
    background-color: white;
    font-size: 17px;
    width: 100%;
  }

  /* Checkbox */
/*  input[type=checkbox].css-checkbox {
    position:absolute; z-index:-1000; left:-1000px; overflow: hidden; clip: rect(0 0 0 0); height:1px; width:1px; margin:-1px; padding:0; border:0;
  }
  input[type=checkbox].css-checkbox + label.css-label {
    padding-left:29px;
    height:24px; 
    display:inline-block;
    line-height:24px;
    background-repeat:no-repeat;
    background-position: 0 0;
    font-size:24px;
    vertical-align:middle;
    cursor:pointer;
  }
  input[type=checkbox].css-checkbox:checked + label.css-label {
    background-position: 0 -24px;
  }
  label.css-label {
    background-image:url(http://csscheckbox.com/checkboxes/u/csscheckbox_4f6bc9a7cc47504b9c36e04aa489f19e.png);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
 } */

input[type=checkbox].css-checkbox {
  position:absolute; z-index:-1000; left:-1000px; overflow: hidden; clip: rect(0 0 0 0); height:1px; width:1px; margin:-1px; padding:0; border:0;
}
input[type=checkbox].css-checkbox + label.css-label {
		padding-left:30px;
		height:25px; 
		display:inline-block;
		line-height:25px;
		background-repeat:no-repeat;
		background-position: 0 0;
		font-size:25px;
		vertical-align:middle;
		cursor:pointer;
}
input[type=checkbox].css-checkbox:checked + label.css-label {
  background-position: 0 -25px;
}
label.css-label {
  background-image:url(http://csscheckbox.com/checkboxes/u/csscheckbox_391ce065f36b1460c4845fa9b5173fba.png);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

