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
        <div class='medium-title'>Find your major:</div>
      </div>
    </div>
  </div>
</template>

<script>
  import QuestionListItem from '@/components/parts/QuestionListItem'
  import ax from 'axios'

  export default {
    name: 'search',
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
        popularResults: []
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
</style>
