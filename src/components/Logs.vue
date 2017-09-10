<template>
   <div class='content-container'>
     <div class='header-space'></div>
     <table>
      <tr class='logTitles'>
         <th>time</th>
         <th>name</th>
         <th>info</th>
         <th>userID</th>
         <th>email</th>
       </tr>
       <tr v-for='log in logs' class='logs'>
         <th> {{ log.time }} </th>
         <th> {{ log.name }} </th>
         <th> {{ log.info }} </th>
         <th> {{ log.userID }} </th>
         <th> {{ log.email }} </th>
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
        {name: '-', info: '-', time: '', userID: '', email: ''},
        {name: '-', info: '-', time: '', userID: '', email: ''}
      ]
    }
  },
  mounted () {
    let _this = this
    ax.get('https://hokie.io' + '/getLast100Logs')
      .then(function (result) {
        _this.logs = result.data.result
      })
  }
}
</script>

<style>

.logs-container {
  width: 100%;
  left: 0px;
  background-color: grey;
}

.logs th {
  text-align: left;
  color: black;
  font-weight: normal;
  border-left: thin solid black;
  border-bottom: thin solid black;
}

.logTitles th {
  text-align: left;
  font-weight: bold;
  border-left: thin solid black;
  border-bottom: thin solid black;
}

</style>
