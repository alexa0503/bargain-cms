<template>
  <v-content>
    <v-container fluid fill-height grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex sm4 offset-sm4>
          <v-card>
            <v-card-media :src="shop.code_image" height="400px" v-if="shop"></v-card-media>
            <v-card-actions>
              <v-btn flat color="orange" @click="toDetail">查看详细</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 justify-center align-center>
          <h3>后台管理系统 Ver0.1</h3>
          <p>Base on
            <a href="https://cn.vuejs.org">Vue.js</a>,
            <a href="https://vuetifyjs.com">Vuetify UI</a>,
            <a href="https://laravel.com">Laravel</a>,
            <a href="http://jwt-auth.readthedocs.io/en/develop/">jwt-auth</a>
          </p>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  export default {
    computed: {
      ...mapState({
        shop: state => state.me && state.me.shop
      })
    },
    methods: {
      toDetail: function(){
        this.$router.push({
          name: 'setting'
        })
      }
    }
  }
</script>