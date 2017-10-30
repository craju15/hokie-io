<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='all-groups-div'>
      <div class='my-groups-div'>
        <div class='big-title'>My groups:</div>
        <GroupListItem :key='info._id' v-for='info in myGroupNames' :info='info'/>
      </div>
      <div class='find-groups-div'>
        <div class='big-title'>All groups:</div>
        <GroupListItem :key='info._id' v-for='info in groupNames' :info='info'/>
        <router-link :to='isLoggedIn ? "/newgroup" : "/login"' id='new-group-button'>Create a New Group!</router-link>
      </div>
    </div>
  </div>

</template>

<script>
import GroupListItem from '@/components/parts/GroupListItem'
import ax from 'axios'

export default {
  props: ['isLoggedIn'],
  components: {
    GroupListItem
  },
  data () {
    return {
      groupNames: [],
      myGroupNames: []
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

    ax.get(window.backend_url + '/getGroupsForUser' +
    '?email=' + window.getCookie('email') +
    '&userID=' + window.getCookie('userID'))
      .then(function (result) {
        if (result.data.err) {
          window.notify(null, result.data.err)
        } else {
          _this.myGroupNames = result.data.results
        }
      })
  }
}
</script>

<style scoped>
.all-groups-div {
  display: flex;
}
.my-groups-div {
  flex: 0.5;
  padding-right: 15px;
}

.find-groups-div {
  flex: 0.5;
  padding-left: 15px;
}

#new-group-button {
  background-color: rgba(100, 100, 250, 1);
  color: white;
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  padding: 3px;
  border-radius: 3px;
  display: block;
}

#new-group-button:hover {
  background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
  background-size: 1800% 1800%;
  animation: rainbow 1.5s ease-in 0s infinite alternate;
}

</style>
