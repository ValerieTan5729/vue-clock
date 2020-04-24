<template>
  <div>
    <div>
      <el-divider content-position="left" style="font-size: 20px">查询条件</el-divider>
      <el-form :model="searchValue" ref="searchForm" label-position="right" label-width="90px" style="width: 90%; text-align: center">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="searchValue.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="searchValue.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在部门" prop="depId">
              <el-cascader
                placeholder="请选择所在部门"
                v-model="searchValue.depId"
                :options="depList"
                :show-all-levels="false"
                :props="{ label: 'name', value: 'id', checkStrictly: true }"
                filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="值班级别" prop="levelId">
              <el-cascader
                placeholder="请选择值班级别"
                v-model="searchValue.levelId"
                :options="dutyLevelList"
                :show-all-levels="false"
                :props="{ label: 'name', value: 'id', expandTrigger:'hover' }"
                filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <!-- 用户信息表格 -->
      <el-table
        class="userTable"
        :data="user"
        style="width: 100%"
        ref="table"
        row-key="id"
        v-loading="loading"
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column>
          <!-- 表头工具栏 -->
          <template slot="header">
            <el-button
              size="mini"
              type="success"
              @click="() => handleAdd()">
              新增
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="() => handleEdit()">
              修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="() => handleDelete()">
              删除
            </el-button>
          </template>
          <el-table-column
            type="selection"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            align="center"/>
          <el-table-column
            prop="phone"
            label="手机号码"
            align="center"/>
          <el-table-column
            prop="depName"
            label="所在部门"
            align="center"/>
          <el-table-column
            prop="dutyLevelName"
            label="值班级别"
            align="center"/>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
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
      <!-- 分页组件 -->
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
          background
          @current-change="pageChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="40%">
      <div>
        <el-form :model="userDetail" :rules="rules" ref="userForm" label-position="right" label-width="90px">
          <el-form-item label="用户名称" prop="name">
              <el-input v-model="userDetail.name" placeholder="请输入用户名称" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
              <el-input v-model="userDetail.phone" />
          </el-form-item>
          <el-form-item label="所在部门" prop="depId">
            <!--
            <el-select v-model="userDetail.depId" placeholder="请选择所在部门" ref="selectDep" style="width: 100%">
              <el-option :value="userDetail.depId" :label="userDetail.depName" style="min-height:200px; overflow: auto; background-color:#fff">
                <el-tree
                  :accordion=true
                  :highlight-current=true
                  :data="depList"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                />
              </el-option>
            </el-select>
              -->
            <el-cascader
              ref="depCascader"
              style="width: 100%"
              placeholder="请选择所在部门"
              v-model="userDetail.depPath"
              :options="depList"
              :props="{ label: 'name', value: 'id', checkStrictly: true }"
              @change="departmentChange"
              filterable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="值班级别" prop="dutyLevelId">
            <!--
            <el-select v-model="userDetail.dutyLevelId" placeholder="请选择值班级别" ref="selectDuty" style="width: 100%">
              <el-option :value="userDetail.dutyLevelId" :label="userDetail.levelName" style="min-height:200px; overflow: auto; background-color:#fff">
                <el-tree
                  :accordion=true
                  :highlight-current=true
                  :data="dutyLevelList"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                />
              </el-option>
            </el-select>
            -->
            <el-cascader
              ref="dutyCascader"
              style="width: 100%"
              placeholder="请选择值班级别"
              v-model="userDetail.dutyLevelPath"
              :options="dutyLevelList"
              :props="{ label: 'name', value: 'id', expandTrigger:'hover' }"
              @change="dutyChange"
              filterable>
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="send">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      user: [],
      selectedUser: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      title: '',
      dialogVisible: false,
      depList: [],
      dutyLevelList: [],
      userDetail: {
        id: null,
        name: '',
        phone: '',
        depId: null,
        depPath: null,
        depName: '',
        dutyLevelId: null,
        dutyLevelPath: null
      },
      searchValue: {
        search: false,
        name: null,
        phone: null,
        depId: null,
        levelId: null
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入用户手机号码', trigger: 'blur' }],
        depId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        dutyLevelId: [{ required: true, message: '请选择值班级别', trigger: 'blur' }]
      }
      /*
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      }
      */
    }
  },
  mounted () {
    this.initDepartment()
    this.initDutyLevel()
    this.initUser()
  },
  methods: {
    initDepartment () {
      console.log('获取部门')
      this.getRequest('/basic/dep/').then(resp => {
        if (resp) {
          this.depList = this.getTreeData(resp.obj)
          console.log(this.depList)
        }
      })
    },
    initDutyLevel () {
      console.log('获取值班级别')
      this.getRequest('/basic/dic/duty').then(resp => {
        if (resp) {
          this.dutyLevelList = this.getTreeData(resp.obj)
          console.log(this.dutyLevelList)
        }
      })
    },
    initUser () {
      var url = '/user/?page=' + this.page + '&limit=' + this.limit
      if (this.searchValue.search) {
        if (this.searchValue.name) {
          url += '&name=' + this.searchValue.name
        }
        if (this.searchValue.phone) {
          url += '&phone=' + this.searchValue.phone
        }
        if (this.searchValue.depId) {
          url += '&depId=' + this.searchValue.depId[this.searchValue.depId.length - 1]
        }
        if (this.searchValue.levelId) {
          url += '&levelId=' + this.searchValue.levelId[this.searchValue.levelId.length - 1]
        }
      }
      this.loading = true
      this.getRequest(url).then(resp => {
        if (resp) {
          this.user = resp.obj.data
          this.total = resp.obj.total
          this.loading = false
        }
      })
    },
    initUserDetail () {
      this.userDetail = {
        id: null,
        name: '',
        phone: '',
        depId: null,
        depPath: null,
        depName: '',
        dutyLevelId: null,
        dutyLevelPath: null
      }
    },
    pageChange (currentPage) {
      this.page = currentPage
      this.initUser()
    },
    sizeChange (currentSize) {
      this.limit = currentSize
      this.initUser()
    },
    search () {
      this.searchValue.search = true
      console.log(this.searchValue)
      this.initUser()
    },
    reset () {
      // this.$refs.searchForm.resetFields()
      this.searchValue = {
        search: false,
        name: null,
        phone: null,
        depId: null,
        levelId: null
      }
      this.initUser()
    },
    handleSelectionChange (val) {
      this.selectedUser = val
      console.log(this.selectedUser)
    },
    handleAdd () {
      console.log('handle add')
      this.title = '新增用户信息'
      this.dialogVisible = true
    },
    handleEdit (index, row) {
      console.log('handle edit')
      this.title = '修改用户信息'
      let edit = 0
      if (index === undefined || row === undefined) {
        console.log('表头按钮的修改按钮被点击')
        if (this.selectedUser.length !== 1) {
          this.$message.error('请只选择一项用户信息进行查看')
          return null
        }
        edit = 1
      }
      edit === 1 ? Object.assign(this.userDetail, this.selectedUser[0]) : Object.assign(this.userDetail, row)
      // console.log('获取部门路径')
      this.userDetail.depPath = this.getPath(this.depList, this.userDetail.depId)
      // console.log(this.userDetail.depPath)
      // console.log('获取值班级别路径')
      this.userDetail.dutyLevelPath = this.getPath(this.dutyLevelList, this.userDetail.dutyLevelId)
      // console.log(this.userDetail.dutyLevelPath)
      console.log(this.userDetail)
      this.dialogVisible = true
    },
    handleDelete (index, row) {
      console.log('handle delete')
      console.log(index, row)
      if (index && row) {
        console.log('行内按钮的删除按钮被点击')
        this.$confirm('此操作将永久删除用户【' + row.name + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/user/' + row.id).then(resp => {
            if (resp) {
              this.initUser()
            }
          })
        })
      } else {
        console.log('表头按钮的删除按钮被点击')
        if (this.selectedUser.length > 0) {
          this.$confirm('此操作将永久删除勾选的用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = ''
            this.selectedUser.map((item) => {
              ids += item.id + ','
            })
            this.deleteRequest('/user/batch/' + ids).then(resp => {
              if (resp) {
                this.initUser()
              }
            })
          })
        } else {
          this.$message.error('至少选择一项数据')
        }
      }
    },
    cancel () {
      this.initUserDetail()
      this.$refs.userForm.resetFields()
      this.dialogVisible = false
    },
    /*
    handleNodeClick (node) {
      console.log('树形选择框被选中', node.parent)
      if (node.parent !== undefined) {
        console.log('选择部门')
        this.userDetail.depId = node.id
        this.userDetail.depName = node.name
      } else {
        console.log('选择值班级别')
        if (node.children !== null) {
          this.$message.error('值班级别请选择子节点')
        } else {
          this.userDetail.dutyLevelId = node.id
          this.userDetail.levelName = node.name
          this.$refs.selectDuty.blur()
        }
      }
    },
    */
    departmentChange (node) {
      console.log('改变所在部门', node)
      console.log(this.$refs.depCascader.getCheckedNodes())
      this.userDetail.depId = this.userDetail.depPath[this.userDetail.depPath.length - 1]
    },
    dutyChange (node) {
      console.log('改变值班级别', node)
      console.log(this.$refs.dutyCascader.getCheckedNodes())
      this.userDetail.dutyLevelId = this.userDetail.dutyLevelPath[this.userDetail.dutyLevelPath.length - 1]
    },
    send () {
      console.log('向后台发送数据')
      console.log(this.userDetail)
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (this.userDetail.id) {
            console.log('修改用户信息')
            this.putRequest('/user/', this.userDetail).then(resp => {
              if (resp) {
                this.initUser()
                // this.dialogVisible = false
                this.cancel()
              }
            })
          } else {
            console.log('新增用户信息')
            this.postRequest('/user/', this.userDetail).then(resp => {
              if (resp) {
                this.initUser()
                // this.dialogVisible = false
                this.cancel()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTreeData (list) {
      // 获取符合cascader的value
      for (let i = 0; i < list.length; i++) {
        if (list[i].children.length === 0) {
          list[i].children = undefined
        } else {
          this.getTreeData(list[i].children)
        }
      }
      return list
    },
    getPath (list, id) {
      // 获取级联的路径
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return [id]
        } else {
          if (list[i].children !== undefined) {
            const child = this.getPath(list[i].children, id)
            // console.log('get path : child = ' + child)
            if (child !== undefined) {
              child.unshift(list[i].id)
              // console.log('get path : add parent id ' + list[i].id)
              // console.log('path is ' + child)
              return child
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .el-divider__text {
    font-size: 20px;
  }
  .el-input__inner {
    width: 200px;
  }
</style>
