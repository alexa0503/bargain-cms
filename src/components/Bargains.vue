<template>
    <v-content>
        <v-container fluid v-if="me && me.is_activated == 1">
            <v-card>
                <v-card-title>
                    {{ title }}
                    <v-spacer></v-spacer>
                    <div class="flex xs4 mr-4" v-if="shops && is_super">
                        <v-select :items="shops" label="选择店铺" solo></v-select>
                    </div>
                    <div class="flex xs4">
                        <v-text-field v-model="search" @click:append="iconClick" :append-icon="searchIcon" label="搜索" single-line hide-details></v-text-field>
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
                        <td>{{ props.item.item_name }}</td>
                        <td>{{ props.item.user_name }}</td>
                        <td>{{ props.item.joined_times }}</td>
                        <td>{{ props.item.current_price }}</td>
                        <td>{{ props.item.is_winned == 1 ? '是' : '否' }}</td>
                        <td>{{ props.item.has_bought == 1 ? '是' : '否' }}</td>
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
        <error v-else></error>
    </v-content>
</template>
<script>
import error from './../components/Error.vue'
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
                title: '砍价管理',
                search: '',
                selected: [],
                pagination: {},
                items: [],
                loading: false,
                shops: [],
                headers: [{
                        text: '商品名称',
                        value: 'item_id',
                        sortable: false
                    },
                    {
                        text: '用户名',
                        value: 'nickname',
                        sortable: false
                    },
                    {
                        text: '被砍次数',
                        value: 'joined_times',
                        sortable: false
                    },
                    {
                        text: '当前价格',
                        value: 'current_price',
                        sortable: false
                    },
                    {
                        text: '是否赢取',
                        value: 'is_winned',
                        sortable: false
                    },
                    {
                        text: '是否购买',
                        value: 'has_bought',
                        sortable: false
                    },
                    {
                        text: '创建时间',
                        value: 'created_at',
                        sortable: false
                    }
                ],
                searchIcon: 'fa-search'
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
                if (this.searchIcon == 'fa-search') {
                    this.searchIcon = 'fa-clear'
                }
            },
            iconClick: function () {
                if (this.searchIcon == 'fa-search') {
                    this.searchIcon = 'fa-clear'
                    this.submit()
                } else {
                    this.searchIcon = 'fa-search'
                    this.clearSearch()
                }
            },
            clearSearch: function () {
                this.search = 'fa-search'
                this.submit()
            },
            getItems: function (page) {
                let vm = this
                let keyword = vm.search
                vm.loading = true
                vm.$store.dispatch('getItems', {
                    model: 'bargain',
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