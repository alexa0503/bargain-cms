<template>
    <v-content>
        <v-container fluid>
            <v-form ref="form" v-model="valid" lazy-validation v-if="inputs">
                <v-flex>
                    <img :src="inputs.image" width="375" v-if="inputs && inputs.image" />
                    <v-text-field label="预览图[750px*556px]" @click='pickFile("image")' value="点击选择图片"></v-text-field>
                    <input type="file" style="display: none" ref="image" accept="image/*" multiple="multiple" @change="onFilePicked($event)">
                </v-flex>
                <v-flex>
                    <v-layout row wrap>
                        <v-flex v-for="(image,index) in inputs.images" v-bind:key="index" xs4 mr-2 mb-2>
                            <v-card>
                                <v-card-media :src="image" height="200px"></v-card-media>
                                <v-card-actions  class="pa-3">
                                    <v-spacer></v-spacer>
                                    <v-btn  flat color="dark" @click="deleteImage(index)">删除</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-text-field label="幻灯片[750px*556px]" @click='pickFile("images")' value="点击选择图片/可多张"></v-text-field>
                    <input type="file" style="display: none" ref="images" accept="image/*" multiple="multiple" @change="onFilesPicked($event)">
                </v-flex>
                <v-text-field v-model="inputs.name" :rules="rules.name" label="商品名称" required :error-messages="errors.name"></v-text-field>
                <v-textarea :error-messages="errors.descr" auto-grow rows="2" v-model="inputs.descr" :rules="rules.descr" label="商品简介" required></v-textarea>
                <!-- <v-text-field v-model="inputs.total_num" :rules="rules.total_num" label="总量" :error-messages="errors.total_num" required></v-text-field>
                <v-text-field v-model="inputs.origin_price" :rules="rules.origin_price" label="原价" required :error-messages="errors.origin_price"></v-text-field>
                <v-text-field v-model="inputs.bargain_price" :rules="rules.bargain_price" label="最低价" required :error-messages="errors.bargain_price"></v-text-field> -->
                <!-- <v-layout row wrap>
                    <v-flex xs6>
                        <v-text-field v-model="inputs.bargain_min_price" :rules="rules.bargain_min_price" label="可砍最低价格" required :error-messages="errors.bargain_min_price"></v-text-field>
                    </v-flex>
                    <v-flex xs6 px-2>
                        <v-text-field v-model="inputs.bargain_max_price" :rules="rules.bargain_max_price" label="可砍最高价格" required :error-messages="errors.bargain_max_price"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field v-model="inputs.bargain_min_times" :rules="rules.bargain_min_times" label="最少砍价次数" required :error-messages="errors.bargain_min_times"></v-text-field>
                    </v-flex>
                    <v-flex xs6 px-2>
                        <v-text-field v-model="inputs.bargain_max_times" :rules="rules.bargain_max_times" label="最多砍价次数" required :error-messages="errors.bargain_max_times"></v-text-field>
                    </v-flex>
                </v-layout> -->
                <v-btn :loading="loading" :disabled="!valid" @click="submit" large color="primary">
                    提交
                </v-btn>
                <v-btn large color="primary" @click="toIndex">
                    返回
                </v-btn>
            </v-form>
        </v-container>
        <v-snackbar v-model="snackbar" :top="true" :right="true" :color="snackColor">
            {{snackText}}
            <v-btn flat @click="snackbar = false">
                关闭
            </v-btn>
        </v-snackbar>
    </v-content>
</template>
<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
    import * as apiUrls from './../utils/api-urls'
    export default {
        data: () => ({
            loading: false,
            snackbar: false,
            snackColor: '',
            snackText: '操作成功',
            valid: true,
            inputs: {
                name: null,
                image: null,
                images: [],
                // origin_price: 99.00,
                // bargain_price: 0.99,
                // total_num: 99,
                // bargain_max_price: 9,
                // bargain_min_price: 0.99,
                // bargain_min_times: 5,
                // bargain_max_times: 20,
            },
            menu1: false,
            menu2: false,
            errors: {
                'name': [],
                'descr': [],
                'image': [],
                'images': [],
                // 'origin_price': [],
                // 'bargain_price': [],
                // 'total_num': [],
                // 'bargain_max_price': [],
                // 'bargain_min_price': [],
                // 'bargain_min_times': [],
                // 'bargain_max_times': []
            },
            rules: {
                'name': [v => !!v || '请输入店铺名'],
                'descr': [v => !!v || '请输入描述'],
                'image': [],
                'images': [],
                // 'origin_price': [],
                // 'bargain_price': [],
                // 'total_num': [],
                // 'bargain_max_price': [],
                // 'bargain_min_price': [],
                // 'bargain_min_times': [],
                // 'bargain_max_times': []
            }
        }),
        created: function () {
            this.getItem()
        },
        computed: {
            ...mapState({})
        },
        watch: {
            '$router': 'getItem'
        },
        methods: {
            toIndex() {
                this.$router.go(-1)
            },
            deleteImage(index) {
                this.inputs.images.splice(index, 1)
            },
            submit() {
                let vm = this,
                    url, method
                if (vm.$refs.form.validate()) {
                    if (vm.inputs.id && vm.$router.history.current.name == 'item') {
                        url = apiUrls.ITEM_UPDATE.replace('{id}', vm.inputs.id)
                        method = 'PUT'
                    } else {
                        url = apiUrls.ITEM_CREATE
                        method = 'POST'
                    }
                    vm.loading = true
                    axios({
                        method: method,
                        url: url,
                        data: vm.inputs
                    }).then(function (res) {
                        vm.snackbar = true
                        vm.snackColor = 'success'
                        vm.loading = false
                        if (vm.$router.history.current.name == 'createItem') {
                            vm.snackText = '创建成功'
                            vm.clear()
                        }
                        else if(vm.$router.history.current.name == 'copyItem'){
                            vm.snackText = '复制成功'
                            vm.clear()
                            vm.toIndex()
                        }
                        else{
                            vm.snackText = '更新成功'
                        }
                    }).catch(function (res) {
                        vm.snackbar = true
                        vm.snackColor = 'error'
                        vm.loading = false
                        if (res.response && res.response.status == 422) {
                            vm.snackText = '输入错误哦'
                            let errors = res.response.data
                            for (let key in errors) {
                                vm.errors[key] = errors[key]
                            }
                        }
                        else{
                            vm.snackText = '服务器错误'
                        }
                    })
                }
            },
            clear() {
                this.$refs.form.reset()
            },
            getItem() {
                let vm = this
                if (vm.$route.params.id) {
                    let id = vm.$route.params.id
                    let url = apiUrls.ITEM_UPDATE.replace('{id}', id)
                    axios({
                        method: 'GET',
                        url: url
                    }).then((response) => {
                        vm.inputs = response.data.data
                    })
                }

            },
            pickFile(name) {
                this.$refs[name].click()
            },
            onFilePicked(e) {
                let files = e.target.files
                if (files[0] !== undefined) {
                    if (files[0].name.lastIndexOf('.') <= 0) {
                        return
                    }
                    let fr = new FileReader()
                    fr.readAsDataURL(files[0])
                    fr.addEventListener('load', () => {
                        this.inputs.image = fr.result
                    })
                } else {
                    this.inputs.image = ''
                }
            },
            onFilesPicked(e) {
                const files = e.target.files
                if (files[0] !== undefined) {
                    // this.inputs[filename] = files[0].name
                    if (files[0].name.lastIndexOf('.') <= 0) {
                        return
                    }
                    if( !this.inputs.images ){
                        this.inputs.images = []
                    }
                    for (let index = 0; index < files.length; index++) {
                        const fr = new FileReader()
                        fr.readAsDataURL(files[index])
                        fr.addEventListener('load', () => {
                            this.inputs.images.push(fr.result)
                        })
                    }
                } else {
                    this.inputs.images = []
                    // this.inputs[filename] = ''
                }
            },
            formatDate(date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${month}/${day}/${year}`
            }
        }
    }
</script>