<template>
  <div>
    <div class='answer' :style='styleAnswer'>
      <div class='voter'>
        <a href='#'><div class='voter-inc' v-on:click='incAmt'></div></a>
        <div class='voter-amt'>{{ info.amt }}</div>
        <div class='vote-state-plus' v-if='info.voteState == 1'>+1</div>
        <div class='vote-state-minus' v-if='info.voteState == -1'>-1</div>
        <a href='#'><div class='voter-dec' v-on:click='decAmt'></div></a>
      </div>
      <div class='answer-right-part'>
        <div class='ql-snow'>
          <div class='qa-body ql-editor' style='padding: 0px;'></div>
        </div>
        <div class='qa-person-info'>
          <router-link :to='"/profile/" + info.userID' class='qa-name'>{{ info.name }}</router-link>
          <span class='qa-date'>- {{ info.date }}</span>
        </div>
        <div class='qa-actions'>
          <a href='#' class='qa-action-report'>report answer</a>
        </div>
      </div>
      <a href='#'>
        <BlueButton text='Leave a Comment!' :clickFunction='openNewComment' :isLoggedIn='isLoggedIn'/>
        <!-- <div class='blue-button' v-on:click='openNewComment'>Leave a Comment!</div> -->
      </a>
    </div>
    <div class='comment-section'>
      <Comment
        :style='styleComment'
        v-for='(comment, index) in info.comments'
        :info='comment'
        :key='index'
        :delay='this.delay'
      />
      <NewComment
        :style='styleNewComment'
        :hideNewComment='hideNewComment'
        :postNewCommentHandler='postNewCommentHandler'
      />
    </div>
  </div>
</template>

<script>
  import BlueButton from '@/components/parts/BlueButton'
  import Comment from '@/components/parts/Comment'
  import NewComment from '@/components/parts/NewComment'
  import ax from 'axios'

  export default {
    props: ['info', 'delay', 'isLoggedIn'],
    data () {
      let col = '#eee'
      if (this.info.accepted) col = 'rgba(200, 255, 200, 1)'
      else if (this.info.amt < 0) col = 'pink'
      return {
        styleAnswer: {
          backgroundColor: col,
          animation: '0.3s ease-out 1 slideIn ' + this.delay + 'ms forwards'
        },
        styleComment: {
          animation: '0.3s ease-out 1 slideIn ' + this.delay + 'ms forwards'
        },
        styleNewComment: {
          display: 'none'
        },
        amt: this.info.amt
      }
    },
    methods: {
      incAmt (e) {
        e.preventDefault()
        this.handleAmtChange(1)
      },
      decAmt (e) {
        e.preventDefault()
        this.handleAmtChange(-1)
      },
      handleAmtChange (change) {
        let _this = this
        ax.get('http://localhost:3010/updateAnswerAmt?' +
          'change=' + change + '&answerID=' + this.info._id +
          '&email=' + window.getCookie('email') +
          '&sessionToken=' + window.getCookie('sessionToken'))
          .then(function (results) {
            console.log(_this.info.voteState)
            if (!results.data.err) {
              _this.info.amt = _this.info.amt + change
              if (change > 0) {
                _this.info.voteState = _this.info.voteState === 0 ? 1 : 0
              } else {
                _this.info.voteState = _this.info.voteState === 0 ? -1 : 0
              }
            } else {
              window.notify(_this, results.data.err)
            }
          })
      },
      openNewComment (e) {
        e ? e.preventDefault() : ''
        this.styleNewComment = {
          display: 'block'
        }
      },
      hideNewComment (e) {
        e ? e.preventDefault() : ''
        this.styleNewComment = {
          display: 'none'
        }
      },
      postNewCommentHandler (comment) {
        console.log('POSTING: ' + comment)
        let vueObject = this
        ax.get(window.backend_url + '/addNewComment?' +
          '&sessionToken=' + window.getCookie('sessionToken') +
          '&body=' + comment +
          '&userID=' + window.getCookie('userID') +
          '&email=' + window.getCookie('email') +
          '&answerID=' + this.info._id
        )
          .then((response) => {
            if (!response.data.err) {
              console.log('successful')
              vueObject.info.comments.push(response.data.commentInfo)
              vueObject.hideNewComment()
            } else {
              window.notify(null, response.data.err)
            }
          })
      }
    },
    components: {
      Comment, NewComment, BlueButton
    },
    mounted () {
      let _this = this
      let t = setInterval(function () {
        if (_this.info.body !== '-') {
          _this.$el.querySelector('.qa-body').innerHTML = _this.info.body
          clearInterval(t)
        }
      }, 100)
    }
  }
</script>

<style>

  .answer {
    opacity: 0;
    padding: 10px;
    width: 95%;
    margin: 0 auto;
    position: relative;
    display: flex;
    margin-bottom: 30px;
  }

  .answer-right-part {
    flex: 1;
    padding-left: 10px;
  }

  h2 {
    font-size: 24px;
    margin: 0px;
  }

</style>
