<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="department">
        <Department/></el-tab-pane>
<!--      <el-tab-pane label="角色管理" name="role"><Role></Role></el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import Department from '../../components/Department'
export default {
  name: 'SysBasic',
  data () {
    return {
      activeName: 'department'
    }
  },
  components: { Department }
}
</script>

<style scoped>

</style>
