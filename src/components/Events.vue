<template>

    <v-content>
        <v-container fluid>
            <v-card>
                <v-card-title>
                    <v-flex xs4>
                        <v-btn color="primary" @click="newItem">
                            发布活动商品
                        </v-btn>
                        <v-btn color="orange" @click="newItem">
                            活动创建
                        </v-btn>
                    </v-flex>
                    <v-flex xs4 mr-4 v-if="shops && is_super">
                        <v-select :items="shops" label="选择店铺" solo></v-select>
                    </v-flex>
                    <v-flex xs4 mr-4 v-if="events">
                        <v-select @change="getEventItems" :items="events" label="选择活动" solo></v-select>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs4>
                        <v-text-field v-model="search" @click:append="iconClick" :append-icon="searchIcon" label="搜索" single-line hide-details></v-text-field>
                    </v-flex>
                </v-card-title>
                <v-data-table :loading="loading" :headers="headers" :items="items" hide-actions>
                    <template slot="headerCell" slot-scope="props">
                        <v-tooltip bottom>
                            <span slot="activator">
                                {{ props.header.text }}
                            </span>
                        </v-tooltip>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.event_name }}</td>
                        <td>{{ props.item.total_num }}</td>
                        <td>{{ props.item.bargained_num }}</td>
                        <td>{{ props.item.winned_num }}</td>
                        <td>{{ props.item.exchanged_num }}</td>
                        <td>{{ props.item.origin_price }}</td>
                        <td>{{ props.item.bargain_price }}</td>
                        <!-- <td>{{ props.item.bargain_max_times }}</td>
            <td>{{ props.item.bargain_min_times }}</td>
            <td>{{ props.item.bargain_max_price }}</td>
            <td>{{ props.item.bargain_min_price }}</td> -->
                        <td>{{ props.item.is_released == 1 ? '已发布' : '已下架' }}</td>
                        <td>{{ props.item.created_at }}</td>
                        <td class="justify-center  px-0">
                            <v-icon title="编辑" small class="mr-2" @click="editItem(props.item)">
                                fas fa-pen
                            </v-icon>

                            <v-icon v-if="props.item.is_released == 0" class="mr-2" title="发布" small @click="publishItem(props.item.id,'on')">
                                fas fa-toggle-off
                            </v-icon>
                            <v-icon v-if="props.item.is_released == 1" class="mr-2" title="下架" small @click="publishItem(props.item.id,'off')">
                                fas fa-toggle-on
                            </v-icon>

                            <v-icon v-if="props.item.is_released == 0" title="删除" small @click="deleteItem(props.item)">
                                fas fa-trash-alt
                            </v-icon>
                        </td>
                    </template>
                    <template slot="no-data">
                        <v-alert :value="items && !loading" color="error" icon="warning">
                            抱歉，没有可显示的数据 :(
                        </v-alert>
                    </template>
                </v-data-table>
            </v-card>

            <div class="text-xs-center pt-2" v-if="pagination && pagination.lastPage > 1">
                <v-pagination v-model="pagination.page" :length="pagination.lastPage"></v-pagination>
            </div>
        </v-container>
        <v-snackbar v-model="snackbar" :top="true" :right="true" :color="snackColor">
            {{snackbarText}}
            <v-btn flat @click="snackbar = false">
                关闭
            </v-btn>
        </v-snackbar>
    </v-content>
</template>
<script>
    import * as apiUrls from './../utils/api-urls'
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                events: null,
                title: '活动管理',
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
                        text: '商品名',
                        value: 'name',
                        sortable: false
                    },
                    {
                        text: '活动名',
                        value: 'name',
                        sortable: false
                    },
                    {
                        text: '总量',
                        value: 'total_num',
                        sortable: false
                    },
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
                        text: '原价',
                        value: 'origin_price',
                        sortable: false
                    },
                    {
                        text: '可砍价',
                        value: 'bargain_price',
                        sortable: false
                    },
                    {
                        text: '发布状态',
                        value: 'is_released',
                        sortable: false
                    },
                    {
                        text: '创建时间',
                        value: 'created_at',
                        sortable: false
                    },
                    {
                        text: '操作',
                        value: 'operation',
                        sortable: false
                    }
                ],
                searchIcon: 'search'
            }
        },
        computed: {
            ...mapState({
                is_super: state => state.me && state.me.is_super
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
            this.getEventItems(1)
        },
        watch: {
            page: function (page, oldPage) {
                if (oldPage != undefined) {
                    this.getEventItems(page)
                }
            }
        },
        methods: {
            newItem: function (e) {
                this.$router.push({
                    name: 'createItem'
                })
            },
            submit: function (e) {
                this.getEventItems(1)
                if (this.searchIcon == 'search') {
                    this.searchIcon = 'clear'
                }
            },
            editItem: function (item) {
                this.$router.push({
                    name: 'item',
                    params: {
                        id: item.id
                    }
                })
            },
            publishItem: function (id, type = "on") {
                let vm = this
                vm.loading = true
                let url = apiUrls.ITEM_PUBLISH.replace('{id}', id)
                axios({
                    method: 'POST',
                    url: url,
                    data: {
                        type: type,
                    }
                }).then(function (response) {
                    console.log(response)
                    let res = response.data
                    vm.snackbar = true
                    vm.loading = false
                    if (res && res.ret != 0) {
                        vm.snackColor = 'error'
                        vm.snackbarText = res.errMsg
                    } else {
                        vm.snackbarText = '操作成功~'
                        vm.snackColor = 'success'
                        vm.updateItem(id, type)
                    }
                }).catch(function (error) {
                    vm.snackColor = 'error'
                    vm.snackbar = true
                    vm.loading = false
                    vm.snackbarText = '服务器错误,请重试或者联系管理员'
                })
            },
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
            getEventItems: function (page) {
                let vm = this
                let keyword = vm.search
                vm.loading = true
                vm.$store.dispatch('getItems', {
                    model: 'event/items',
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