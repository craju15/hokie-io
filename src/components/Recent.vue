<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='big-title'>Recent Questions</div>
    <QuestionListItem
      v-for='(result, index) in results'
      :info='result'
      :delay='(index + 1) * 50'
      :key='index'
    />
    <a class='load-more-button' style='display:none;'>load more</a>
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
        ]
      }
    },
    mounted () {
      let _this = this
      ax.get(window.backend_url + '/getRecentQuestions/' +
      '?email=' + window.getCookie('email'))
        .then((response) => {
          _this.results = response.data.results
        })
        .catch((error) => {
          window.notify(_this, error)
        })
    }
  }
</script>

