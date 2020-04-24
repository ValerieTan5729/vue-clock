<template>
  <div>
    <el-table
      :data="dictionary"
      style="width: 95%"
      ref="table"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <el-table-column
          prop="operate"
          align="center"
          width="250"
          fixed="right">
          <template slot="header">
            <el-button
              size="mini"
              type="primary"
              @click="() => handleAdd()">
              新增
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="() => handleAdd(scope.$index, scope.row)">
              新增
            </el-button>
            <el-button
              size="mini"
              @click="() => handleEdit(scope.$index, scope.row)">
              修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="() => handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog :title="type"
               :visible.sync="dialogVisible"
               :show-close="showClose"
               :before-close="cancel"
               width="30%">
      <div>
        <table>
          <tr v-if="addVisible === true && parentNode">
            <td>
              <el-tag>上级节点</el-tag>
            </td>
            <td>{{parentNode.name}}</td>
          </tr>
          <tr>
            <td>
              <el-tag>名称</el-tag>
            </td>
            <td>
              <el-input v-model="dict.name" placeholder="请输入名称...">{{dict.name}}</el-input>
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
  name: 'Dictionary',
  data () {
    return {
      dictionary: [],
      dict: {
        name: '',
        parentId: 0,
        id: null
      },
      node: null,
      parentNode: null,
      type: '',
      dialogVisible: false,
      addVisible: false,
      updateVisible: false,
      showClose: false
    }
  },
  mounted () {
    this.initDictionary()
  },
  methods: {
    // 初始化表格数据
    initDictionary () {
      this.getRequest('/basic/dic/').then(resp => {
        console.log(resp.obj)
        if (resp.obj) {
          this.dictionary = resp.obj
        }
      })
    },
    // 初始化变量
    initDict () {
      this.node = null
      this.parentNode = null
      this.dict = {
        name: '',
        parentId: 0,
        id: null
      }
    },
    // 异步加载子节点
    load (tree, treeNode, resolve) {
      console.log('若未获取子节点内容, 异步加载子节点')
      this.getRequest('/basic/dic/parent/' + tree.id).then(resp => {
        console.log(resp.obj)
        if (resp.obj) {
          setTimeout(() => {
            resolve(resp.obj)
            tree.children = resp.obj
          }, 200)
        }
      })
    },
    // 展示添加节点的对话框
    handleAdd (index, row) {
      this.type = '新增节点'
      if (row) {
        this.parentNode = row
        this.dict.parentId = row.id
        this.type = '新增子节点'
      }
      this.dialogVisible = true
      this.addVisible = true
    },
    // 展示修改节点信息的对话框
    handleEdit (index, row) {
      this.type = '修改节点信息'
      this.node = row
      this.dict = Object.assign({}, row)
      this.dialogVisible = true
      this.updateVisible = true
    },
    // 删除节点
    handleDelete (index, row) {
      console.log('删除节点')
      console.log(index)
      console.log(row)
      console.log(row.hasChildren)
      if (row.hasChildren) {
        this.$message.error('存在子节点, 无法删除')
      } else {
        this.$confirm('此操作将永久删除【' + row.name + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/basic/dic/' + row.id).then(resp => {
            console.log(resp)
            if (resp) {
              // 从表格移除数据(参考饿了吗的移除函数)
              this.dictionary.splice(index, 1)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      }
    },
    // 新增节点
    add () {
      this.postRequest('/basic/dic/', this.dict).then(resp => {
        if (resp) {
          if (this.parentNode) {
            // 同步增加数据到表格
            if (this.parentNode.hasChildren && this.parentNode.children != null) {
              // 如果父节点有children, 将新增信息添加到父节点的children数组中
              // 如果父节点没有children, 等待用户异步加载子节点信息(load())
              this.parentNode.children.push(resp.obj)
            }
            this.parentNode.hasChildren = true
          } else {
            this.dictionary.push(resp.obj)
          }
          // 初始化配置
          this.cancel()
        }
      })
    },
    // 修改节点
    update () {
      console.log(this.node)
      // 修改
      this.putRequest('/basic/dic/', this.dict).then(resp => {
        if (resp) {
          // 同步更新表格里面的内容
          this.node.name = this.dict.name
          // 初始化配置
          this.cancel()
        }
      })
    },
    // 取消/完成 新增/修改操作后相关变量设置
    cancel () {
      // 初始化配置
      this.initDict()
      this.addVisible = false
      this.updateVisible = false
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-input {
  margin: 5px;
}
</style>
