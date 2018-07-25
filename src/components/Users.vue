<template>
  <v-content>
    <v-container fluid>
      <v-card>
        <v-card-title>
          {{ title }}
          <v-spacer></v-spacer>
          <div class="flex xs4">
            <v-form ref="form" @submit.prevent="submit">
              <v-text-field v-model="search" @click:append="iconClick" :append-icon="searchIcon" label="搜索" single-line hide-details></v-text-field>
            </v-form>
          </div>
        </v-card-title>
        <v-data-table :loading="loading" :headers="headers" :items="items" hide-actions class="elevation-1">
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td>
              <v-avatar :tile="false" size="48px" color="grey lighten-4">
                <img :src="props.item.avatar" />
              </v-avatar>
            </td>
            <td>{{ props.item.nickname }}</td>
            <td>{{ props.item.country }}/{{ props.item.province }}/{{ props.item.city }}</td>
            <td>{{ props.item.sex }}</td>
            <td>{{ props.item.tel }}</td>
            <td>{{ props.item.created_at }}</td>
          </template>
          <template slot="no-data">
            <v-alert :value="items && !loading" color="error" icon="warning">
              抱歉，没有数据可以显示 :(
            </v-alert>
          </template>
        </v-data-table>
      </v-card>

      <div class="text-xs-center pt-2" v-if="pagination && pagination.lastPage > 1">
        <v-pagination v-model="pagination.page" :length="pagination.lastPage"></v-pagination>
      </div>
    </v-container>
  </v-content>
</template>
<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        title: '用户授权',
        search: '',
        selected: [],
        pagination: {},
        items: [],
        loading: false,
        headers: [{
            text: '头像',
            value: 'avatar',
            sortable: false
          },
          {
            text: '昵称',
            value: 'nickname',
            sortable: false
          },
          {
            text: '国家/省/市/区',
            value: 'country',
            sortable: false
          },
          {
            text: '性别',
            value: 'sex',
            sortable: false
          },
          {
            text: '电话',
            value: 'tel',
            sortable: false
          },
          {
            text: '创建时间',
            value: 'created_at',
            sortable: false
          }
        ],
        searchIcon: 'search'
      }
    },
    computed: {
      ...mapState({}),
      page() {
        if (this.pagination) {
          return this.pagination.page
        } else {
          return 1;
        }
      }
    },
    created() {
      this.getItems(1)
    },
    watch: {
      page: function (page, oldPage) {
        if (oldPage != undefined) {
          this.getItems(page)
        }
      }
    },
    methods: {
      submit: function (e) {
        this.getItems(1)
        if (this.searchIcon == 'search') {
          this.searchIcon = 'clear'
        }
      },
      iconClick: function () {
        if (this.searchIcon == 'search') {
          this.searchIcon = 'clear'
          this.submit()
        } else {
          this.searchIcon = 'search'
          this.clearSearch()
        }
      },
      clearSearch: function () {
        this.search = ''
        this.submit()
      },
      getItems: function (page) {
        let vm = this
        let keyword = vm.search
        vm.loading = true
        vm.$store.dispatch('getItems', {
          model: 'user',
          keyword: keyword,
          page: page
        }).then(res => {
          vm.loading = false
          vm.pagination = res.pagination
          vm.items = res.data
        })
      }
    }
  }
</script>