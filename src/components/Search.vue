<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='big-title'>{{ pageTitle }}</div>
    <QuestionListItem
      v-for='(result, index) in recentResults'
      :info='result'
      :delay='(index + 1) * 50'
      :key='index'
    />
    <div class='no-answers-yet-message' v-if='recentResults.length == 0'>no results found :(</div>
    <a class='load-more-button' style='display:none;'>load more</a>
    </div>
  </div>
</template>

<script>
  import QuestionListItem from '@/components/parts/QuestionListItem'
  import ax from 'axios'

  export default {
    name: 'home',
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
        pageTitle: 'Search Results'
      }
    },
    mounted () {
      let _this = this
      // check what the type is from the url
      if (_this.$route.params.type === 'groups') {
        _this.pageTitle = 'Search by category: ' + _this.$route.params.query
        ax.get(window.backend_url + '/searchQuestionsByGroup/' +
        '?group=' + _this.$route.params.query +
        '&email=' + window.getCookie('email'))
          .then(function (response) {
            console.log(response)
            // _this.recentResults = response.data.results
          })
          .catch(function (error) {
            window.notify(null, error)
          })
      } else if (this.$route.params.type === 'query') {
        this.pageTitle = 'Search results for: ' + this.$route.params.query
        ax.get(window.backend_url + '/getSearchResults/' + this.$route.params.query +
          '?userID=' + window.getCookie('userID') +
          '&email=' + window.getCookie('email'))
          .then(function (response) {
            _this.recentResults = response.data.results
          })
          .catch(function (error) {
            console.log(error)
            window.notify(_this, error)
          })
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
