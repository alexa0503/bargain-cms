<template>
    <v-content>
        <v-container fluid grid-list-md>
            <v-data-iterator :items="items" content-tag="v-layout" hide-actions row wrap>
                <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark flat>
                    <!-- <v-toolbar-title></v-toolbar-title> -->
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-btn @click="createEvent" slot="activator" color="primary" dark class="mb-2">新建活动</v-btn>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md v-if="editedItem">
                                    <v-layout wrap>
                                        <v-flex xs12 md12>
                                            <v-text-field :disabled="disabled" v-model="editedItem.name" label="活动名称" :error-messages="errors.name"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-menu ref="startDateMenu" :close-on-content-click="false" v-model="startDateMenu" :nudge-right="40" lazy transition="scale-transition"
                                                offset-y full-width max-width="290px" min-width="290px">
                                                <v-text-field slot="activator" v-model="editedItem.start_date" label="活动开始日期" hint="" persistent-hint prepend-icon="event"
                                                    :error-messages="errors.start_date"></v-text-field>
                                                <v-date-picker v-model="editedItem.start_date" no-title @input="startDateMenu = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-menu ref="endDateMenu" :close-on-content-click="false" v-model="endDateMenu" :nudge-right="40" lazy transition="scale-transition"
                                                offset-y full-width max-width="290px" min-width="290px">
                                                <v-text-field slot="activator" v-model="editedItem.end_date" label="活动结束日期" hint="" persistent-hint prepend-icon="event"
                                                    :error-messages="errors.end_date"></v-text-field>
                                                <v-date-picker v-model="editedItem.end_date" no-title @input="endDateMenu = false"></v-date-picker>
                                            </v-menu>
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
                </v-toolbar>

                <v-flex slot="item" slot-scope="props" xs12 sm6 md4>
                    <v-card>
                        <v-card-title class="subheading font-weight-bold">
                            {{ props.item.name }}
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>开始日期:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.start_date }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content>结束日期:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.end_date }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>发布商品数量:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.total_qty }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content>砍价数量:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.total_qty }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content>砍价成功数量:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.total_qty }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content class="align-end">
                                    <v-btn-toggle>
                                        <v-btn flat>
                                            <v-icon title="查看活动商品" @click="viewItem(props.item)">
                                                fas fa-eye
                                            </v-icon>
                                        </v-btn>
                                        <v-btn flat>
                                            <v-icon title="编辑" @click="editItem(props.item)">
                                                fas fa-pen
                                            </v-icon>
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>

                <!-- <v-toolbar slot="footer" class="mt-2" color="indigo" dark dense flat>
                    <v-toolbar-title class="subheading"></v-toolbar-title>
                </v-toolbar> -->
            </v-data-iterator>
            <v-flex  xs12 sm6 md4 mt-2 pr-1>
                <v-card>
                    <v-card-media :src="shop.code_image" height="400px" v-if="shop"></v-card-media>
                    <v-card-actions>
                        <v-btn flat color="orange" @click="toDetail">查看详细</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
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
        storeEvent
    } from './../utils/utils'
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                startDateMenu: false,
                endDateMenu: false,
                title: '活动管理',
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
                        text: '活动名称',
                        value: 'name',
                        sortable: false
                    },
                    {
                        text: '开始日期',
                        value: 'start_date',
                        sortable: false
                    },
                    {
                        text: '结束日期',
                        value: 'end_date',
                        sortable: false
                    },
                    {
                        text: '操作',
                        value: 'operation',
                        width: '200px',
                        sortable: false
                    }
                ],
                searchIcon: 'search',
                errors: {}
            }
        },
        computed: {
            ...mapState({
                // events: state => state.events
                shop: state => state.me && state.me.shop
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
            toDetail: function () {
                this.$router.push({
                    name: 'setting'
                })
            },
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
                page = page ? page : 1;
                let vm = this
                let keyword = vm.search
                vm.loading = true
                vm.$store.dispatch('getItems', {
                    model: 'events',
                    keyword: keyword,
                    page: page
                }).then(res => {
                    vm.loading = false
                    vm.pagination = res.pagination
                    vm.items = res.data
                })

            },
            createEvent() {
                let vm = this
                vm.errors = {}

                vm.formTitle = '新建活动'
                vm.editedItem = {
                    name: '',
                    start_date: '',
                    end_date: '',
                }
                this.storeMethod = 'POST'
            },
            editItem(item) {
                let vm = this
                // 默认清空错误
                vm.errors = {}

                vm.dialog = true
                vm.formTitle = item.name
                vm.editedIndex = this.items.indexOf(item)
                vm.editedItem = Object.assign({}, item)
                vm.disabled = false
                vm.storeMethod = 'PUT'
            },
            save() {
                let vm = this
                storeEvent({
                    vm: vm,
                    method: vm.storeMethod,
                    data: vm.editedItem,
                }).then(res => {
                    vm.snackbar = true
                    vm.snackColor = 'success'
                    vm.snackbarText = '恭喜，提交成功。'
                    vm.getItems(1)
                    vm.dialog = false
                }).catch(err => {
                    if (err.status != 422) {
                        vm.snackbar = true
                        vm.snackColor = 'error'
                        vm.snackbarText = '抱歉，服务器发生错误，稍后重试'
                    } else {
                        vm.errors = err.data
                    }
                })
            },
            close() {
                this.dialog = false
            },
            viewItem(item) {
                this.$router.push({
                    name: 'eventItems',
                    params: {
                        id: item.id
                    }
                })
            }
        }
    }
</script>