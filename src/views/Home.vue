<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">后台管理</div>
        <div>
          <el-dropdown class="userInfo" @command="commandHandler">
            <span class="el-dropdown-link" style="color: white">
              {{user.name}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              -->
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened :default-active="this.$route.path">
            <!--<el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">-->
            <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index">
              <template slot="title">
                <!--<i style="color: #409eff;margin-right: 5px" :class="item.iconCls"></i>-->
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                {{child.name}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到总值打卡后台管理！
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      width="30%"
      title="修改密码"
      :visible.sync="dialogVisible"
      :before-close="cancel">
      <el-form :model="password" label-position="right" label-width="90px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="password.oldPassword" type="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="password.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user')),
      dialogVisible: false,
      password: {
        oldPassword: '',
        newPassword: ''
      }
    }
  },
  computed: {
    routes () {
      return this.$store.state.routes
    }
  },
  methods: {
    commandHandler (cmd) {
      if (cmd === 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest('/logout')
          window.sessionStorage.removeItem('user')
          this.$store.commit('INIT_ROUTES', [])
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else if (cmd === 'password') {
        // 修改密码
        this.dialogVisible = true
      }
    },
    changePassword () {
      this.putRequest('/user/' + this.user.id + '/password', this.password).then(resp => {
        if (resp) {
          this.getRequest('/logout')
          window.sessionStorage.removeItem('user')
          this.$store.commit('INIT_ROUTES', [])
          this.$router.replace('/')
        }
      })
    },
    cancel () {
      this.dialogVisible = false
      this.password = {
        oldPassword: '',
        newPassword: ''
      }
    }
  }
}
</script>

<style>
  .homeRouterView {
    margin-top: 10px;
  }

  .homeWelcome {
    text-align: center;
    font-size: 30px;
    font-family: 华文行楷;
    color: #409eff;
    padding-top: 50px;
  }

  .homeHeader {
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*padding: 0px 15px;*/
    box-sizing: border-box;
  }

  .homeHeader .title {
    font-size: 30px;
    font-family: 华文行楷;
    color: #ffffff
  }

  .homeHeader .userInfo {
    cursor: pointer;
  }

  .el-dropdown-link img {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
</style>
