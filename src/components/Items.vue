<template>

  <v-content>
    <v-container fluid v-if="me && me.is_activated == 1">
      <v-toolbar flat color="white">
        <v-toolbar-title>
          <v-btn color="primary" @click="newItem">
            新建商品
          </v-btn>
          <v-btn color="primary" @click="publishEventItem">
            发布活动
          </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" @click:append="iconClick" :append-icon="searchIcon" label="搜索" single-line hide-details></v-text-field>
      </v-toolbar>
      <v-data-table :loading="loading" :headers="headers" :items="items" hide-actions>
        <template slot="headerCell" slot-scope="props">
          <v-tooltip bottom>
            <span slot="activator">
              {{ props.header.text }}
            </span>
          </v-tooltip>
        </template>
        <template slot="items" slot-scope="props">
          <td>
            <v-edit-dialog :return-value.sync="props.item.order_id" large lazy persistent @save="saveOrder(props.item)" cancel-text="取消"
              save-text="保存">
              <div>{{ props.item.order_id }}</div>
              <div slot="input" class="mt-3 title">更新排序</div>
              <v-text-field slot="input" v-model="props.item.order_id" :rules="[integer]" label="编辑" single-line counter autofocus></v-text-field>
            </v-edit-dialog>
          </td>
          <td>
            <img :src="props.item.image" height="160" />
          </td>
          <td>{{ props.item.name }}</td>
          <!-- <td>{{ props.item.origin_price }}</td>
          <td>{{ props.item.bargain_price }}</td>
          <td>{{ props.item.total_num }}</td> -->
          <td>{{ props.item.bargained_num }}</td>
          <td>
            <v-chip label color="red" text-color="white">{{ props.item.winned_num }}</v-chip>
          </td>
          <td>{{ props.item.exchanged_num }}</td>
          <!-- <td>{{ props.item.bargain_min_price }}</td>
            <td>{{ props.item.bargain_max_price }}</td>
            <td>{{ props.item.bargain_min_times }}</td>
            <td>{{ props.item.bargain_max_times }}</td> -->
          <!-- <td>{{ props.item.created_at }}</td> -->
          <!-- <td>
            <v-chip v-if="props.item.is_posted == 1" label color="primary" text-color="white">
              <v-icon left>new_releases</v-icon>已发布
            </v-chip>
            <v-chip v-else label color="gray" text-color="dark">
              未发布
            </v-chip>
          </td> -->
          <td class="justify-center  px-0">
            <v-flex>
              <v-btn-toggle>
                <v-btn flat>
                  <v-icon title="查看" @click="viewItem(props.item)">
                    fas fa-eye
                  </v-icon>
                </v-btn>
                <v-btn flat>
                  <v-icon title="编辑" @click="editItem(props.item)">
                    fas fa-pen
                  </v-icon>
                </v-btn>
                <!-- <v-btn flat>
                  <v-icon v-if="props.item.is_posted == 0" title="发布" small @click="publishItem(props.item.id,'on')">
                    fas fa-toggle-off
                  </v-icon>
                  <v-icon v-if="props.item.is_posted == 1" title="下架" small @click="publishItem(props.item.id,'off')">
                    fas fa-toggle-on
                  </v-icon>
                </v-btn> -->
                <v-btn flat>
                  <v-icon title="复制商品" @click="copyItem(props.item)">
                    fas fa-clone
                  </v-icon>
                </v-btn>
                <v-btn flat>
                  <v-icon title="删除" @click="deleteItem(props.item)">
                    fas fa-trash-alt
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-flex>
          </td>
        </template>
        <template slot="no-data">
          <v-alert :value="items && !loading" color="error" icon="warning">
            抱歉，没有数据可以显示 :(
          </v-alert>
        </template>
      </v-data-table>

      <div class="text-xs-center pt-2" v-if="pagination && pagination.lastPage > 1">
        <v-pagination v-model="pagination.page" :length="pagination.lastPage"></v-pagination>
      </div>
    </v-container>
    <error v-else></error>
    <v-snackbar v-model="snackbar" :top="true" :right="true" :color="snackColor">
      {{snackbarText}}
      <v-btn flat @click="snackbar = false">
        关闭
      </v-btn>
    </v-snackbar>
  </v-content>
</template>
<script>
  import error from './../components/Error.vue'
  import * as apiUrls from './../utils/api-urls'
  import {
    mapState,
    mapActions
  } from 'vuex'
  export default {

    components: {
      error
    },
    data() {
      return {
        dropdowns: [
          '编辑'
        ],
        title: '砍价管理',
        search: '',
        snackColor: 'success',
        selected: [],
        pagination: {},
        items: [],
        loading: false,
        snackbar: false,
        snackbarText: '更新成功~',
        loading: false,
        shops: [],
        dialog: false,
        integer: (v) => !!v && /^\d+$/.test(v) || '必须填写整数',
        headers: [{
            text: '排序ID',
            value: 'status',
            sortable: false
          },
          {
            text: '预览图',
            value: 'image',
            sortable: false
          },
          {
            text: '商品名',
            value: 'name',
            sortable: false
          },
          // {
          //   text: '原价',
          //   value: 'origin_price',
          //   sortable: false
          // },
          // {
          //   text: '最低价',
          //   value: 'bargain_price',
          //   sortable: false
          // },
          // {
          //   text: '总数',
          //   value: 'total_num',
          //   sortable: false
          // },
          {
            text: '已砍数量',
            value: 'bargained_num',
            sortable: false
          },
          {
            text: '已赢取数量',
            value: 'winned_num',
            sortable: false
          },
          {
            text: '已兑换数量',
            value: 'exchanged_num',
            sortable: false
          },
          {
            text: '操作',
            value: 'operation',
            width: '200px',
            sortable: false
          }
        ],
        searchIcon: 'search'
      }
    },
    computed: {
      ...mapState({
        is_super: state => state.me && state.me.is_super,
        me: state => state.me
      }),
      page() {
        if (this.pagination) {
          return this.pagination.page
        } else {
          return 1;
        }
      },
      formTitle() {
        return this.editedIndex === -1 ? '新建' : '编辑'
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
      newItem: function (e) {
        this.$router.push({
          name: 'createItem'
        })
      },
      copyItem: function (item) {
        this.$router.push({
          name: 'copyItem',
          params: {
            id: item.id
          }
        })
      },
      submit: function (e) {
        this.getItems(1)
        if (this.searchIcon == 'search') {
          this.searchIcon = 'clear'
        }
      },
      viewItem: function (item) {
        // console.log(item)
      },
      editItem: function (item) {
        this.$router.push({
          name: 'item',
          params: {
            id: item.id
          }
        })
      },
      publishEventItem() {
        this.$router.push({
          name: 'events'
        })
      },
      // publishItem: function (id, type = "on") {
      //   let vm = this
      //   vm.loading = true
      //   let url = apiUrls.ITEM_PUBLISH.replace('{id}', id)
      //   axios({
      //     method: 'POST',
      //     url: url,
      //     data: {
      //       type: type,
      //     }
      //   }).then(function (response) {
      //     let res = response.data
      //     vm.snackbar = true
      //     vm.loading = false
      //     if (res && res.ret != 0) {
      //       vm.snackColor = 'error'
      //       vm.snackbarText = res.errMsg
      //     } else {
      //       vm.snackbarText = '操作成功~'
      //       vm.snackColor = 'success'
      //       vm.updateItem(id, type)
      //     }
      //   }).catch(function (error) {
      //     vm.snackColor = 'error'
      //     vm.snackbar = true
      //     vm.loading = false
      //     vm.snackbarText = '服务器错误,请重试或者联系管理员'
      //   })
      // },
      updateItem: function (id, type = "on") {
        let vm = this
        for (let index = 0; index < vm.items.length; index++) {
          if (vm.items[index].id == id) {
            vm.items[index].is_posted = type == 'on' ? 1 : 0
            break
          }
        }
      },
      saveOrder(item) {
        let url = apiUrls.ITEM_UPDATE.replace('{id}', item.id)
        item.type = 'order'
        axios({
          method: 'PUT',
          url: url,
          data: item
        }).then((response) => {
          this.snackbar = true
          this.snackColor = 'success'
          this.snackbarText = '排序更新成功'
        }).catch((error) => {
          this.snackbar = true
          this.snackColor = 'error'
          this.snackbarText = '提交失败'
        })
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
      deleteItem: function (item) {
        if (confirm('此操作不可返回，是否继续')) {
          let url = apiUrls.ITEM_DELETE.replace('{id}', item.id)
          item.type = 'order'
          axios({
            method: 'DELETE',
            url: url,
            data: item
          }).then((response) => {
            this.snackbar = true
            this.snackColor = 'success'
            this.snackbarText = '删除成功'
            const index = this.items.indexOf(item)
            this.items.splice(index, 1)
          }).catch((error) => {
            this.snackbar = true
            this.snackColor = 'error'
            this.snackbarText = '提交失败'
          })
        }
      },
      getItems: function (page) {
        let vm = this
        let keyword = vm.search
        vm.loading = true
        vm.$store.dispatch('getItems', {
          model: 'items',
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