<template>
  <div>
    <!--树形图-->
    <el-input
      placeholder="请输入部门名称进行搜索..."
      prefix-icon="el-icon-search"
      style="width: 40%"
      v-model="filterText">
    </el-input>

    <el-tree
      style="min-width: 400px"
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      highlight-current
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{data.name}}</span>
        <span>
          <el-button
            type="primary"
            class="depBtn"
            icon="el-icon-plus"
            @click="handleAdd(data)">
            添加
          </el-button>
          <el-button
            type="success"
            class="depBtn"
            icon="el-icon-edit"
            @click="handleUpdate(data)">
            修改
          </el-button>
          <el-button
            type="danger"
            class="depBtn"
            icon="el-icon-delete"
            @click="handleDelete(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      width="30%"
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="cancel">
      <div>
        <table>
          <tr v-if="addVisible === true && parentNode">
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>{{parentNode.name}}</td>
          </tr>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input v-model="dep.name" placeholder="请输入部门名称..."/>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="addVisible === true">新 增</el-button>
        <el-button type="primary" @click="update" v-if="updateVisible === true">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Department',
  data () {
    return {
      title: '',
      dialogVisible: false,
      addVisible: false,
      updateVisible: false,
      filterText: '',
      parentNode: null,
      node: null,
      dep: {
        name: '',
        parentId: -1
      },
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.initDeps()
  },
  methods: {
    initDep () {
      this.dep = {
        name: '',
        parentId: -1,
        id: ''
      }
      this.parentNode = null
      this.node = null
    },
    handleAdd (data) {
      // 展示新增部门的弹窗
      this.title = '新增部门'
      this.dialogVisible = true
      this.addVisible = true
      this.dep.parentId = data.id
      this.parentNode = data
    },
    handleUpdate (data) {
      this.title = '修改部门'
      this.dialogVisible = true
      this.updateVisible = true
      Object.assign(this.dep, data)
      this.node = data
    },
    initDeps () {
      this.getRequest('/basic/dep/').then(resp => {
        console.log(resp.obj)
        if (resp.obj) {
          this.deps = resp.obj
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleDelete (node, data) {
      // 删除部门
      if (data.parent) {
        this.$message.error('父部门删除失败')
      } else {
        this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/basic/dep/' + data.id).then(resp => {
            console.log(resp)
            if (resp) {
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex(d => d.id === data.id)
              children.splice(index, 1)
            }
          })
        })
      }
    },
    add () {
      // 新增部门
      this.postRequest('/basic/dep/add', this.dep).then(resp => {
        console.log(this.dep)
        if (resp) {
          if (!this.parentNode.parent) {
            // 叶节点变为根节点
            this.parentNode.parent = true
            this.parentNode.children = []
          }
          this.parentNode.children.push(resp.obj)
          this.cancel()
        }
      })
    },
    update () {
      // 修改部门名称
      this.postRequest('/basic/dep/update', this.dep).then(resp => {
        console.log(this.dep)
        if (resp) {
          this.node.name = this.dep.name
          this.cancel()
        }
      })
    },
    // 取消/完成 新增/修改操作后相关变量设置
    cancel () {
      // 初始化配置
      this.initDep()
      this.addVisible = false
      this.updateVisible = false
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .depBtn {
    padding: 1px;
    font-size: 16px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-right: 8px;
    width: 100%;
    height: 30px;
  }
</style>

<style>
  .el-tree-node__content {
    height: 40px;
    margin: 5px;
  }
</style>
