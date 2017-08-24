<template>
  <div class='user-block'>
    <!-- <img :src='(!info.pic || info.pic === "") ? default_pic : info.pic'/> -->
    <div class='image-filler' :style='{backgroundColor: info.pic}'>
      <div class='image-circle' :style='{color: info.pic}'>
        {{ info.name.split(' ')[0][0] + info.name.split(' ')[1][0] }}
      </div>
    </div>
    <div class='profile-right-part'>
      <div class='profile-name'>{{ info.name }}</div>
      <!-- <div class='profile-rank'>#24</div> -->
      <div class='profile-data' style='display: none;'>
        people reached: <span>{{ info.peopleReached }}</span>
      </div>
      <div class='profile-data'>date joined: <span>{{ info.dateJoined }}</span></div>

      <button @click='handleChangePic' v-if='isLoggedIn'>change color</button>
    </div>


  </div>
</template>

<script>
  export default {
    props: ['info', 'handleChangePic', 'isLoggedIn'],
    data () {
      return {
        default_pic: window.default_pic
      }
    }
  }
</script>

<style>
  .user-block {
    opacity: 0;
    background-color: #eee;
    display: flex;
    animation: 0.3s ease-out 1 slideIn forwards;
  }

  .user-block img {
    width: 130px;
    height: 130px;
    padding: 15px;
    position: relative;
  }

  .image-filler {
    width: 130px;
    height: 130px;
    margin: 15px;
    position: relative;
  }

  .image-circle {
    width: 100px;
    height: 100px;
    margin: 15px;
    position: relative;
    background-color: white;
    border-radius: 70px;
    transition: all 0.10s;
    text-align: center;
    line-height: 100px;
    font-size: 50px;
  }

  .image-circle:hover {
    width: 110px;
    height: 110px;
    margin: 10px;
    line-height: 110px;
    font-size: 60px;
  }

  .profile-right-part {
    flex: 1;
    position: relative;
  }

  .profile-name {
    font-size: 20px;
    font-weight: bold;
    margin: auto;
    padding-top: 15px;
    margin-bottom: 20px;
  }

  .profile-data {
    font-size: 15px;
    color: grey;
    padding-bottom: 5px;
  }

  .profile-data span {
    font-weight: bold;
    color: black;
    padding-left: 10px;
  }

</style>
