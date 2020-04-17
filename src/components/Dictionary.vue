<template>
    <div>
      <el-table
        :data="dictionary"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="name"
          label="名称"
          sortable>
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          align="center"
          fixed="right"
          width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">Add</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Del</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  name: 'Dictionary',
  data () {
    return {
      dictionary: []
    }
  },
  mounted () {
    this.initDictionary()
  },
  methods: {
    initDictionary () {
      this.getRequest('/basic/dic/').then(resp => {
        console.log(resp.obj)
        if (resp.obj) {
          this.dictionary = resp.obj
        }
      })
    },
    load (tree, treeNode, resolve) {
      console.log('若未获取子节点内容, 异步加载子节点')
      this.getRequest('/basic/dic/parent/' + tree.id).then(resp => {
        console.log(resp.obj)
        if (resp.obj) {
          setTimeout(() => {
            resolve(resp.obj)
          }, 500)
        }
      })
    },
    removeDataFromDictionary (data, dictionary) {
      console.log('从视图删除节点')
    },
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
              // this.removeDepFromDeps(null, this.deps, data.id)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
