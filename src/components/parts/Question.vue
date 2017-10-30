<template>
  <div class='question'>
    <div class='voter'>
      <a href='#'><div class='voter-inc' v-on:click='incAmt'></div></a>
      <div class='voter-amt'>{{ info.amt }}</div>
      <div class='vote-state-plus' v-if='info.voteState == 1'>+1</div>
      <div class='vote-state-minus' v-if='info.voteState == -1'>-1</div>
      <a href='#'><div class='voter-dec' v-on:click='decAmt'></div></a>
    </div>
    <div class='question-right-part'>
      <h2>{{ info.title ? info.title : '---' }}</h2>
      <div class='ql-snow'>
        <div class='qa-body ql-editor' style='padding: 0px;'></div>
      </div>
      <div class='qa-person-info'>
        <router-link :to='"/profile/" + info.userID' class='qa-name'>{{ info.name }}</router-link>
        <span class='qa-date'>- {{ info.date }}</span>
      </div>
      <div class='qa-group'>
        Posted to <router-link :to='info.groupID ? "/group/" + info.groupID : "/"'>
          {{ info.groupTitle ? info.groupTitle : 'Front Page' }}
        </router-link>
      </div>
      <div class='qa-actions'>
        <a href='#' class='qa-action-duplicate'>mark as duplicate</a>
        <a href='#' class='qa-action-report'>report question</a>
      </div>
    </div>
    <a href='#'>
      <BlueButton text='Answer this Question!' :clickFunction='showNewAnswer' :isLoggedIn='isLoggedIn'/>
      <!-- <div class='blue-button' v-on:click='showNewAnswer'>Answer this Question!</div> -->
    </a>
  </div>
</template>

<script>
  import BlueButton from '@/components/parts/BlueButton'
  import ax from 'axios'

  export default {
    props: ['info', 'showNewAnswer', 'isLoggedIn'],
    components: {
      BlueButton
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
        ax.get(window.backend_url + '/updateQuestionAmt?' +
          'change=' + change + '&questionID=' + this.info._id +
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
      }
    },
    watch: {
      '$props': {
        handler: function (val, oldVal) {
          this.$el.querySelector('.qa-body').innerHTML = this.info.body
        },
        deep: true
      }
    }
  }
</script>

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }


  .question {
    opacity: 0;
    background-color: #eee;
    padding: 10px;
    width: 95%;
    margin: 0 auto;
    position: relative;
    display: flex;
    margin-bottom: 15px;
    animation: 0.3s ease-out 1 slideIn forwards;
  }

  .question-right-part {
    flex: 1;
    padding-left: 10px;
  }

  h2 {
    font-size: 20px;
    margin: 0px;
  }

 </style>
