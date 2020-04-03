<template>
  <div>
    <el-form
      :rules="rules"
      ref="loginForm"
      v-loading="loading"
      element-loading-text="正在登录..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :model="loginForm"
      class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="phone">
        <el-input size="normal" type="text" v-model="loginForm.phone" auto-complete="off"
                  placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                  placeholder="请输入密码" @keydown.enter.native="submitLogin" />
      </el-form-item>
<!--      <el-checkbox size="normal" class="loginRemember" v-model="checked" />-->
      <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      loginForm: {
        phone: '15692009328',
        password: '123456'
      },
      checked: true,
      rules: {
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log(this.loginForm)
          this.loading = true
          this.postRequest('/login', this.loginForm).then(resp => {
            this.loading = false
            console.log('login data')
            console.log(resp)
            debugger
            if (resp) {
              this.$store.commit('INIT_CURRENTUSER', resp.obj)
              window.sessionStorage.setItem('user', JSON.stringify(resp.obj))
              const path = this.$route.query.redirect
              this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
            }
          })
        } else {
          this.$message.error('请输入所有字段')
          return false
        }
      })
    }
  }
}
</script>

<style>
  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }

  .loginRemember {
    text-align: left;
    margin: 0 0 15px 0;
  }
</style>
