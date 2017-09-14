<template>
  <div class='content-container'>
    <div class='header-space'></div>
      <div class='big-title'>Profile</div>
      <UserBlock 
        :info='blockInfo'
        :handleChangePic='showModal'
        :isLoggedIn='isLoggedIn'
      />
      <div class='limit-warning-modal-container' :style='modalStyles'>
        <div class='modal-background'></div>
        <div class='limit-warning-modal'>
          <div class='modal-title'>Change Color</div>
          <div class='modal-body'>Type in your color choice (HTML color codes are supported):</div>
          <input id='picUrlInput' placeholder='i.e., lightgreen, pink, #91FF00, ...' style='width: 95%;'/><br /><br />
          <a class='post-button' v-on:click='handleChangePic'>Okay</a>
          <a class='cancel-button' v-on:click='hideModal'>Cancel</a>
        </div>
      </div>
      <div class='profile-bottom' style='background-color: grey; display: none;'>
        <div class='profile-questions'>
          <div class='section-title'>Questions</div>
          <div class='profile-qa-block'>
            <p>total questions: <span>{{ otherStats.totalQuestions }}</span></p>
            <p>total upvotes on questions: <span>{{ otherStats.totalQuestionUpvotes }}</span></p>
          </div>
          <div class='section-title'>Top Questions</div>
          <QuestionTag 
            v-for='(questionTag, index) in questionTags'
            :info='questionTag'
            :key='index'
          />
        </div>
        <div class='profile-answers'>
          <div class='section-title'>Answers</div>
          <div class='profile-qa-block'>
            <p>total answers: <span>{{ otherStats.totalAnswers }}</span></p>
            <p>total upvotes on answers: <span>{{ otherStats.totalAnswerUpvotes }}</span></p>
          </div>
          <div class='section-title'>Top Answers</div>
          <p>I'm still making this!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserBlock from '@/components/parts/UserBlock'
  import QuestionTag from '@/components/parts/QuestionTag'
  import Modal from '@/components/parts/Modal'
  import ax from 'axios'

  export default {
    components: {
      UserBlock,
      QuestionTag,
      Modal
    },
    props: ['isLoggedIn', 'userID'],
    data () {
      // TODO: add loading animation
      return {
        modalStyles: {display: 'none'},
        blockInfo: {
          name: '-',
          pic: '-',
          hokieRank: '-',
          dateJoined: '-',
          peopleReached: '-'
        },
        otherStats: {
          totalQuestions: '-',
          totalAnswers: '-',
          totalQuestionUpvotes: '-',
          totalAnswerUpvotes: '-'
        },
        questionTags: [
          {
            amt: '-',
            title: '-'
          },
          {
            amt: '-',
            title: '-'
          }
        ]
      }
    },
    watch: {
      '$route': function () {
        this.getProfile()
      }
    },
    beforeMount () {
      this.getProfile()
    },
    methods: {
      getProfile () {
        let _this = this
        ax.get(window.backend_url + '/getProfile/' + this.$route.params.userID +
          '?email=' + window.getCookie('email') +
          '&userID=' + window.getCookie('userID'))
          .then((response) => {
            if (!response.data.error) {
              _this.blockInfo = response.data.blockInfo
              _this.otherStats = response.data.otherStats
              _this.questionTags = response.data.questionTags
            } else {
              // TODO: Handle user not found error
            }
          })
          .catch((error) => {
            window.notify(_this, error)
          })
      },
      handleChangePic () {
        let _this = this
        ax.get(window.backend_url + '/changeProfilePic?' +
          'userID=' + window.getCookie('userID') +
          '&email=' + window.getCookie('email') +
          '&sessionToken=' + window.getCookie('sessionToken') +
          '&url=' + _this.$el.querySelector('#picUrlInput').value)
          .then(function (results) {
            if (results.data.err) {
              window.notify(false, results.data.err)
            } else {
              _this.$router.push({path: '/'})
              _this.$router.push({path: '/profile/' + window.getCookie('userID')})
              _this.hideModal()
            }
          }).catch(function (err) {
            window.notify(err)
          })
      },
      showModal (e) {
        e ? e.preventDefault() : ''
        this.modalStyles = {display: 'block'}
      },
      hideModal (e) {
        e ? e.preventDefault() : ''
        this.modalStyles = {display: 'none'}
      }
    }
  }
</script>

<style>

  .profile-bottom {
    display: flex;
  }

  .profile-questions {
    flex: 0.5;
    padding: 15px;
  }

  .profile-answers {
    flex: 0.5;
    padding: 15px;
  }

  .profile-answers p {
    text-align: center;
  }

  .profile-qa-block {
    opacity: 0;
    background-color: #eee;
    height: 50px;
    padding: 10px;
    animation: 0.3s ease-out 1 slideIn forwards;
    margin-bottom: 10px;
    text-align: center;
  }

  .profile-qa-block p {
    margin: 0px;
    line-height: 22px;
    color: grey;
  }

  .profile-qa-block span {
    font-weight: bold;
    color: black;
    padding-left: 10px;
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
