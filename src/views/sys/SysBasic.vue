<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="department"><Department/></el-tab-pane>
      <el-tab-pane label="数据字典" name="dictionary"><Dictionary/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Department from '../../components/Department'
import Dictionary from '../../components/Dictionary'
export default {
  name: 'SysBasic',
  data () {
    return {
      activeName: 'department'
    }
  },
  components: { Dictionary, Department }
}
</script>

<style scoped>

</style>
