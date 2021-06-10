<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-table :data="tableData" border style="width: 95%">
        <el-table-column prop="rid" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="soped">
             <el-tag v-show="soped.row.level==0">{{soped.row.level==0?"一级":null}}</el-tag>
          <el-tag type="success" v-show="soped.row.level==1">{{soped.row.level==1?"二级":null}}</el-tag>

          <el-tag type="warning"  v-show="soped.row.level==2">{{soped.row.level==2?"三级":null}}</el-tag>
          </template>
         
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.$http.get("/rights/list").then((res) => {
      console.log(res);
      res.data.data.map((item, index) => {
        Object.assign(item, { rid: index + 1 });
      });
      this.tableData = res.data.data;
    });
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: white;
  margin-top: 20px;
}
</style>