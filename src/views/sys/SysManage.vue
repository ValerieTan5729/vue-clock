<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="菜单管理" name="menu"><Menu/></el-tab-pane>
      <el-tab-pane label="角色管理" name="role"><Role/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Menu from '../../components/Menu'
import Role from '../../components/Role'
export default {
  name: 'SysManage',
  data () {
    return {
      activeName: 'menu'
    }
  },
  components: { Role, Menu }
}
</script>

<style scoped>

</style>
