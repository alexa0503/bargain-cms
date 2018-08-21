<template>
    <v-content>
        <v-container fluid>
            <v-form ref="form" v-model="valid" lazy-validation v-if="inputs">
                <v-text-field v-model="inputs.name" :rules="rules.name" label="店铺名" required></v-text-field>
                <v-text-field v-model="inputs.title" :rules="rules.title" label="页面标题" required></v-text-field>
                <v-text-field v-model="inputs.tel" :rules="rules.tel" label="联系电话" required></v-text-field>
                <v-text-field v-model="inputs.address" :rules="rules.address" label="地址" required></v-text-field>
                <v-flex>
                    <img :src="inputs.thumb" height="200" v-if="inputs && inputs.thumb" />
                    <v-text-field label="店铺头像[200px*200px]" @click='pickFile("thumb")' v-model='inputs.thumb_name'></v-text-field>
                    <input type="file" style="display: none" ref="thumb" accept="image/*" @change="onFilePicked('thumb',$event)">
                </v-flex>
                <v-flex>
                    <img :src="inputs.header_image" width="750" v-if="inputs && inputs.header_image" />
                    <v-text-field label="头部图片[750px*300px]" @click='pickFile("header_image")' v-model='inputs.header_image_name'></v-text-field>
                    <input type="file" style="display: none" ref="header_image" accept="image/*" @change="onFilePicked('header_image',$event)">
                </v-flex>
                <!-- <v-layout row wrap>
                    <v-flex xs12 lg6>
                        <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" lazy transition="scale-transition"
                            offset-y full-width max-width="290px" min-width="290px">
                            <v-text-field slot="activator" v-model="inputs.start_date" label="活动开始日期" hint="" persistent-hint prepend-icon="event"></v-text-field>
                            <v-date-picker v-model="inputs.start_date" no-title @input="menu1 = false"></v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex xs12 lg6>
                        <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" lazy transition="scale-transition"
                            offset-y full-width max-width="290px" min-width="290px">
                            <v-text-field slot="activator" v-model="inputs.end_date" label="活动结束日期" hint="" persistent-hint prepend-icon="event"></v-text-field>
                            <v-date-picker v-model="inputs.end_date" no-title @input="menu2 = false"></v-date-picker>
                        </v-menu>
                    </v-flex>
                </v-layout> -->
                <!-- 
                <v-text-field v-model="inputs.share_title" :rules="rules.shareTitle" label="微信分享标题"></v-text-field>
                <v-flex>
                    <img :src="inputs.share_image" height="150" v-if="inputs && inputs.share_image" />
                    <v-text-field label="微信分享图片[750px*600px],不上传则默认分享图片是屏幕截图" @click='pickFile("share_image")' v-model='inputs.share_image_name'></v-text-field>
                    <input type="file" style="display: none" ref="share_image" accept="image/*" @change="onFilePicked('share_image',$event)">
                </v-flex> -->
                <v-btn :loading="loading" :disabled="!valid" @click="submit" large color="primary">
                    更新店铺信息
                </v-btn>
            </v-form>
        </v-container>
        <v-snackbar color="success" v-model="snackbar" :top="true" :right="true">
            更新成功~
            <v-btn color="white" flat @click="snackbar = false">
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
            loading: true,
            snackbar: false,
            valid: true,
            inputs: {},
            menu1: false,
            menu2: false,
            errors: {
                'name': [],
                'title': [],
                'thumb': [],
                'tel': [],
                'address': [],
                // 'shareTitle': [],
                // 'shareDescr': [],
                // 'shareImage': [],
            },
            rules: {
                'name': [v => !!v || '请输入店铺名'],
                'title': [v => !!v || '请输入页面标题'],
                'thumb': [v => !!v || '请上传店铺头像'],
                'tel': [v => !!v || '请输入电话'],
                'address': [v => !!v || '请填写地址'],
                // 'shareTitle': [],
                // 'shareDescr': [],
                // 'shareImage': [],
            }
        }),
        mounted: function () {
            let state = this.$store.state
            if (state.me) {
                this.inputs = state.me.shop
            }
        },
        computed: {
            ...mapState({
                shop: state => state.me && state.me.shop
            })
        },
        watch: {
            shop: function (v) {
                if (v) {
                    this.loading = false
                    this.inputs = v
                }
            }
        },
        methods: {
            submit() {
                let vm = this
                if (vm.$refs.form.validate()) {
                    let url = apiUrls.SHOP + '/' + vm.shop.id
                    vm.loading = true
                    axios({
                        method: 'PUT',
                        url: url,
                        data: {
                            name: vm.inputs.name,
                            title: vm.inputs.title,
                            header_image: vm.inputs.header_image,
                            thumb: vm.inputs.thumb,
                            tel: vm.inputs.tel,
                            address: vm.inputs.address,
                            start_date: vm.inputs.start_date,
                            end_date: vm.inputs.end_date,
                            // share_image: this.inputs.share_image,
                            // share_title: this.inputs.share_title,
                            // share_descr: this.inputs.share_descr,
                        }
                    }).then(function (res) {
                        vm.snackbar = true
                        vm.loading = false
                    }).catch(function (error) {
                        vm.snackbar = true
                        vm.loading = false
                        if (error.response.status >= 400) {
                            let errors = error.response.data
                            for (let key in errors) {
                                self.errors[key] = errors[key][0]
                            }
                        }
                    })
                }
            },
            clear() {
                this.$refs.form.reset()
            },
            pickFile(name) {
                this.$refs[name].click()
            },
            onFilePicked(name, e) {
                const files = e.target.files
                let filename = name + '_name'
                if (files[0] !== undefined) {
                    this.inputs[filename] = files[0].name
                    if (this.inputs[filename].lastIndexOf('.') <= 0) {
                        return
                    }
                    const fr = new FileReader()
                    fr.readAsDataURL(files[0])
                    fr.addEventListener('load', () => {
                        this.inputs[name] = fr.result
                        //this.shareImageFile = files[0]
                    })
                } else {
                    this.inputs[name] = ''
                    this.inputs[filename] = ''
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