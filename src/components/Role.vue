<template>
  <div
    v-loading="globalLoading"
    element-loading-text="正在添加..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="RoleTool">
      <el-input size="small" type="text" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" placeholder="请输入角色中文名" v-model="role.namezh"
                @keydown.enter.native="addRole" />
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">添加角色</el-button>
    </div>
    <div class="RoleMain">
      <el-collapse v-model="activeName"
                   v-loading="loading"
                   element-loading-text="正在加载..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   accordion
                   @change="change">
        <el-collapse-item :title="r.namezh" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0;color: #ff0000;" icon="el-icon-delete"
                         type="text" @click="deleteRole(r)">删除角色</el-button>
            </div>
            <div>
              <el-tree
                show-checkbox
                node-key="id"
                ref="tree"
                default-expand-all
                :key="index"
                :default-checked-keys="selectedMenus"
                :data="allMenus"
                :props="defaultProps" />
              <div style="display: flex;justify-content: flex-end">
                <el-button @click="cancelUpdate">取消修改</el-button>
                <el-button type="primary" @click="update(r.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      role: {
        name: '',
        namezh: ''
      },
      allMenus: [],
      activeName: -1,
      selectedMenus: [],
      roles: [],
      loading: false,
      globalLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted () {
    this.initRoles()
  },
  methods: {
    deleteRole (role) {
      this.$confirm('此操作将永久删除【' + role.namezh + '】角色(可能会导致部分用户无法正常使用系统), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/adv/role/' + role.id).then(resp => {
          if (resp) {
            this.initRoles()
          }
        })
      })
    },
    addRole () {
      if (this.role.name && this.role.namezh) {
        this.globalLoading = true
        this.postRequest('/adv/role/add', this.role).then(resp => {
          this.globalLoading = false
          if (resp) {
            this.role.name = ''
            this.role.nameZh = ''
            this.initRoles()
          }
        })
      } else {
        this.$message.error('数据不可以为空')
      }
    },
    cancelUpdate () {
      this.activeName = -1
    },
    update (rid, index) {
      const tree = this.$refs.tree[index]
      const selectedKeys = tree.getCheckedKeys(true)
      console.log(selectedKeys)
      selectedKeys.forEach(key => {
        console.log(key)
      })
      let url = '/adv/role/menu?roleId=' + rid
      selectedKeys.forEach(key => {
        url += '&menuList=' + key
      })
      this.putRequest(url).then(resp => {
        if (resp) {
          this.activeName = -1
        }
      })
    },
    change (rid) {
      if (rid) {
        this.initAllMenus(rid)
      }
    },
    initSelectedMenus (rid) {
      this.getRequest('/menu/role/' + rid).then(resp => {
        if (resp.obj) {
          console.log('initSelectedMenus')
          console.log(resp)
          this.selectedMenus = resp.obj
        }
      })
    },
    initAllMenus (rid) {
      this.initSelectedMenus(rid)
      this.getRequest('/menu/all').then(resp => {
        if (resp.obj) {
          console.log('initAllMenus')
          console.log(resp)
          this.allMenus = resp.obj
        }
      })
    },
    initRoles () {
      this.loading = true
      this.getRequest('/adv/role/').then(resp => {
        this.loading = false
        if (resp) {
          this.roles = resp.obj.data
          console.log('role')
          console.log(resp.obj.data)
        }
      })
    }
  }
}
</script>

<style scoped>
  .RoleTool {
    display: flex;
    justify-content: flex-start;
  }

  .RoleTool .el-input {
    width: 300px;
    margin-right: 6px;
  }

  .RoleMain {
    margin-top: 10px;
    width: 700px;
  }
</style>
