<template>
   <div class='content-container'>
     <div class='header-space'></div>
     <div class='logs'>
     </div>
   </div>
</template>

<script>
import ax from 'axios'

export default {
  mounted () {
    let _this = this
    ax.get(window.backend_url + '/getLast100Logs')
      .then(function (result) {
        console.log(result.data.result)
        _this.$el.querySelector('.logs').innerHTML = result.data.result
      })
  }
}
</script>
