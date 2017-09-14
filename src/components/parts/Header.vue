<template>
  <div class='header'>
    <router-link to='/'><div class='logo'><span>Hokie</span>.io</div></router-link>
    <QuickSearchResults :style='quickSearchResultsStyles' :results='quickSearchResults'/>
    <div class='animated-section'>
      <div class='links' :style='linksStyles'>
        <template v-for='link in linksLeft'>
          <router-link :to='link.target'>{{ link.title }}</router-link>
        </template>
      </div>
      <div class='search-bar' :style='searchBarStyles'>
        <img src='../../assets/search.svg' class='search-icon'>
        <form v-on:submit='handleSearchReturn'>
          <input
            autocomplete='off'
            placeholder='ask a question...'
            name='searchbar'
            @focus='onSearchBarFocus'
            @blur='onSearchBarBlur'
            @input='onSearchBarChange'
          />
        </form>
      </div>
    </div>
    <div class='userLinks'>
      <!-- <a id='facebookLogin' v-on:click='facebookLogin' v-if='!isLoggedIn'>
        <img src='../../assets/facebook-icon.png'/>Login with Facebook
      </a> -->
      <router-link :to='isLoggedIn ? "/newquestion" : "/signup"' id='new-question-button'>New Question!</router-link>
      <router-link to='/login' v-if='!isLoggedIn'>login</router-link>
      <a v-if='isLoggedIn' v-on:click='handleLogout' >logout</a>
      <router-link :to='"/profile/" + userID' v-if='isLoggedIn'>profile</router-link>
      <router-link to='/signup' v-if='!isLoggedIn'>sign up</router-link>
    </div>
  </div>
</template>

<script>
  import QuickSearchResults from '@/components/parts/QuickSearchResults'
  import ax from 'axios'

  export default {
    props: ['isLoggedIn', 'updateLoginStatus', 'userID'],
    components: {
      QuickSearchResults
    },
    data () {
      return {
        linksLeft: [
          {title: 'recent', target: '/'},
          {title: 'about', target: '/about'},
          {title: 'courses', target: '/groups'}
        ],
        searchBarStyles: {},
        linksStyles: {},
        quickSearchResultsStyles: {
          display: 'none'
        },
        quickSearchResults: []
      }
    },
    methods: {
//       facebookLogin () {
//         FB.login((response) => {
//           if (response.authResponse) {
//             this.toggleLoginStatus()
//           }
//         }, {scope: 'public_profile,email'})
//       },
//       facebookLogout () {
//       },
      onSearchBarFocus (e) {
        this.searchBarStyles = {
          left: '10px', width: '100%'
        }
        this.linksStyles = {
          opacity: '0'
        }
        if (e.target.value !== '') {
          this.quickSearchResultsStyles = {
            display: 'block'
          }
        }
      },
      onSearchBarBlur () {
        setTimeout(() => {
          this.searchBarStyles = {
            left: '230px', width: '150px'
          }
          this.linksStyles = {
            opacity: '1'
          }
          this.quickSearchResultsStyles = {
            display: 'none'
          }
        }, 200)
      },
      onSearchBarChange (e) {
        ax.get(window.backend_url + '/getQuickSearchResults/' + e.target.value)
          .then((response) => {
            this.quickSearchResults = response.data.results
            this.quickSearchResultsStyles = {
              display: 'block'
            }
          })
      },
      getCookie (cname) {
        window.getCookie(cname)
      },
      handleLogout () {
        window.deleteCookie('sessionToken')
        window.deleteCookie('email')
        window.deleteCookie('userID')
        this.updateLoginStatus()
        this.$router.push({path: '/'})
      },
      handleSearchReturn (e) {
        e.preventDefault()
        e.target.elements['searchbar'].blur()
        console.log(e.target.elements['searchbar'].value)
        this.$router.push({'path': '/search/query/' + e.target.elements['searchbar'].value})
      }
    }
  }
</script>

<style scoped>
  .header {
    position: fixed;
    padding: 0px;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    background-color: #eee;
    z-index: 100;
    border-bottom: thin solid #aaa;
    box-shadow: 0px 0px 2px 0px rgba(60, 60, 60, 0.4);
  }

  .logo {
    font-size: 40px;
    line-height: 50px;
    color: orange;
    font-weight: bold;
    padding-left: 9px;
    position: absolute;
    top: 0px;
    transition: all 0.25s linear;
  }

  .logo span {
    color: maroon;
  }

  .logo:hover {
    opacity: 0;
  }

  .header .links {
    position: absolute;
    top: 13px;
    left: 10px;
    transition: all 0.15s ease-in 0s;
  }

  .userLinks {
    position: absolute;
    top: 13px;
    right: 10px;
  }

  .header a {
    color: black;
    font-weight: bold;
    text-decoration: none;
    padding-right: 15px;
    font-size: 19px;
  }

  .header a:hover {
    color: #777;
  }


  #facebookLogin {
    background-color: #3B5998;
    color: white;
				padding-left: 37px;
				padding-right: 10px;
    border-radius: 3px;
				border-top: 4px solid #3B5998;
				border-bottom: 4px solid #3B5998;
				margin-right: 10px;
  }

  #facebookLogin:hover {
    opacity: 0.7;
  }

  #facebookLogin img {
    width: 20px;
    height: 20px;
				position: absolute;
				top: 2px;
				left: 12px;
  }

  .search-bar {
    height: 40px;
    width: 150px;
    left: 230px;
    top: 5px;
    position: absolute;
    transition: all 0.15s ease-out 0s;
  }

  .search-bar img {
    width: 40px;
    height: 40px;
  }

  .search-bar input {
    border: none;
    line-height: 25px;
    position: absolute;
    font-size: 20px;
    top: 7px;
    left: 45px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0);
    font-family: 'PT Sans';
    font-weight: bold;
    outline: none;
    border-bottom: 2px solid grey;
  }

  .animated-section {
    height: 50px;
    width: 450px;
    position: absolute;
    left: 170px;
    top: 0px;
  }

  #new-question-button {
    background-color: rgba(100, 100, 250, 1);
    color: white;
    text-align: center;
    padding: 3px;
    margin-right: 10px;
    border-radius: 3px;
  }

  #new-question-button:hover {
    background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 1.5s ease-in 0s infinite alternate;
  }

  @media screen and (max-width: 820px) {
    .header {
      height: 150px;
    }

    .animated-section {
      left: 5px;
      top: 50px;
    }
  }

  @media screen and (max-width: 450px) {
    .userLinks {
      top: 110px;
    }

    .logo {
      position: relative;
      text-align: center;
    }
  }

</style>
