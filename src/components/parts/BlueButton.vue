<template>
  <div
    class='blue-button'
    @click='clickHandlerLocal'
    :style='buttonStyles'
    @mouseover='handleHover'
    @mouseleave='handleMouseOff'>{{ buttonText }}</div>
</template>

<script>
export default {
  props: ['text', 'clickFunction', 'isLoggedIn'],
  data () {
    return {
      buttonStyles: {},
      buttonText: this.text
    }
  },
  methods: {
    handleHover () {
      var rainbowHover = {
        background: 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)',
        backgroundSize: '1800% 1800%',
        animation: 'rainbow 1.5s ease-in 0s infinite alternate'
      }
      if (this.isLoggedIn) {
        this.buttonStyles = rainbowHover
      } else {
        this.buttonText = 'Login/Signup to post!'
        this.buttonStyles = {
          backgroundColor: 'grey'
        }
      }
    },
    handleMouseOff () {
      this.buttonStyles = {
        backgroundColor: 'rgba(100, 100, 255, 1)'
      }
      this.buttonText = this.text
    },
    clickHandlerLocal () {
      if (this.isLoggedIn) {
        this.clickFunction()
      } else {
        this.$router.push({path: '/login'})
      }
    }
  }
}
</script>

<style>
  .blue-button {
    display: block;
    line-height: 24px;
    height: 24px;
    padding: 8px;
    color: white;
    font-weight: bold; 
    position: absolute;
    bottom: -10px;
    right: 15px;
    background-color: rgba(100, 100, 255, 1);
    font-size: 18px;
  }

  /* .blue-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;
  } */

  .blue-button:active {
    box-shadow: none;
    bottom: -14px;
    right: 11px;
  }
</style>
