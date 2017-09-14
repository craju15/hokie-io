<template>
  <div class='content-container'>
  <Notification ref='notification'/>
  <div class='header-space'></div>
  <router-link to='#' class='go-back' style='display: none;'>go back</router-link>
  <Question :info='questionInfo' :showNewAnswer='showNewAnswer' :isLoggedIn='isLoggedIn'/>
  <div class='section-title'>Answers:</div>
    <Answer 
      v-for='(answer, index) in answers' 
      :info='answer'
      :delay='(index + 1) * 50'
      :key='index'
      :isLoggedIn='isLoggedIn'
    />
    <div class='no-answers-yet-message' v-if='answers.length == 0'>no answers yet :(</div>
    <NewAnswer
      :style='styleNewAnswer'
      :hideNewAnswer='hideNewAnswer'
      :postNewAnswerHandler='postNewAnswerHandler'
    />
  </div>
</template>

<script>
  import Question from '@/components/parts/Question'
  import Answer from '@/components/parts/Answer'
  import NewAnswer from '@/components/parts/NewAnswer'
  import Notification from '@/components/parts/Notification'
  import SideAd from '@/components/parts/SideAd'
  import ax from 'axios'

  export default {
    name: 'home',
    props: ['isLoggedIn'],
    components: {
      Question,
      Answer,
      NewAnswer,
      Notification,
      SideAd
    },
    methods: {
      hideNewAnswer (e) {
        e ? e.preventDefault() : ''
        this.styleNewAnswer = {
          display: 'none'
        }
      },
      showNewAnswer (e) {
        e ? e.preventDefault() : ''
        this.styleNewAnswer = {
          display: 'block'
        }
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight)
        }, 10)
      },
      postNewAnswerHandler (answer) {
        let _this = this
        console.log('POSTING ANSWER: ' + answer)
        ax.get(window.backend_url + '/addNewAnswer?' +
          '&sessionToken=' + window.getCookie('sessionToken') +
          '&body=' + answer +
          '&userID=' + window.getCookie('userID') +
          '&email=' + window.getCookie('email') +
          '&questionID=' + this.$route.params.questionID
        )
          .then((response) => {
            if (!response.data.err) {
              console.log('successful')
              response.data.answerInfo.voteState = 0
              _this.answers.push(response.data.answerInfo)
              _this.hideNewAnswer()
            } else {
              window.notify(_this, response.data.err)
            }
          })
      },
      goBack () {
        // TODO: fix this
        this.$router.go(-1)
      },
      getQuestion () {
        ax.get(window.backend_url + '/getQuestionInfo/' + this.$route.params.questionID +
          '/?email=' + window.getCookie('email') +
          '&userID=' + window.getCookie('userID'))
          .then((response) => {
            let email = window.getCookie('email')
            let questionVoteState = 0
            if (response.data.questionInfo.upVoters.includes(email)) {
              questionVoteState = 1
            } else if (response.data.questionInfo.downVoters.includes(email)) {
              questionVoteState = -1
            }
            this.answers = response.data.answers.map(function (answer) {
              let answerVoteState = 0
              if (answer.upVoters.includes(email)) {
                answerVoteState = 1
              } else if (answer.downVoters.includes(email)) {
                answerVoteState = -1
              }
              answer.voteState = answerVoteState
              return answer
            })
            this.questionInfo = response.data.questionInfo
            this.questionInfo.voteState = questionVoteState
          })
      }
    },
    beforeMount () {
      this.getQuestion()
    },
    watch: {
      '$route': function () {
        this.getQuestion()
      }
    },
    data () {
      return {
        styleNewAnswer: {
          display: 'none'
        },
        questionInfo: {
          amt: 0,
          title: '-',
          body: '-',
          name: '-',
          date: '-',
          voteState: 0
        },
        answers: [
          {
            amt: 0,
            body: '-',
            name: '-',
            date: '-',
            accepted: false,
            voteState: 0,
            comments: [
              {
                body: '-',
                name: '-',
                date: '-'
              },
              {
                body: '-',
                name: '-',
                date: '-'
              }
            ]
          },
          {
            amt: 0,
            body: '-',
            name: '-',
            date: '-',
            accepted: false,
            voteState: 0,
            comments: [
              {
                body: '-',
                name: '-',
                date: '-'
              }
            ]
          },
          {
            amt: 0,
            body: '-',
            name: '-',
            date: '-',
            accepted: false
          }
        ]
      }
    }
  }
</script>

<style>
  .no-answers-yet-message {
    color: #999;
    text-align: center;
    font-size: 20px;
  }
</style>
