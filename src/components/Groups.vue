<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='big-title'>Find a group:</div>
    <GroupListItem :key='info._id' v-for='info in groupNames' :info='info'/>
  </div>

</template>

<script>
import GroupListItem from '@/components/parts/GroupListItem'
import ax from 'axios'

export default {
  components: {
    GroupListItem
  },
  data () {
    return {
      groupNames: []
    }
  },
  mounted () {
    let _this = this
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

</style>
