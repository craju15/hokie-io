<template>
  <div class='notification'>
    Oops! Something went wrong!
  </div>
</template>

<script>
  export default {
    methods: {
      notify (message) {
        this.$el.innerHTML = message
        this.$el.style.bottom = '0px'
        let _this = this
        setTimeout(function () {
          _this.$el.style.bottom = '-60px'
        }, 3000)
      }
    }
  }
</script>

<style>

  @keyframes slideUp {
    0% {opacity: 0; bottom: -60px;}
    10% {opacity: 1; bottom: 0px;}
    90% {opacity: 1; bottom: 0px;}
    100% {opacity: 0; bottom: -60px;}
  }

  .notification {
    background-color: pink;
    color: black;
    position: fixed;
    display: block;
    width: 100%;
    height: 60px;
    z-index: 300;
    bottom: -60px;
    left: 0px;
    font-size: 23px;
    text-align: center;
    line-height: 60px;
    /* animation: 3s ease-out 1 slideUp forwards; */
    transition: all 0.25s;
  }

</style>
