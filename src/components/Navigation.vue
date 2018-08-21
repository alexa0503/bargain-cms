<template>
  <div>
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
      <v-list dense>
        <template v-for="item in items" v-if="item.seen">
          <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" :key="item.text" :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon="">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i" @click="next">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text" @click="next" router :to="{name: item.routerName}" exact>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">后台管理系统</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted prepend-icon="fa-search" label="Search" class="hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>

      <!-- <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn> -->
      <div>
        <v-menu offset-y nudge-bottom="15" >
          <v-btn icon slot="activator">
            <v-icon dark>account_circle</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>欢迎，admin</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="toAccount">
              <v-list-tile-title><v-icon small>fa-cog</v-icon> 设置</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="logout">
              <v-list-tile-title><v-icon small>fa-sign-out-alt</v-icon> 退出</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <!-- <v-btn href="#" @click="logout" router icon>
        <v-icon>fa-sign-out-alt</v-icon>
      </v-btn> -->
    </v-toolbar>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  export default {
    data: () => ({
      //logoutUrl: apiUrls.LOGOUT,
      dialog: false,
      drawer: null,
      items: [{
          icon: 'fa fa-tachometer-alt',
          text: '首页',
          routerName: 'home',
          seen: true
        },
        {
          icon: 'fas fa-list-ol',
          text: '砍价管理',
          routerName: 'bargains',
          seen: true
        },
        {
          icon: 'fas fa-th-list',
          text: '商品管理',
          routerName: 'items',
          seen: true
        },
        {
          icon: 'fas fa-calendar-alt',
          text: '活动商品',
          routerName: 'eventItems',
          seen: true
        },
        // {
        //   icon: 'fas fa-calendar',
        //   text: '活动管理',
        //   routerName: 'events',
        //   seen: true
        // },
        {
          icon: 'fa fa-user',
          text: '授权用户',
          routerName: 'users',
          seen: false
        },
        {
          icon: 'store',
          text: '店铺管理',
          routerName: 'shops',
          seen: false
        },
        {
          icon: 'fas fa-cogs',
          text: '店铺设置',
          routerName: 'setting',
          seen: true
        }
        // { icon: 'content_copy', text: 'Duplicates' },
        /*
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Labels',
          model: true,
          children: [
            { icon: 'add', text: 'Create label' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Import' },
            { text: 'Export' },
            { text: 'Print' },
            { text: 'Undo changes' },
            { text: 'Other contacts' }
          ]
        },
        */
        // { icon: 'settings', text: '设置', routerName: 'home' }
        // { icon: 'chat_bubble', text: 'Send feedback' },
        // { icon: 'help', text: 'Help' },
        // { icon: 'phonelink', text: 'App downloads' },
        // { icon: 'keyboard', text: 'Go to the old version' }
      ]
    }),
    mounted: function () {
      // this.$store.dispatch('getMe')
    },
    computed: {
      ...mapState({
        is_super: state => state.me && state.me.is_super,
        token: state => state.getters.token
      })
    },
    watch: {
      '$route': 'update',
      is_super: function (v) {
        this.items.forEach(item => {
          if (item.routerName == 'shop') {
            item.seen = v
          } else if (item.routerName == 'setting') {
            item.seen = !v
          }
        });
      }
    },
    methods: {
      update: function () {
        this.$store.dispatch('getMe')
      },
      toAccount: function() {
        this.$router.push({name:'account'})
      },
      next: function () {},
      logout: function () {
        this.$store.dispatch('logout').then(() => {
          this.$router.push({
            name: 'login'
          })
        })
      }
    }
  }
</script>