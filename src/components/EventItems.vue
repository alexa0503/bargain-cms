<template>
    <v-content>
        <v-container fluid v-if="me && me.is_activated == 1">
            <v-toolbar flat color="white">
                <v-toolbar-title>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-btn @click="createItem" slot="activator" color="primary" dark class="mb-2">新建活动商品</v-btn>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md v-if="editedItem">
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md12 v-if="canChooseItems && storeMethod == 'POST'">
                                            <v-select v-model="editedItem.item_id" :items="canChooseItems" label="请选择活动商品" :error-messages="errors.item_id"></v-select>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4>
                                            <v-text-field :disabled="disabled" v-model="editedItem.origin_price" label="原价" :error-messages="errors.origin_price"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4>
                                            <v-text-field :disabled="disabled" v-model="editedItem.bargain_price" label="最低价" :error-messages="errors.bargain_price"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4>
                                            <v-text-field :disabled="disabled" v-model="editedItem.total_num" label="总数" :error-messages="errors.total_num"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field :disabled="disabled" v-model="editedItem.bargain_min_price" label="砍价最少价格" :error-messages="errors.bargain_min_price"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field :disabled="disabled" v-model="editedItem.bargain_max_price" label="砍价最大价格" :error-messages="errors.bargain_max_price"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field :disabled="disabled" v-model="editedItem.bargain_min_times" label="砍价最少次数" :error-messages="errors.bargain_min_times"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field :disabled="disabled" v-model="editedItem.bargain_max_times" label="砍价最大次数" :error-messages="errors.bargain_max_times"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">关闭</v-btn>
                                <v-btn v-if="!disabled" color="blue darken-1" flat @click.native="save" :disabled="disabled">保存</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-flex mt-4 v-if="events">
                    <v-select v-model="eventId" @change="changeEvent" :items="events" label="请选择活动"></v-select>
                </v-flex>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" @click:append="iconClick" :append-icon="searchIcon" label="搜索" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

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
                    <!-- <td>
                        <img :src="props.item.image" height="100" />
                    </td> -->
                    <td>
                        {{ props.item.name }}
                        <v-chip color="warning" text-color="white" small>
                            详情
                        </v-chip>
                    </td>
                    <td>{{ props.item.origin_price }}</td>
                    <td>{{ props.item.bargain_price }}</td>
                    <td>{{ props.item.total_num }}</td>
                    <td>{{ props.item.bargained_num }}</td>
                    <td>
                        <v-chip label color="red" text-color="white">{{ props.item.winned_num }}</v-chip>
                    </td>
                    <td>{{ props.item.exchanged_num }}</td>
                    <td>
                        <v-chip v-if="props.item.is_released == 1" label color="primary" text-color="white">
                            已发布
                        </v-chip>
                        <v-chip v-else label color="gray" text-color="dark">
                            未发布
                        </v-chip>
                    </td>
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
                                <v-btn flat>
                                    <v-icon v-if="props.item.is_released == 0" title="发布" @click="releaseEventItem(props.item,'on')">
                                        fas fa-toggle-off
                                    </v-icon>
                                    <v-icon v-else-if="props.item.is_released == 1" title="下架" @click="releaseEventItem(props.item,'off')">
                                        fas fa-toggle-on
                                    </v-icon>
                                </v-btn>
                            </v-btn-toggle>
                        </v-flex>
                    </td>
                </template>
                <template slot="no-data">
                    <v-alert :value="items && !loading" color="info" type="info">
                        <div v-if="!events || events.length == 0">还没有活动哦，先创建一个吧 :(</div>
                        <div v-else-if="!eventId"> 请选择对应活动查看:(</div>
                        <div v-else>还没有发布活动商品哦，去
                            <v-btn style="min-width:0px;" color="warning" small>发布</v-btn>:(</div>
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
    import * as apiUrls from './../utils/api-urls'
    import error from './../components/Error.vue'
    import {
        storeEventItem
    } from './../utils/utils'
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
                title: '活动管理',
                eventId: null,
                event: null,
                search: '',
                snackColor: 'success',
                pagination: {},
                items: [],
                canChooseItems: [],
                loading: false,
                snackbar: false,
                snackbarText: '更新成功~',
                loading: false,
                dialog: false,
                eventDialog: false,
                formTitle: '新建',
                editedItem: null,
                disabled: false,
                storeMethod: 'POST',
                integer: (v) => !!v && /^\d+$/.test(v) || '必须填写整数',
                headers: [{
                        text: '商品名',
                        value: 'name',
                        sortable: false
                    },
                    {
                        text: '原价',
                        value: 'origin_price',
                        sortable: false
                    },
                    {
                        text: '最低价',
                        value: 'bargain_price',
                        sortable: false
                    },
                    {
                        text: '总数',
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
                        text: '状态',
                        value: 'status',
                        sortable: false,
                    },
                    {
                        text: '操作',
                        value: 'operation',
                        width: '200px',
                        sortable: false
                    }
                ],
                searchIcon: 'search',
                errors: {
                    'item_id': [],
                    'origin_price': [],
                    'bargain_price': [],
                    'bargain_max_price': [],
                    'bargain_min_price': [],
                    'bargain_max_times': [],
                    'bargain_min_times': [],
                    'total_num': [],
                }
            }
        },
        computed: {
            ...mapState({
                events: state => state.events,
                me: state => state.me
            }),
            page() {
                if (this.pagination) {
                    return this.pagination.page
                } else {
                    return 1;
                }
            }
        },
        created() {
            let vm = this
            vm.$store.dispatch('getEvents').then(res => {
                if (vm.$router.history.current.params.id) {
                    vm.eventId = parseInt(vm.$router.history.current.params.id)
                }

                for (let index = 0; index < vm.events.length; index++) {
                    if (vm.$router.history.current.params.id) {
                        if( vm.eventId ==  vm.events[index].value ){
                            vm.event = vm.events[index]
                            break
                        }
                    } else {
                        if (vm.events[index].is_current) {
                            vm.eventId = vm.events[index].value
                            vm.event = vm.events[index]
                            break
                        }
                    }
                }
            })
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
            changeEvent: function (index) {
                this.getItems()
            },
            getChooseItems: function () {
                let vm = this
                let url = apiUrls.ALL_ITEMS
                axios.get(url, {
                    params: {
                        event_id: vm.eventId
                    }
                }).then(res => {
                    let items = [],
                        data = res.data.data
                    for (let index = 0; index < data.length; index++) {
                        items[index] = {
                            'text': data[index].name,
                            'value': data[index].id
                        }
                    }
                    vm.canChooseItems = items
                })
            },
            getItems: function (page) {
                page = page ? page : 1;
                let vm = this
                let keyword = vm.search
                vm.loading = true
                if (vm.eventId) {
                    vm.$store.dispatch('getItems', {
                        model: 'event/' + vm.eventId + '/items',
                        keyword: keyword,
                        page: page
                    }).then(res => {
                        vm.loading = false
                        vm.pagination = res.pagination
                        vm.items = res.data
                    })
                }

            },
            createItem() {
                let vm = this
                vm.formTitle = '新建 - ' + vm.event.text
                vm.editedItem = {
                    origin_price: '',
                    bargain_price: '',
                    total_num: '',
                    bargain_min_price: '',
                    bargain_max_price: '',
                    bargain_min_times: '',
                    bargain_max_times: '',
                    event_id: vm.eventId
                }
                this.storeMethod = 'POST'
                vm.getChooseItems()
            },
            releaseEventItem: function (item, type = 'on') {
                if (type == 'on') {
                    if (!confirm('活动中的商品发布后将无法修改及下架，是否继续？')) {
                        return false
                    }
                }
                let vm = this
                let event = vm.event
                let is_released = type == 'on' ? 1 : 0;
                storeEventItem({
                    vm: vm,
                    method: 'PUT',
                    data: {
                        id: item.id,
                        event_id: item.event_id,
                        is_released: is_released,
                        type: 'release'
                    },
                })
                // if (type == 'off' && item.is_released == 1 && event && event.is_current) {
                //     vm.snackbar = true
                //     vm.snackColor = 'error'
                //     vm.snackbarText = '抱歉，活动中的商品已无法下架~'
                // } else if (type == 'on') {

                // }
            },
            editItem(item) {
                this.dialog = true
                this.formTitle = item.name
                this.editedIndex = this.items.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.disabled = false
                this.storeMethod = 'PUT'
                this.errors = {}
            },
            save() {
                let vm = this
                storeEventItem({
                    vm: vm,
                    method: vm.storeMethod,
                    data: vm.editedItem,
                }).then(res => {
                    // console.log(res)
                    vm.dialog = false
                    if (vm.storeMethod == 'POST') {
                        vm.getChooseItems()
                    }
                }).catch(err => {
                    if (vm.storeMethod == 'POST') {
                        vm.errors = err.data
                    }
                })

            },
            close() {
                this.dialog = false
            },
            viewItem(item) {
                this.dialog = true
                this.storeMethod = 'PUT'
                this.formTitle = item.name
                this.editedIndex = this.items.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.disabled = true
            }
        }
    }
</script>