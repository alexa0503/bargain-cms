<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-toolbar dark color="primary">
                <v-toolbar-title>登录</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                </v-tooltip>
                <v-tooltip right>
                  <v-btn slot="activator" icon large href="https://codepen.io/johnjleider/pen/wyYVVj" target="_blank">
                    <v-icon large>mdi-codepen</v-icon>
                  </v-btn>
                  <span>Codepen</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-text-field prepend-icon="person" :rules="rules.name" v-model="name" label="登录名" name="name" type="text" :error-messages="errors.name"></v-text-field>
                <v-text-field v-model="password" prepend-icon="lock" :rules="rules.password" name="password" label="密码" type="password" :error-messages="errors.password"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="{name:'register'}" color="blue" flat>免费注册</v-btn>
                <v-btn :disabled="!valid" @click="submit" color="primary">登陆</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import * as apiUrls from './../utils/api-urls'
  export default {
    data: () => ({
      drawer: null,
      valid: false,
      name: '',
      password: '',
      errors: {
        'email': [],
        'password': []
      },
      rules: {
        'name': [
          v => !!v || '请输入登陆名',
          v => v.length >= 3 || '登陆名不能少于3个字符'
        ],
        'password': [
          v => !!v || '请输入密码',
          v => v.length >= 6 || '密码不能少于6个字符'
        ]
      },
    }),
    created() {
      if (this.$store.getters.token) {
        //this.$router.push({name:'home'})
      }
    },
    methods: {
      submit: function () {
        let self = this
        self.errors = {
          'name': [],
          'password': []
        }
        if (this.$refs.form.validate()) {
          let url = apiUrls.LOGIN
          axios.post(url, {
            name: this.name,
            password: this.password
          }).catch(function (error) {
            if (error.response.status >= 400) {
              let errors = error.response.data
              for (let key in errors) {
                self.errors[key] = errors[key][0]
              }
            }
          })
        }

      }
    }
  }
</script>