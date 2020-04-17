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
      style="width: 600px"
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{data.name }}</span>
        <span>
          <el-button
            type="primary"
            class="depBtn"
            @click="() => showAddDepView(data)">
            添加
          </el-button>
          <el-button
            type="success"
            class="depBtn"
            @click="() => showUpdateDepView(data)">
            修改
          </el-button>
          <el-button
            type="danger"
            class="depBtn"
            @click="() => deleteDep(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="添加部门"
      :visible.sync="addDialogVisible"
      width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>{{pname}}</td>
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDep">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改部门名称"
               :visible.sync="updateDialogVisible"
               width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input v-model="dep.name" placeholder="请输入部门名称...">{{dep.name}}</el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Department',
  data () {
    return {
      addDialogVisible: false,
      updateDialogVisible: false,
      filterText: '',
      parentNode: null,
      dep: {
        name: '',
        parentId: -1
      },
      pname: '',
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
      this.pname = ''
      this.parentNode = null
    },
    showAddDepView (data) {
      // 展示新增部门的弹窗
      this.pname = data.name
      this.dep.parentId = data.id
      this.addDialogVisible = true
      this.parentNode = data
    },
    showUpdateDepView (data) {
      this.dep.name = data.name
      this.dep.id = data.id
      this.dep.parentId = data.parentId
      this.updateDialogVisible = true
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
    addDep2Deps (deps, dep) {
      // 添加部门到当前视图
      for (let i = 0; i < deps.length; i++) {
        const d = deps[i]
        if (d.id === dep.parentId) {
          d.children = d.children.concat(dep)
          if (d.children.length > 0) {
            d.parent = true
          }
          return
        } else {
          this.addDep2Deps(d.children, dep)
        }
      }
    },
    addDep () {
      // 新增部门
      this.postRequest('/basic/dep/add', this.dep).then(resp => {
        console.log(this.dep)
        if (resp) {
          this.addDep2Deps(this.deps, resp.obj)
          this.addDialogVisible = false
          this.initDep()
        }
      })
    },
    updateDep2Deps (deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        const d = deps[i]
        if (d.id === dep.id) {
          d.name = dep.name
        } else {
          this.updateDep2Deps(d.children, dep)
        }
      }
    },
    updateDep () {
      // 修改部门名称
      this.postRequest('/basic/dep/update', this.dep).then(resp => {
        console.log(this.dep)
        if (resp) {
          this.updateDep2Deps(this.deps, this.dep)
          this.updateDialogVisible = false
          this.initDep()
        }
      })
    },
    removeDepFromDeps (p, deps, id) {
      console.log('remove department, id:' + id)
      for (let i = 0; i < deps.length; i++) {
        const d = deps[i]
        if (d.id === id) {
          deps.splice(i, 1)
          if (deps.length === 0) {
            p.parent = false
          }
          return
        } else {
          this.removeDepFromDeps(d, d.children, id)
        }
      }
    },
    deleteDep (data) {
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
              this.removeDepFromDeps(null, this.deps, data.id)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
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
