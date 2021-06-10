<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        effect="dark"
        show-icon
        style="width: 80%; margin-top: 20px; margin-left: 20px"
      >
      </el-alert>
      <div style="margin-left: 20px; margin-top: 15px">
        <span>选择商品分类:</span>
        <el-cascader
          v-model="value"
          :options="options"
          @change="handleChange"
          :props="{ value: 'cat_id', label: 'cat_name' }"
        ></el-cascader>
      </div>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
        style="margin-top: 20px; margin-left: 20px"
      >
        <!-- 动态 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button
            type="primary"
            size="mini"
            @click="dialogFormVisible = true"
            >添加参数</el-button
          >
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template> </template>
            </el-table-column>
            <el-table-column label="#">
              <template slot-scope="sope">
                {{ sope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="attr_id">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="xg(scope.row.cat_id, scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="del(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button
            type="primary"
            size="mini"
            @click="dialogFormVisible1 = true"
            >添加属性</el-button
          >
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template> </template>
            </el-table-column>
            <el-table-column label="#">
              <template slot-scope="sope">
                {{ sope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="attr_id">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="bj(scope.row.cat_id, scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="del(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 增加动态 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="动态参数" :label-width="formLabelWidth">
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加静态 -->
    <el-dialog title="添加静态属性" :visible.sync="dialogFormVisible1">
      <el-form :model="form">
        <el-form-item label="静态属性" :label-width="formLabelWidth">
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="adds">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改动态 -->
    <el-dialog title="修改动态参数" :visible.sync="dialogFormVisible2">
      <el-form :model="formss">
        <el-form-item label="动态参数" :label-width="formLabelWidth">
          <el-input v-model="formss.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="qrxg">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改静态 -->
    <el-dialog title="修改静态属性" :visible.sync="dialogFormVisible3">
      <el-form :model="forms">
        <el-form-item label="静态属性" :label-width="formLabelWidth">
          <el-input v-model="forms.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="qrxgs">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      value: "",
      options: [],
      tableData: [],
      id: "",
      sel: "many",
      activeName: "first",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      form: {
        attr_name: "",
      },
      // 静态模态框数据
      forms: {
        attr_name: "",
      },
      // 动态模态框数据
      formss: {
        attr_name: "",
      },
      formLabelWidth: "120px",
    };
  },
  created() {
    this.show();
  },
  methods: {
    show() {
      this.$http.get("/categories").then((res) => {
        console.log(res);
        this.options = res.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      this.id = value[2];
      this.getlist();
    },
    getlist() {
      this.$http
        .get("/categories/" + this.id + "/attributes?sel=" + this.sel)
        .then((res) => {
          console.log(res);
          this.tableData = res.data.data;
        });
    },
    // tab切换
    handleClick(tab) {
      console.log(tab._uid);
      this.sel = tab._uid == 45 ? "only" : "many";
      this.getlist();
    },
    // 增加动态数据
    add() {
      this.dialogFormVisible = false;
      this.$http
        .post("/categories/" + this.id + "/attributes", {
          attr_name: this.form.attr_name,
          attr_sel: "many",
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 201) {
            this.getlist();
          }
        });
    },
    // 增加静态属性
    adds() {
      this.dialogFormVisible1 = false;
      this.$http
        .post("/categories/" + this.id + "/attributes", {
          attr_name: this.form.attr_name,
          attr_sel: "only",
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 201) {
            this.getlist();
          }
        });
    },
    // 删除
    del(id, rid) {
      console.log(id, rid);
      this.$http
        .delete("/categories/" + id + "/attributes/" + rid + "")
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.getlist();
          }
        });
    },
    // 修改反显
    xg(id, rid) {
      console.log(id, rid);
      localStorage.setItem("id", id);
      localStorage.setItem("rid", rid);
      this.dialogFormVisible2 = true;
      this.$http
        .get("categories/" + id + "/attributes/" + rid + "", {
          params: {
            attr_sel: this.sel,
          },
        })
        .then((res) => {
          console.log(res);
          this.formss.attr_name = res.data.data.attr_name;
        });
    },
    bj(id, rid) {
      console.log(id, rid);
      localStorage.setItem("id", id);
      localStorage.setItem("rid", rid);
      this.dialogFormVisible3 = true;
      this.$http
        .get("categories/" + id + "/attributes/" + rid + "", {
          params: {
            attr_sel: this.sel,
          },
        })
        .then((res) => {
          console.log(res);
          this.forms.attr_name = res.data.data.attr_name;
        });
    },
    // 修改动态参数
    qrxg() {
      this.dialogFormVisible2 = false;
      let id = localStorage.getItem("id");
      let rid = localStorage.getItem("rid");
      this.$http
        .put("categories/" + id + "/attributes/" + rid + "", {
          attr_name: this.formss.attr_name,
          attr_sel: "many",
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.getlist();
          }
        });
      // localStorage.removeItem("id")
      // localStorage.removeItem("rid")
    },
    // 修改静态属性
    qrxgs() {
      this.dialogFormVisible3 = false;
      let id = localStorage.getItem("id");
      let rid = localStorage.getItem("rid");
      this.$http
        .put("categories/" + id + "/attributes/" + rid + "", {
          attr_name: this.forms.attr_name,
          attr_sel: "only",
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.getlist();
          }
        });
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
  overflow: hidden;
}
</style>