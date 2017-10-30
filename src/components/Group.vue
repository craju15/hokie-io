<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='home-container'>
      <div class='home-left-side'>
        <TopMessage ref='topMessage' />
        <div class='group-title'>{{ groupTitle }}<span @click='handleEditMotd' v-if='!editingMotd'> - {{ groupMotd }}</span></div>
        <div v-if='editingMotd' class='edit-motd'>
          <input id='motd-input' :value='groupMotd' @keydown='handleSubmitMotd'/>
          <a @click='handleSubmitMotd' href='#'>submit</a>
          &nbsp;
          <a @click='cancelEditMotd' href='#'>cancel</a>
        </div>
        <a v-if='!isInGroup' @click='handleJoinGroup' class='join-group-button'>
          Join group
        </a>
        <a v-if='isInGroup' @click='handlePostToGroup' class='join-group-button'>
          Post to group
        </a>
        <a v-if='isInGroup' @click='handleLeaveGroup' class='leave-group-button'>
          Leave group
        </a>
        <div class='big-title'>Recent Questions</div>
        <QuestionListItem
          v-for='(result, index) in recentResults'
          :info='result'
          :delay='(index + 1) * 1'
          :key='index'
        />
        <a v-if='recentResults.length > 5' @click='loadMore' query='recent' class='load-more-button'>see more</a>
        <div class='big-title'>Popular Questions</div>
        <QuestionListItem
          v-for='(result, index) in popularResults'
          :info='result'
          :delay='(index + 1) * 1'
          :key='index'
        />
        <a v-if='recentResults.length > 5' @click='loadMore' query='popular' class='load-more-button'>see more</a>
      </div>
      <div class='home-right-side'>
        <div class='medium-title'>Join some groups!</div>
        <router-link :to='isLoggedIn ? "/newgroup" : "/login"' id='new-group-button'>Create a New Group!</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import QuestionListItem from '@/components/parts/QuestionListItem'
  import TopMessage from '@/components/parts/TopMessage'
  import ax from 'axios'

  export default {
    name: 'search',
    props: ['isLoggedIn'],
    components: {
      QuestionListItem,
      TopMessage
    },
    data () {
      return {
        recentResults: [
//          {
//            _id: 1,
//            title: '-',
//            name: 'Jacob Merizian',
//            userID: 'jacob.merizian',
//            date: '-',
//            amt: 0
//          },
//          {
//            _id: 1,
//            title: '-',
//            name: 'Jacob Merizian',
//            userID: 'jacob.merizian',
//            date: '-',
//            amt: 0
//          }
        ],
        popularResults: [],
        groupTitle: '--',
        groupMotd: '--',
        editingMotd: false,
        isInGroup: false
      }
    },
    methods: {
      loadMore (e) {
        e.preventDefault()
        let query = e.target.getAttribute('query')
        let _this = this
        _this.$router.push({path: '/more/' + query + '/' + _this.$route.params.groupID})
        console.log('0')
      },
      handleJoinGroup (e) {
        e.preventDefault()
        let _this = this
        ax.get(window.backend_url + '/joinGroup' +
        '?email=' + window.getCookie('email') +
        '&sessionToken=' + window.getCookie('sessionToken') +
        '&userID=' + window.getCookie('userID') +
        '&groupID=' + _this.$route.params.groupID)
          .then(function (response) {
            if (response.data.err) {
              window.notify(null, response.data.err)
            } else {
              _this.$refs.topMessage.display('Welcome aboard!')
              _this.isInGroup = true
            }
          })
      },
      handlePostToGroup (e) {
        e.preventDefault()
        this.$router.push({path: '/newquestion/' + this.$route.params.groupID})
      },
      handleLeaveGroup (e) {
        e.preventDefault()
        let _this = this
        ax.get(window.backend_url + '/removeUserFromGroup' +
        '?email=' + window.getCookie('email') +
        '&userID=' + window.getCookie('userID') +
        '&sessionToken=' + window.getCookie('sessionToken') +
        '&groupID=' + _this.$route.params.groupID)
          .then(function (response) {
            if (!response.data.err) {
              _this.isInGroup = false
            } else {
              window.notify(null, response.data.err)
            }
          })
      },
      handleEditMotd (e) {
        e.preventDefault()
        this.editingMotd = true
      },
      cancelEditMotd (e) {
        e.preventDefault()
        this.editingMotd = false
      },
      handleSubmitMotd (e) {
        let _this = this
        if (e.key === 'Enter' || !e.key) {
          console.log('hi')
          ax.get(window.backend_url + '/editMotd' +
          '?email=' + window.getCookie('email') +
          '&userID=' + window.getCookie('userID') +
          '&sessionToken=' + window.getCookie('sessionToken') +
          '&groupID=' + _this.$route.params.groupID +
          '&newMotd=' + _this.$el.querySelector('#motd-input').value)
            .then(function (response) {
              if (!response.data.err) {
                console.log(response)
                _this.editingMotd = false
                _this.groupMotd = _this.$el.querySelector('#motd-input').value
              } else {
                window.notify(null, response.data.err)
              }
            })
        }
      }
    },
    mounted () {
      let _this = this
      ax.get(window.backend_url + '/getGroup/' +
      '?group=' + this.$route.params.groupID)
        .then((response) => {
          _this.groupTitle = response.data.group.title
          _this.groupMotd = response.data.group.motd
        })

      ax.get(window.backend_url + '/getRecentQuestionsByGroup/' +
      '?email=' + window.getCookie('email') +
      '&groupID=' + this.$route.params.groupID)
        .then((response) => {
          if (!response.data.err) {
            _this.recentResults = response.data.results
          } else {
            window.notify(null, response.data.err)
          }
        })
        .catch((error) => {
          window.notify(_this, error)
        })

      ax.get(window.backend_url + '/checkIfUserInGroup' +
      '?email=' + window.getCookie('email') +
      '&groupID=' + _this.$route.params.groupID +
      '&userID=' + window.getCookie('userID'))
        .then((response) => {
          if (response.data.err) {
            window.notify(null, response.data.err)
          } else {
            _this.isInGroup = response.data.isInGroup
          }
        })

      ax.get(window.backend_url + '/getPopularQuestionsByGroup/' +
      '?email=' + window.getCookie('email') +
      '&group=' + this.$route.params.groupID)
        .then((response) => {
          _this.popularResults = response.data.results
        })
        .catch((error) => {
          window.notify(null, error)
        })
    }
  }
</script>

<style>
.home-container {
  display: flex;
}

.home-left-side {
  flex: 0.8;
}

.home-right-side {
  padding-top: 20px;
  flex: 0.2;
}

.join-group-button {
   background-color: rgba(100, 100, 250, 1);
   color: white;
   font-size: 17px;
   font-weight: bold;
   text-align: center;
   width: 100px;
   padding: 3px;
   border-radius: 3px;
   display: inline-block;
   float: right;
   margin-right: 20px;
   position: relative;
}

.join-group-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;
}

.leave-group-button {
   background-color: red;
   color: white;
   font-size: 17px;
   font-weight: bold;
   text-align: center;
   width: 100px;
   padding: 3px;
   border-radius: 3px;
   display: inline-block;
   float: right;
   margin-right: 20px;
   position: relative;
}

.leave-group-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;
}


  #new-group-button {
    background-color: rgba(100, 100, 250, 1);
    color: white;
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    padding: 3px;
    margin-right: 10px;
    border-radius: 3px;
    display: block;
    margin: 0 auto;
  }

  #new-group-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;
  }

  .group-title {
    color: maroon;
    margin-left: 20px;
    margin-bottom: 8px;
    font-size: 27px;
    font-weight: bold;
    display: inline-block;
  }

  .group-title span {
    color: orange;
    font-weight: normal;
    font-size: 20px;
    font-style: italic;
    cursor: pointer;
  }

  .edit-motd {
    display: inline-block;
  }

</style>
