<template>
  <div class='limit-warning-modal-container' :style='modalStyles'>
    <div class='modal-background'></div>
    <div class='limit-warning-modal'>
      <div class='modal-title'>{{ title }}</div>
      <div class='modal-body'>{{ body }}</div>
      <input name='url' placeholder='https://...'/>
      <a class='post-button' v-on:click='functionOnAccept'>{{ buttonAccept }}</a>
      <a class='cancel-button' v-on:click='hideModal'>{{ buttonCancel }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'body', 'buttonOk', 'buttonCancel', 'functionOnAccept'],
  data () {
    return {
      modalStyles: {
        display: 'none'
      }
    }
  },
  methods: {
    hideModal () {
      this.modalStyles = {
        display: 'none'
      }
    }
  }
}
</script>
