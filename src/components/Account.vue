<template>
    <v-content>
        <v-container fluid>
            <v-form ref="form" v-model="valid" lazy-validation v-if="inputs">
                <v-text-field v-model="inputs.password" :rules="rules.password" label="请输入密码" required type="password"></v-text-field>
                <v-text-field v-model="inputs.repeatPassword" :rules="rules.repeatPassword" label="请输入重复密码" required type="password"></v-text-field>
                <v-btn :loading="loading" :disabled="!valid" @click="submit" large color="primary">
                    提交修改
                </v-btn>
            </v-form>
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
    import {
        mapState,
        mapActions
    } from 'vuex'
    import * as apiUrls from './../utils/api-urls'

    export default {
        data(){
            return {
                loading: false,
                snackbar: false,
                snackbarText: '更新成功',
                snackColor: 'success',
                valid: true,
                inputs: {
                    password: '',
                    repeatPassword: ''
                },
                errors: {
                    'password': [],
                    'repeatPassword': [],
                },
                rules: {
                    'password': [v => (!!v && v.length >= 6) || '密码不能少于6个字符' ],
                    'repeatPassword': [v => (!!v && this.inputs && v == this.inputs.password)  || '请输入重复密码'],
                }
            }
        },
        methods: {
            submit() {
                let vm = this
                if (vm.$refs.form.validate()) {
                    let url = apiUrls.ACCOUNT
                    vm.loading = true
                    axios({
                        method: 'PUT',
                        url: url,
                        data: {
                            password: vm.inputs.password,
                            repeatPassword: vm.inputs.repeatPassword
                        }
                    }).then(function (res) {
                        vm.snackbar = true
                        vm.snackColor = 'success'
                        vm.loading = false
                        vm.snackbarText = '更新成功'
                    }).catch(function (error) {
                        vm.snackbar = true
                        vm.loading = false
                        vm.snackbarText = '操作失败'
                        vm.snackColor = 'error'
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
            formatDate(date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${month}/${day}/${year}`
            }
        }
    }
</script>