<template>
   <div class='content-container'>
     <div class='header-space'></div>
     <table class='logs'>
       <tr>
         <th>time</th>
         <th>email</th>
         <th>name</th>
         <th>info</th>
         <!-- <th>userID</th> -->
       </tr>
       <tr v-for='log in logs'>
         <td> {{ log.time }} </td>
         <td> {{ log.email ? log.email : 'X' }} </td>
         <td> {{ log.name }} </td>
         <td> {{ log.info }} </td>
         <!-- <td> {{ log.userID }} </td> -->
       </tr>
     </table>
   </div>
</template>

<script>
import ax from 'axios'

export default {
  data () {
    return {
      logs: [
        // {name: '-', info: '-', time: '', userID: '', email: ''},
        // {name: '-', info: '-', time: '', userID: '', email: ''}
      ]
    }
  },
  mounted () {
    let _this = this
    let t = setInterval(function () {
      ax.get('https://hokie.io' + '/getLast100Logs')
        .then(function (result) {
          let logs = result.data.result
          _this.logs = logs
          if (_this.$route.path !== '/logs') {
            clearInterval(t)
          }
        })
    }, 500)
  }
}
</script>

<style>

.logs-container {
  width: 100%;
  left: 0px;
  background-color: grey;
}

.logs td {
  text-align: left;
  color: black;
  font-weight: normal;
  border-left: thin solid lightgrey;
  border-bottom: thin solid lightgrey;
  padding: 5px;
  max-width: 300px;
  word-wrap: break-word;
}

.logs th {
  text-align: center;
  font-weight: bold;
  border-left: thin solid lightgrey;
  border-bottom: thin solid lightgrey;
  padding: 5px;
}

</style>
