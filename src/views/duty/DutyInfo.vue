<template>
  <div>
    <!-- 查询表格 -->
    <div>
      <el-divider content-position="left" style="font-size: 20px; min-width: 900px">查询条件</el-divider>
      <el-form :model="searchValue" ref="searchForm" label-position="right" label-width="80px" style="width: 90%" :inline="true">
        <el-row>
            <el-form-item class="search-item" label="总值名称" prop="name">
              <el-input class="search-input" v-model="searchValue.name" />
            </el-form-item>
            <el-form-item class="search-item" label="开始时间" prop="beginDate">
              <el-date-picker
                class="search-picker"
                v-model="searchValue.beginDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开始日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="search-item" label="结束时间" prop="endDate">
              <el-date-picker
                class="search-picker"
                v-model="searchValue.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择结束日期">
              </el-date-picker>
            </el-form-item>
        </el-row>
        <el-row style="text-align: center">
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!-- 值班表信息 -->
    <div>
      <el-table
        :data="duty"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="handleSelectionChange"
        :default-sort="orderValue"
        @sort-change="handleSortChange">
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
            <!--
            <el-button
              size="mini"
              type="danger"
              @click="() => handleDelete()">
              删除
            </el-button>
            -->
          </template>
          <el-table-column
            type="selection"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            min-width="200"
            align="center"/>
          <el-table-column
            prop="beginDate"
            label="开始时间"
            sortable
            width="150"
            align="center"/>
          <el-table-column
            prop="endDate"
            label="结束时间"
            sortable
            width="150"
            align="center"/>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="250"
            align="center"/>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button
                class="innerBtn"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="() => handleEdit(scope.$index, scope.row)">
              </el-button>
              <el-button
                v-if="scope.row.active === 1"
                class="innerBtn"
                size="mini"
                type="danger"
                icon="el-icon-unlock"
                @click="() => handleInactive(scope.$index, scope.row)">
              </el-button>
              <el-button
                v-if="scope.row.active === 0"
                class="innerBtn"
                size="mini"
                type="success"
                icon="el-icon-lock"
                @click="() => handleActive(scope.$index, scope.row)">
              </el-button>
              <el-button
                class="innerBtn"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                :disabled="scope.row.active === 1"
                @click="() => handleDelete(scope.$index, scope.row)">
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
    <!-- 值班详情 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="40%">
      <div>
        <el-form :model="dutyDetail" :rules="rules" ref="dutyForm" label-position="right" label-width="90px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dutyDetail.name" placeholder="请输入值班表名称" />
          </el-form-item>
          <el-form-item label="开始时间" prop="beginDate">
            <el-date-picker
              class="form-picker"
              v-model="dutyDetail.beginDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始日期时间" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              class="form-picker"
              v-model="dutyDetail.endDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束日期时间" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dutyDetail.remark" placeholder="此处添加值班表备注" :autosize="{ minRows: 4, maxRows: 10}"/>
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
  name: 'DutyInfo',
  data () {
    return {
      duty: [],
      selectedDuty: [],
      dutyDetail: {
        id: null,
        name: null,
        beginDate: null,
        endDate: null,
        remark: null
      },
      current: null,
      total: 0,
      page: 1,
      limit: 10,
      orderValue: {
        prop: 'beginDate',
        order: 'descending'
      },
      searchValue: {
        name: null,
        beginDate: null,
        endDate: null,
        search: false
      },
      loading: false,
      title: '',
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '请输入值班表名称', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.initDuty()
  },
  methods: {
    initDuty () {
      let url = '/duty/?page=' + this.page + '&limit=' + this.limit
      if (this.searchValue.search) {
        if (this.searchValue.name) {
          url += '&name=' + this.searchValue.name
        }
        if (this.searchValue.beginDate && this.searchValue.endDate) {
          console.log('beginDate <= endDate')
          if (this.searchValue.beginDate > this.searchValue.endDate) {
            this.$message.error('开始日期应早于结束日期')
            return
          }
        }
        if (this.searchValue.beginDate) {
          url += '&beginDate=' + this.searchValue.beginDate
        }
        if (this.searchValue.endDate) {
          url += '&endDate=' + this.searchValue.endDate
        }
      }
      if (this.orderValue.prop && this.orderValue.order) {
        url += '&sortby=' + this.orderValue.prop + '&order=' + this.orderValue.order
      }
      this.loading = true
      this.getRequest(url).then(resp => {
        if (resp) {
          this.duty = resp.obj.data
          this.total = resp.obj.total
          this.loading = false
        }
      })
      this.getRequest('/duty/current').then(resp => {
        if (resp) {
          this.current = resp.obj
        }
      })
    },
    initDutyDetail () {
      this.dutyDetail = {
        id: null,
        name: null,
        beginDate: null,
        endDate: null,
        remark: null
      }
    },
    pageChange (currentPage) {
      this.page = currentPage
      this.initDuty()
    },
    sizeChange (currentSize) {
      this.limit = currentSize
      this.initDuty()
    },
    handleSelectionChange (val) {
      this.selectedDuty = val
      console.log(this.selectedDuty)
    },
    handleSortChange (value) {
      console.log(value.prop, value.order)
      if (value.order !== null) {
        this.orderValue.prop = value.prop
        this.orderValue.order = value.order
      } else {
        this.orderValue = {
          prop: null,
          order: null
        }
      }
      this.initDuty()
    },
    search () {
      this.searchValue.search = true
      this.initDuty()
    },
    reset () {
      this.searchValue = {
        name: null,
        beginDate: null,
        endDate: null,
        search: false
      }
      this.orderValue = {
        prop: 'beginDate',
        order: 'descending'
      }
      this.initDuty()
    },
    handleAdd () {
      this.title = '新增值班表信息'
      this.dialogVisible = true
    },
    handleEdit (index, row) {
      this.title = '修改值班表信息'
      let edit = 0
      if (index === undefined || row === undefined) {
        console.log('表头按钮的修改按钮被点击')
        console.log(this.selectedDuty)
        if (this.selectedDuty.length !== 1) {
          this.$message.error('请只选择一项值班表信息进行查看')
          return null
        }
        edit = 1
      }
      edit === 1 ? Object.assign(this.dutyDetail, this.selectedDuty[0]) : Object.assign(this.dutyDetail, row)
      this.dialogVisible = true
    },
    handleDelete (index, row) {
      if (index && row) {
        console.log('行内按钮的删除按钮被点击')
        this.$confirm('此操作将永久删除值班表【' + row.name + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/duty/' + row.id).then(resp => {
            if (resp) {
              this.initDuty()
            }
          })
        })
      } else {
        console.log('表头按钮的删除按钮被点击')
        if (this.selectedDuty.length > 0) {
          console.log('批量删除数据')
        } else {
          this.$message.error('至少选择一项数据进行删除操作')
        }
      }
    },
    handleActive (index, row) {
      console.log('设置值班表为当前值班表')
      if (this.current) {
        // 当前存在当值值班表
        this.$confirm('当值值班表【' + this.current.name + '】仍在工作, 无法设置该值班表为当值值班表', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        this.putRequest('/duty/' + row.id + '/active').then(resp => {
          if (resp) {
            this.initDuty()
          }
        })
      }
    },
    handleInactive (index, row) {
      console.log('取消当前值班表为当前值班表')
      this.$confirm('此操作将导致用户无法对值班表【' + row.name + '】进行打卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.putRequest('/duty/' + row.id + '/inactive').then(resp => {
          if (resp) {
            this.initDuty()
          }
        })
      })
    },
    send () {
      console.log(this.dutyDetail)
      if (this.dutyDetail.id) {
        console.log('修改值班表信息')
        this.putRequest('/duty/', this.dutyDetail).then(resp => {
          if (resp) {
            this.initDuty()
            this.cancel()
          }
        })
      } else {
        console.log('新增值班表信息')
        this.postRequest('/duty/', this.dutyDetail).then(resp => {
          if (resp) {
            this.initDuty()
            this.cancel()
          }
        })
      }
    },
    cancel () {
      if (this.dialogVisible) {
        this.$refs.dutyForm.resetFields()
      }
      this.initDutyDetail()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .innerBtn {
    padding: 7px;
  }
  .search-input {
    width: 220px;
  }
  .search-item {
    min-width: 290px;
    max-width: 300px;
  }
  .form-picker {
    width: 100%;
  }
</style>
