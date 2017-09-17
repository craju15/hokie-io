<template>
  <div class='content-container'>
    <Notification ref='notification'/>
    <div class='header-space'></div>
    <div class='big-title'>Create a New Group</div>
    <div class='tips-section'>
      Tips for Brand New Groups:
      <ul>
        <li>
          Make sure your new group is unique!
          Your group may be removed if it is a
          duplicate of another!
        </li>
        <li>
          Ensure that your group name is neither inappropriate nor harmful.
        </li>
        <li>
          Invite your friends to join your group!
        </li>
      </ul>
    </div>
    <div class='new-group-section'>
      <form @submit='handleNewGroup'>
        <div class='section-title'>group name:</div>
        <input name='title'/>
        <div class='section-title'>group purpose:</div>
        <p style='margin: 0px;'>(a brief statement about the purpose/goal of this group)</p>
        <input name='purpose'/>
        <br />
        <button type='submit'>Create!</button>
      </form>
    </div>
  </div>

</template>

<script>
import Notification from '@/components/parts/Notification'
import ax from 'axios'

export default {
  components: {
    Notification
  },
  methods: {
    handleNewGroup (e) {
      e.preventDefault()
      let _this = this
      ax.get(window.backend_url + '/addNewGroup' +
        '?userID=' + window.getCookie('userID') +
        '&email=' + window.getCookie('email') +
        '&sessionToken=' + window.getCookie('sessionToken') +
        '&title=' + e.target.elements.title.value +
        '&purpose=' + e.target.elements.title.purpose)
        .then(function (response) {
          if (!response.data.err) {
            _this.$router.push({path: '/group/' + response.data.groupID})
          } else {
            window.notify(null, response.data.err)
          }
        })
    }
  }
}
</script>

<style>
  .tips-section {
    background-color: #eee;
    opacity: 0;
    animation: 0.3s ease-out 1 slideIn forwards;
    color: #444;
    font-family: "PT Sans";
    padding: 10px;
    font-size: 18px;
    margin-bottom: 15px;
  }

  .new-group-section {
    background-color: #eee;
    opacity: 0;
    animation: 0.3s ease-out 1 slideIn forwards;
    font-family: "PT Sans";
    padding: 10px;
  }

  .new-group-section input {
    width: 90%;
    border: none;
    font-size: 20px;
    font-family: "PT Sans";
    outline: none;
    font-weight: bold;
    padding: 5px;
    margin-bottom: 10px;
  }

  .new-group-section textarea {
    width: 90%;
    height: 100px;
    font-family: roboto;
    font-size: 17px;
    padding: 5px;
    border: none;
    outline: none;
    margin-bottom: 10px;
  }

</style>
