<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='home-container'>
      <div class='home-left-side'>
        <div class='big-title'>Recent Questions</div>
        <QuestionListItem
          v-for='(result, index) in recentResults'
          :info='result'
          :delay='(index + 1) * 1'
          :key='index'
        />
        <a class='load-more-button'>see more</a>
        <div class='big-title'>Popular Questions</div>
        <QuestionListItem
          v-for='(result, index) in popularResults'
          :info='result'
          :delay='(index + 1) * 1'
          :key='index'
        />
        <a class='load-more-button'>see more</a>
      </div>
      <div class='home-right-side'>
        <div class='medium-title'>Join some groups!</div>
        <router-link :to='isLoggedIn ? "/newgroup" : "/login"' id='new-group-button'>Create a New Group!</router-link>
        <div class='list-of-groups'>
          <GroupListItem />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QuestionListItem from '@/components/parts/QuestionListItem'
  import ax from 'axios'

  export default {
    name: 'search',
    props: ['isLoggedIn'],
    components: {
      QuestionListItem
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
        groupNames: []
      }
    },
    mounted () {
      let _this = this
      ax.get(window.backend_url + '/getRecentQuestions/' +
      '?email=' + window.getCookie('email'))
        .then((response) => {
          _this.recentResults = response.data.results
        })
        .catch((error) => {
          window.notify(_this, error)
        })

      ax.get(window.backend_url + '/getPopularQuestions/' +
      '?email=' + window.getCookie('email'))
        .then((response) => {
          _this.popularResults = response.data.results
        })
        .catch((error) => {
          window.notify(null, error)
        })
      ax.get(window.backend_url + '/getGroups' +
      '?courses=true' +
      '&email=' + window.getCookie('email'))
        .then(function (result) {
          if (result.data.err) {
            window.notify(null, result.data.err)
          } else {
            _this.groupNames = result.data.results
          }
        })

    }
  }
</script>

<style>
.home-container {
  display: flex;
}

.home-left-side {
  flex: 0.7;
}

.home-right-side {
  padding-top: 20px;
  flex: 0.3;
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

</style>
