<template>
  <div>
    <el-tabs v-model="activeName" type="card">
<!--      <el-tab-pane label="部门管理" name="department"><Department></Department></el-tab-pane>-->
      <el-tab-pane label="角色管理" name="role"><Role></Role></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Role from '../../components/Role'
export default {
  name: 'SysBasic',
  data () {
    return {
      activeName: 'role'
    }
  },
  components: { Role }
}
</script>

<style scoped>

</style>
