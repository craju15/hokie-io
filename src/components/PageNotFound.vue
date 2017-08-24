<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='not-found-message'>
      <div class='not-found-message-4'>4</div>
      <div class='not-found-message-0'>0</div>
      <div class='not-found-message-4'>4</div>
      <div>Page Not Found :(</div>
      <p>Here is a picture of a cat anyways:</p>
      <img src='./../assets/cat.jpg' />
    </div>
  </div>
</template>

<style>
  .not-found-message {
    font-size: 50px;
    text-align: center;
  }

  .not-found-message-4 {color: maroon;}
  .not-found-message-0 {color: orange;}

  .not-found-message-4,
  .not-found-message-0 {
    display: inline;
    font-size: 100px;
    font-weight: bold;
    line-height: 80px;
  }

  .not-found-message p {
    font-size: 30px;
    margin: 10px;
  }

  .not-found-message img {
    width: 400px;
    height: 400px;
  }
</style>
