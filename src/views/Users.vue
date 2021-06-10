<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-input
        placeholder="请输入内容"
        v-model="searchText"
        class="input-with-select"
        style="width: 400px; margin-left: 20px; margin-top: 20px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="dialogFormVisible = true"
        >添加用户</el-button
      >
      <el-table
        :data="tableData"
        border
        style="width: 95%; margin-left: 20px; margin-top: 20px"
      >
        <el-table-column prop="uid" label="#" width="180"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="swite">
            <el-switch
              v-model="swite.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="xg(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="del(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              circle
              @click="js(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加模态框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="pass">
          <el-input v-model="form.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改模态框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible1">
      <el-form :model="forms" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="forms.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="forms.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="forms.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="qrxg">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible2">
      <el-form :model="formss" :rules="rules">
        <p>当前的角色:{{ formss.username }}</p>
        <p>当前的角色:{{ formss.role_name }}</p>
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
  name: "users",
  data() {
    return {
      currentPage: 1,
      searchText: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: 0,
      gridData: [],
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" },
        ],
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      form: {
        name: "",
        pass: "",
        email: "",
        phone: "",
      },
      forms: {
        name: "",
        pass: "",
        email: "",
        phone: "",
      },
      formss: {
        username: "",
        role_name: "",
      },
      formLabelWidth: "120px",
      alTada: [],
    };
  },
  created() {
    this.show();
  },
  watch: {
    total() {
      this.$http
        .get("/users", {
          params: {
            pagenum: this.pagenum,
            pagesize: this.total,
          },
        })
        .then((res) => {
          console.log(res);
          this.alTada = res.data.data.users;
          console.log(this.alTada);
        });
    },
  },
  methods: {
    show() {
      this.$http
        .get("/users", {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          // console.log(res);
          this.total = res.data.data.total;
          res.data.data.users.map((item, index) => {
            Object.assign(item, { uid: index + 1 });
          });
          this.tableData = res.data.data.users;
        });
    },
    // 添加
    add() {
      this.dialogFormVisible = false;
      this.$http
        .post("/users", {
          username: this.form.name,
          password: this.form.pass,
          email: this.form.email,
          mobile: this.form.phone,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status == 201) {
            this.show();
          }
        });
    },
    // 删除
    del(id) {
      this.$http.delete("/users/" + id).then((res) => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.show();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
        }
      });
    },
    xg(id) {
      localStorage.setItem("id", id);
      this.dialogFormVisible1 = true;
      this.$http.get("/users/" + id).then((res) => {
        this.forms.name = res.data.data.username;
        this.forms.email = res.data.data.email;
        this.forms.phone = res.data.data.mobile;
      });
    },
    qrxg() {
      this.dialogFormVisible1 = false;
      let id = localStorage.getItem("id");
      this.$http
        .put("/users/" + id, {
          email: this.forms.email,
          mobile: this.forms.phone,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status == 200) {
            this.show();
          }
        });
    },
    js(id) {
      // console.log(id);
      this.dialogFormVisible2 = true;
      let obj = this.tableData.find((item) => {
        return item.id == id;
      });
      this.formss.username = obj.username;
      this.formss.role_name = obj.role_name;
      this.$http.put("/users/" + id + "/region").then((res) => {
        // console.log(res);
      });
      // console.log(obj);
    },
    search() {
      this.tableData = this.alTada.filter((item) => {
        return item.username === this.searchText;
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