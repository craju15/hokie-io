<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <Group :key='info._id' v-for='info in groupNames' :info='info'/>
  </div>

</template>

<script>
import Group from '@/components/parts/Group'
import ax from 'axios'

export default {
  components: {
    Group
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
