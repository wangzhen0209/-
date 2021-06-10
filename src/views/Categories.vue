<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加分类</el-button
      >
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="sid" label="#" width="180"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column prop="address" label="是否有效">
          <span class="el-icon-success" style="color: green"></span>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="paixu">
            <el-tag effect="dark" v-show="paixu.row.cat_level == 0">
              {{ paixu.row.cat_level == 0 ? "一级" : null }}
            </el-tag>
            <el-tag
              type="success"
              effect="dark"
              v-show="paixu.row.cat_level == 1"
            >
              {{ paixu.row.cat_level == 1 ? "二级" : null }}
            </el-tag>
            <el-tag
              type="warning"
              effect="dark"
              v-show="paixu.row.cat_level == 2"
            >
              {{ paixu.row.cat_level == 2 ? "三级" : null }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="xg(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="del(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="this.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </div>
    <!-- 添加 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-cascader
            style="width: 200px"
            :options="options"
            :props="{ checkStrictly: true, value: 'cat_id', label: 'cat_name' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改分类" :visible.sync="dialogFormVisible1">
      <el-form :model="forms" :rules="rules">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="forms.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="qrxg">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "categories",
  data() {
    return {
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      form: {
        cat_name: "",
      },
      forms: {
        cat_name: "",
      },
      formLabelWidth: "120px",
      rules: {
        cat_name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
      },
      tableData: [],
      currentPage: 1,
      list: [],
      options: [],
      value: "",
      three: [],
    };
  },
  created() {
    this.show();
  },
  watch: {
    total() {
      this.$http
        .get("/categories", {
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.total,
          },
        })
        .then((res) => {
          this.list = res.data.data.result;
        });
    },
  },
  methods: {
    show() {
      this.$http
        .get("/categories", {
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          res.data.data.result.map((item, index) => {
            Object.assign(item, { sid: index + 1 });
          });
          this.total = res.data.data.total;
          this.tableData = res.data.data.result;
          this.options = res.data.data.result;
        });
    },
    // 添加
    add() {
      let pid =
        this.three.length == 0
          ? 0
          : this.three.length == 1
          ? this.three[0]
          : this.three[1];
      this.dialogFormVisible = false;
      this.$http
        .post("/categories", {
          cat_pid: pid,
          cat_name: this.form.cat_name,
          cat_level: this.three.length,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 201) {
            this.show();
          }
        });
    },
    // 修改
    xg(id) {
      localStorage.setItem("cid", id);
      this.dialogFormVisible1 = true;
      this.$http.get("/categories/" + id).then((res) => {
        this.forms.cat_name = res.data.data.cat_name;
      });
    },
    // 确认修改
    qrxg() {
      this.dialogFormVisible1 = false
      let id = localStorage.getItem("cid");
      this.$http
        .put("/categories/" + id, {
          cat_name: this.forms.cat_name,
        })
        .then((res) => {
          if (res.data.meta.status == 200) {
            this.show();
          }
        });
    },
    // 删除
    del(id) {
      console.log(id);
      this.$http.delete("/categories/" + id).then((res) => {
        if (res.data.meta.status == 200) {
          this.show();
        }
      });
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.show();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.show();
    },
    // 选中id
    handleChange(value) {
      console.log(value);
      this.three = value;
    },
  },
};
</script>

<style>
.content {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: white;
  margin-top: 20px;
}
</style>