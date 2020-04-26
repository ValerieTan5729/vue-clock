<template>
  <div>
    <el-table
      :data="menu"
      style="width: 95%"
      ref="table"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="后端路径">
      </el-table-column>
      <el-table-column
        prop="path"
        align="center"
        label="前端路径">
      </el-table-column>
      <el-table-column
        prop="component"
        align="center"
        label="前端部件">
      </el-table-column>
      <el-table-column
        prop="auth"
        align="center"
        label="登录后访问">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.auth"
                     active-color="#13ce66"
                     disabled />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button
            class="innerBtn"
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="() => handleAdd(scope.$index, scope.row)" />
          <el-button
            class="innerBtn"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="() => handleEdit(scope.$index, scope.row)" />
          <el-tooltip class="item" effect="dark"
                      content="存在子级菜单不可删除" placement="top-start"
                      :disabled="scope.row.children.length === 0">
            <el-button
              class="innerBtn"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              :disabled="scope.row.parentId === 0"
              @click="() => handleDelete(scope.$index, scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="40%">
      <el-form :model="menuDetail" :rules="rules" ref="menuForm" label-position="right" label-width="90px">
        <el-form-item label="上级菜单" prop="parentName" v-if="menuDetail.parentId > 0">
          <el-tag>{{menuDetail.parentName}}</el-tag>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuDetail.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="后端路径" prop="url">
          <el-input v-model="menuDetail.url" placeholder="请输入后端路径" />
        </el-form-item>
        <el-form-item label="前端路径" prop="path" v-if="this.menuDetail.parentId > 0">
          <el-input v-model="menuDetail.path" placeholder="请输入前端路径" />
        </el-form-item>
        <el-form-item label="前端组件" prop="component" v-if="this.menuDetail.parentId > 0">
          <el-input v-model="menuDetail.component" placeholder="请输入前端组件" />
        </el-form-item>
        <el-form-item label="登录后访问" prop="auth" v-if="this.menuDetail.parentId > 0">
          <el-switch v-model="menuDetail.auth" active-color="#13ce66" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="send">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      menu: [],
      menuDetail: {
        id: null,
        name: null,
        url: null,
        path: null,
        component: null,
        auth: true,
        parentId: null,
        parentName: null
      },
      title: '',
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入后端路径', trigger: 'blur' }],
        path: [{ required: true, message: '请输入前端路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入前端组件', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.initMenu()
  },
  methods: {
    initMenu () {
      console.log('获取菜单列表')
      this.getRequest('/adv/menu/all').then(resp => {
        if (resp) {
          console.log(resp.obj)
          this.menu = resp.obj
        }
      })
    },
    initMenuDetail () {
      this.menuDetail = {
        id: null,
        name: null,
        url: null,
        path: null,
        component: null,
        auth: true
      }
    },
    handleAdd (index, row) {
      this.title = '新增菜单信息'
      this.menuDetail.parentId = row.id
      this.menuDetail.parentName = row.name
      this.dialogVisible = true
    },
    handleEdit (index, row) {
      console.log('修改菜单')
      this.title = '修改菜单信息'
      Object.assign(this.menuDetail, row)
      if (row.parentId === 0) {
        this.menuDetail.path = ''
        this.menuDetail.component = ''
      }
      this.dialogVisible = true
    },
    handleDelete (index, row) {
      console.log('删除菜单')
      if (row.children.length === 0) {
        this.$confirm('此操作将永久删除【' + row.name + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/adv/menu/' + row.id).then(resp => {
            if (resp) {
              this.initMenu()
            }
          })
        })
      } else {
        this.$message.error('存在子级菜单, 无法删除')
      }
    },
    cancel () {
      this.dialogVisible = false
      this.initMenuDetail()
      this.$refs.menuForm.resetFields()
    },
    send () {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          if (this.menuDetail.id) {
            console.log('修改菜单信息')
            console.log(this.menuDetail)
            this.putRequest('/adv/menu/', this.menuDetail).then(resp => {
              if (resp) {
                this.initMenu()
                this.cancel()
              }
            })
          } else {
            console.log('新增菜单信息')
            console.log(this.menuDetail)
            this.postRequest('/adv/menu/', this.menuDetail).then(resp => {
              if (resp) {
                this.initMenu()
                this.cancel()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .innerBtn {
    padding: 7px;
  }
</style>
