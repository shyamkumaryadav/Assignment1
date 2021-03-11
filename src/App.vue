<template>
  <div class="container">
      <div class="row">
        <div class="col m12 s12">
          <div class="card">
            <div class="input-field col s12">
            <select v-model="state" @change="getInfo">
              <option value="" disabled selected>Choose your option</option>
              <option v-for="(name, key) in states" :value="name" :key="key">{{ name }}</option>
            </select>
            <label>Select State</label>
            <span class="helper-text">Select your state to load the data</span>
          </div>
        </div>
      </div>
      <div class="col m12 s12"  v-show="showMe">
        <div class="card" style="padding: 10px;">
          <table>
          <thead>
            <tr>
                <th>club</th>
                <th>city</th>
                <th>league</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(club, key) in clubs" :key="key">
              <td>{{ club.club }}</td>
              <td>{{ club.city }}</td>
              <td>{{ club.league }}</td>
            </tr>
          </tbody>
          <tfoot v-show="isNext">
            <tr class="center">
              <th colspan="3">
                <button class="btn" @click="getNextInfo" v-show="!loadData">load more</button>
                <div class="preloader-wrapper small" :class="{active: loadData}">
                <div class="spinner-layer spinner-green-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
              </th>
              
            </tr>
          </tfoot>
          </table>
        </div>
      </div>
      <div class="center">
        <div v-cloak class=" preloader-wrapper small" :class="{active: loadState}">
          <div class="spinner-layer spinner-green-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import M from 'materialize-css'


export default {
  name: 'App',
  data(){
    return {
      states: [],
      clubs: [],
      state: '',
      page: '',
      nextPageToken: null,
      loadData: true,
      loadState: true
    }
  },
  mounted () {
    this.loadState = true
    fetch('https://www.upbringo.com/api/assignment/football/')
    .then(res => res.json())
    .then(data => {
      this.loadState = false
      this.states = data.states
    })
    .catch(error => {
      M.toast({html: error, classes: 'rounded'})
      console.log(error)}
      )
  },
  updated(){
    M.AutoInit()
  },
  methods: {
    getInfo(){
      this.loadData = true
      fetch(`https://www.upbringo.com/api/assignment/football/?state=${this.state}`)
      .then(res => res.json())
      .then(data => {
        this.loadData = false
        this.clubs = data.clubs
        this.page = data.page
        this.nextPageToken = data.nextPageToken
        })
      .catch(error => {
        M.toast({html: error, classes: 'rounded'})
        console.log(error)})
      M.AutoInit()
    },
    getNextInfo(){
      this.loadData = true
      fetch(`https://www.upbringo.com/api/assignment/football/?state=${this.state}&nextPageToken=${this.nextPageToken}`)
      .then(res => res.json())
      .then(data => {
        this.loadData = false
        if (data.clubs.length > 0){
          this.clubs.push(data.clubs[0])
          this.page = data.page
          this.nextPageToken = data.nextPageToken
        }else{
          this.nextPageToken = -1
        }        
        })
      .catch(error => {
        M.toast({html: error, classes: 'rounded'})
        console.log(error)})
      M.AutoInit()
    }
  },
  computed: {
    showMe(){
      return this.clubs.length > 0
    },
    isNext(){
      return this.nextPageToken != -1
    }
  }
}
</script>
