<template>
  <!-- 懒加载下拉框, 可远程搜索选项 -->
  <el-select
    v-model="selected"
    filterable
    remote
    reserve-keyword
    :remote-method="remoteMethod"
    v-el-select-loadmore="load" @change="onChange">
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      lazy>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'LazySelect',
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    id: Number, // 选择option的ID
    url: String, // 访问后台数据的url前缀
    label: String // 根据那个属性对数据进行过滤查询
  },
  data () {
    return {
      data: [],
      total: null,
      page: 1,
      search: null,
      selected: null
    }
  },
  watch: {
    id (value) {
      this.selected = value
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      let requestUrl = this.url + '?page=' + this.page + '&limit=20'
      if (this.search !== null) {
        requestUrl += '&' + this.label + '=' + this.search
      }
      console.log('requestUrl is ', requestUrl)
      this.getRequest(requestUrl).then(resp => {
        if (resp) {
          console.log('resp is ', resp.obj)
          this.data = this.data.concat(resp.obj.data)
          this.total = resp.obj.total
          this.page += 1
        }
      })
    },
    remoteMethod (query) {
      console.log('remote method query : ' + query)
      if (query !== '' || query !== ' ') {
        this.search = query
      } else {
        this.search = null
      }
      this.reload()
    },
    load () {
      if (this.data.length < this.total) {
        console.log('select lazy loading...')
        this.initData()
      }
    },
    // 选中时候
    onChange (value) {
      this.$emit('change', value)
    },
    reload () {
      this.data = []
      this.total = null
      this.selected = null
      this.page = 1
      this.initData()
    }
  }
}
</script>

<style scoped>

</style>
