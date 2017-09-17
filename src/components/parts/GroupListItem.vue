<template>
  <router-link :to='"/search/groups/" + info._id'>
    <div class='group-button'>
      {{ info._id + ': ' + info.title }}
    </div>
  </router-link>
</template>

<script>
export default {
  props: ['info']
}
</script>

<style>
.group-button {
  background-color: #eee;
  width: 100%;
  height: 30px;
  opacity: 0;
  background-color: #eee;
  padding: 10px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 7px;
  animation: 0.3s ease-out 1 slideIn forwards;

  font-size: 20px;
  font-weight: bold;
  text-align: left;
  line-height: 30px;
  margin-bottom: 10px;
  text-decoration: none;
  color: black;

}

  .group-button:hover {
    background-color: #e1e1e1;
  }

  .group-button:active {
    left: 4px;
    top: 4px;
    box-shadow: none;
  }

</style>
