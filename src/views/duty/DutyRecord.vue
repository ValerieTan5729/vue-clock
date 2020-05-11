<template>
  <div>
    <!-- 查询表格 -->
    <div>
      <el-divider content-position="left" style="font-size: 20px; min-width: 900px">查询条件</el-divider>
      <el-form :model="searchValue" ref="searchForm" label-position="right" label-width="80px" style="width: 90%" :inline="true">
        <el-row>
          <el-form-item label="用户名称" prop="name">
            <!-- 懒加载下拉框, 可远程搜索选项 -->
            <LazySelect :url="'/user/'" :label="'name'" v-model="searchValue.userId" class="formInput"/>
          </el-form-item>
          <el-form-item label="总值名称" prop="dutyId">
            <LazySelect :url="'/duty/'" :label="'name'" v-model="searchValue.dutyId" class="formInput"/>
          </el-form-item>
          <el-form-item label="值班地点" prop="place">
            <!-- 暂无确定值班地点存什么, 所以暂定 -->
            <el-select v-model="searchValue.place" disabled class="formInput">
              <option value="1">值班地点一</option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开始时间" prop="beginDate">
            <el-date-picker
              v-model="searchValue.beginDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
              class="formInput">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              v-model="searchValue.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
              class="formInput">
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
    <!-- 值班记录信息 -->
    <div>
      <el-table
        :data="record"
        ref="recordTable"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :default-sort="orderValue"
        @sort-change="handleSortChange"
        @cell-click="handleCellClick">
        <el-table-column type="expand">
          <template slot-scope="props">
            <span>{{ props.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名称"
          min-width="125"
          align="center"/>
        <el-table-column
          prop="dutyName"
          label="总值名称"
          min-width="125"
          align="center"/>
        <el-table-column
          prop="date"
          label="打卡时间"
          sortable
          width="150"
          align="center"/>
        <el-table-column
          prop="place"
          label="值班地点"
          min-width="150"
          align="center"/>
        <el-table-column prop="imgPath" label="打卡图片" align="center" width="80px" padding="0px"
                         :show-overflow-tooltip = "true">
          <template slot-scope="scope" v-if="scope.row.imgPath != null">
            <el-popover trigger="hover" v-if="scope.row.imgPath != null">
              <img :src="imgPath + scope.row.imgPath"  style="height: 500px;width: 500px"/>
              <el-button
                class="innerBtn"
                size="mini"
                type="info"
                icon="el-icon-picture-outline"
                slot="reference"
                :alt="imgPath + scope.row.id">
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              class="innerBtn"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="() => handleEdit(scope.$index, scope.row)">
            </el-button>
            <el-button
              class="innerBtn"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="() => handleDelete(scope.$index, scope.row)">
            </el-button>
          </template>
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
  </div>
</template>

<script>
import LazySelect from '../../components/LazySelect'
export default {
  components: { LazySelect },
  name: 'DutyRecord',
  data () {
    return {
      record: [],
      total: 0,
      page: 1,
      limit: 10,
      orderValue: {
        prop: 'date',
        order: 'descending'
      },
      searchValue: {
        userId: null,
        dutyId: null,
        beginDate: null,
        endDate: null,
        place: null,
        search: false
      },
      loading: false,
      imgPath: '/mini/record/img/?path=',
      dutyPath: '/duty/?',
      userPath: '/user/?'
    }
  },
  mounted () {
    this.initRecord()
  },
  methods: {
    initRecord () {
      // 初始化打卡记录
      let url = '/record/?page=' + this.page + '&limit=' + this.limit
      if (this.searchValue.search) {
        if (this.searchValue.userId) {
          url += '&userId=' + this.searchValue.userId
        }
        if (this.searchValue.dutyId) {
          url += '&dutyId=' + this.searchValue.dutyId
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
        if (this.searchValue.place) {
          url += '&place=' + this.searchValue.place
        }
      }
      if (this.orderValue.prop && this.orderValue.order) {
        url += '&sortby=' + this.orderValue.prop + '&order=' + this.orderValue.order
      }
      this.loading = true
      this.getRequest(url).then(resp => {
        if (resp) {
          this.record = resp.obj.data
          this.total = resp.obj.total
          console.log(this.record)
          this.loading = false
        }
      })
    },
    pageChange (currentPage) {
      this.page = currentPage
      this.initRecord()
    },
    sizeChange (currentSize) {
      this.limit = currentSize
      this.initRecord()
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
      this.initRecord()
    },
    handleEdit (index, row) {
      console.log('handle edit')
      this.$message.info('未确定打卡记录是否能在后台进行修改操作')
    },
    handleDelete (index, row) {
      console.log('handle delete')
      this.$message.info('未确定打卡记录是否能在后台进行删除操作')
    },
    handleCellClick (row, column, cell, event) {
      // 行单击可展示打卡记录的备注内容
      if (column.property) {
        this.$refs.recordTable.toggleRowExpansion(row)
      }
    },
    search () {
      this.searchValue.search = true
      this.initRecord()
    },
    reset () {
      this.searchValue = {
        userId: null,
        dutyId: null,
        beginDate: null,
        endDate: null,
        place: null,
        search: false
      }
      this.initRecord()
    }
  }
}
</script>

<style scoped>
  .innerBtn {
    padding: 7px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .formInput {
    width: 200px;
  }
  /*.el-form-item {*/
  /*  min-width: 290px;*/
  /*  max-width: 300px;*/
  /*}*/
</style>
