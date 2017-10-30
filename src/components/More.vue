<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='big-title'>{{ (groupTitle ? (groupTitle + ': ') : '') + title }}</div>
    <div class='list-of-results'>
      <QuestionListItem
        v-for='(result, index) in results'
        :info='result'
        :delay='(index + 1) * 1'
        :key='index'
      />
      <a @click='loadMore' class='load-more-button'>load more</a>
    </div>
  </div>
</template>

<script>
import ax from 'axios'
import QuestionListItem from '@/components/parts/QuestionListItem'

export default {
  components: {
    QuestionListItem
  },
  mounted () {
    let _this = this
    let query = this.$route.params.query
    let group = this.$route.params.group
    _this.groupID = group
    if (group) {
      if (query === 'recent') {
        _this.url = '/getMoreRecentByGroup'
        _this.sendQuery()
        _this.title = 'Recent Questions'
      } else if (query === 'popular') {
        _this.url = '/getMorePopularByGroup'
        _this.sendQuery()
        _this.title = 'Popular Questions'
      }
    } else {
      if (query === 'recent') {
        _this.url = '/getMoreRecent'
        _this.sendQuery()
        _this.title = 'Recent Questions'
      } else if (query === 'popular') {
        _this.url = '/getMorePopular'
        _this.sendQuery()
        _this.title = 'Popular Questions'
      }
    }
  },
  methods: {
    loadMore (e) {
      e.preventDefault()
      this.skip = this.skip + 10
      console.log(this.skip)
      this.results.concat(this.sendQuery(this.url))
    },
    sendQuery (url) {
      let _this = this
      ax.get(window.backend_url + _this.url +
      '?email=' + window.getCookie('email') +
      '&group=' + _this.groupID +
      '&skip=' + _this.skip)
        .then(function (response) {
          _this.results = _this.results.concat(response.data.results)
          _this.groupTitle = response.data.groupTitle
        })
    }
  },
  data () {
    return {
      results: [],
      title: '--',
      skip: 0,
      url: '',
      groupTitle: '--'
    }
  }
}
</script>

<style>

  .about-the-creator {
    width: 100%;
    background-color: #eee;
    padding: 15px;
    font-size: 20px;
    animation: 0.3s ease-out 1 slideIn forwards;
    margin-bottom: 15px;
  }

  .about-the-creator a {
    color: black;
    font-weight: bold;
    text-decoration: underline;
  }

  .about-the-creator a:hover {
    color: grey;
  }
</style>
