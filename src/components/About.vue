<template>
  <div class='content-container'>
    <div class='header-space'></div>
    <div class='about-the-creator'>
      <h1>Hi!</h1>
      <p>
        My name is Jake and I'm a Hokie. I made this Q-and-A
        style website in order to better connect the novices and
        veterans of Virginia Tech. It is still a prototype,
        and I expect there to be plenty of bugs to fix, so please
        do not hesitate to email me at
        <a href='mailto:jake@hokie.io'>jake@hokie.io</a>
        with bug reports or feature requests!
      </p>
    </div>

    <div class='about-the-creator'>
      <h1>About this site</h1>
      <p>
        I built this website from the ground up with a bunch of
        the latest technologies. It is a <i>single page app</i>,
        which means all of the code is dumped into the browser
        from the get-go. This makes it astonishingly fast.
        It uses a full stack
        JavaScript approach, using the <b>VueJS</b> framework in the
        front end with the latest ES6 syntax, a <b>MongoDB</b>
        database, and an <b>ExpressJS</b> backend. Everything is
        secured with SSL encryption using the <i>Let's Encrypt</i>
        Certificate Authority.
      </p>
    </div>

  </div>
</template>

<style>

  .about-the-creator {
    width: 100%;
    background-color: #eee;
    padding: 15px;
    font-size: 20px;
    animation: 0.3s ease-out 1 slideIn forwards;
    margin-bottom: 15px;
  }

  .about-the-creator a {
    color: black;
    font-weight: bold;
    text-decoration: underline;
  }

  .about-the-creator a:hover {
    color: grey;
  }
</style>
