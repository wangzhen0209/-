<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-input
        placeholder="请输入内容"
        v-model="searchText"
        class="input-with-select"
        style="width: 400px; margin-left: 20px; margin-top: 20px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="$router.push('/add')"
        >添加商品</el-button
      >
      <el-table
        :data="tableData"
        border
        style="width: 95%; margin-left: 20px; margin-top: 20px"
      >
        <el-table-column prop="gid" label="#" width="180"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="150">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="0"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "goods",
  data() {
    return {
      searchText: "",
      tableData: [],
      formLabelWidth: "120px",
      currentPage: 1,
      pagenum: 1,
      pagesize: 2,
      total: 0,
    };
  },
  created() {
    this.show();
  },
  methods: {
    show() {
      this.$http
        .get("/goods", {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })  
        .then((res) => {
         this.total=res.data.total
          this.tableData=res.data.data.goods
          res.data.data.goods.map((item, index) => {
            Object.assign(item, { gid: index + 1 });
          });
          console.log(res);
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.show();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.show();
    },
  },
};
</script>

<style>
.content {
  width: 100%;
  height: 100%;
  background: white;
  margin-top: 20px;
}
</style>