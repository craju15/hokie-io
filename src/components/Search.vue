<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='big-title'>{{ pageTitle }}</div>
    <QuestionListItem
      v-for='(result, index) in results'
      :info='result'
      :delay='(index + 1) * 50'
      :key='index'
    />
    <div class='no-answers-yet-message' v-if='results.length == 0'>no results found :(</div>
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
        results: [
          {
            _id: 1,
            title: '-',
            name: 'Jacob Merizian',
            userID: 'jacob.merizian',
            date: '-',
            amt: 0
          },
          {
            _id: 1,
            title: '-',
            name: 'Jacob Merizian',
            userID: 'jacob.merizian',
            date: '-',
            amt: 0
          }
        ],
        pageTitle: 'Search Results'
      }
    },
    methods: {
      getSearchResults () {
        let _this = this
        // check what the type is from the url
        if (this.$route.params.type === 'categories') {
          window.notify(null, 'not done yet')
          this.pageTitle = 'Search by category: ' + this.$route.params.query
        } else if (this.$route.params.type === 'query') {
          this.pageTitle = 'Search results for: ' + this.$route.params.query
          ax.get(window.backend_url + '/getSearchResults/' + this.$route.params.query)
            .then((response) => {
              _this.results = response.data.results
            })
            .catch((error) => {
              console.log(error)
              window.notify(_this, error)
            })
        }
      }
    },
    beforeMount () {
      this.getSearchResults()
    },
    watch: {
      '$route': function () {
        this.getSearchResults()
      }
    }
  }
</script>

