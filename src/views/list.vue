<template>
  <div class="cate">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="show">添加分类</el-button>
      <Tree-table
        :data="cate"
        :columns="col"
        :selection-type="false"
        :show-index="true"
        :expand-type="false"
        :border="true"
      >
        <template slot="aaa" slot-scope="scope">
          {{ scope.row.cat_deleted }}
        </template>
        <template slot="bbb" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" type="primary"> 一级 </el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="warning"> 二级 </el-tag>
          <el-tag v-if="scope.row.cat_level == 2" type="success"> 三级 </el-tag>
        </template>
        <template slot="ccc" >
          <el-button type="warning">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </Tree-table>
    </el-card>
    <!-- 添加分类 对话框 -->

    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input autocomplete="off" v-model="form.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :options="pcate"
            :props="ps"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      type: "",
      pagesize: 100,
      pagenum: 1,
      cate: [],
      pcate: [],
      value: [],
      ps: {
        value: "cat_id",
        children: "children",
        label: "cat_name",
      },
      form: {
        cate_name: "",
      },
      dialogFormVisible: false,
      col: [
        // 第一列
        {
          label: "分类名称",
          prop: "cat_name",
        },
        // 第二列
        {
          label: "是否有效",
          type: "template",
          template: "aaa",
        },
        // 第三列
        {
          label: "排序",
          type: "template",
          template: "bbb",
        },
        // 第四列
        {
          label: "操作",
          type: "template",
          template: "ccc",
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    async addCate() {
      // 确定时 添加分类

      console.log(this.form.cate_name);
      console.log(this.value);

      if (this.value.length == 0) {
        var cat_pid = 0;
        var cat_level = 0;
      } else {
        var cat_pid = this.value[this.value.length - 1]; // 父分类id
        var cat_level = this.value.length; // 分类级别
      }

      var res = await this.http.post("/categories", {
        cat_pid: cat_pid,
        cat_name: this.form.cate_name,
        cat_level: cat_level,
      });

      console.log(res);
      if (res.data.meta.status == 201) {
        this.dialogFormVisible = false;
        this.$message("添加成功");
        this.getCategrories();
      }
    },
    handleChange() {
      console.log(this.value);
    },
    show() {
      this.getParentCategory();
      this.dialogFormVisible = true;
    },
    async getCategrories() {
      // 获取所有分类

      var res = await this.http.get("/categories", {
        params: {
          type: this.type,
          pagesize: this.pagesize,
          pagenum: this.pagenum,
        },
      });

      console.log(res);
      if (res.data.meta.status == 200) {
        this.cate = res.data.data.result;
      } else {
        this.$message("获取分类数据失败");
      }
    },
    async getParentCategory() {
      // 获取父级分类

      var res = await this.http.get("/categories", {
        params: {
          type: 2,
        },
      });

      console.log(res);
      if (res.data.meta.status == 200) {
        this.pcate = res.data.data;
      }
    },
  },
  created() {
    this.getCategrories();
    this.getParentCategory();
  },
  mounted() {},
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
</style>