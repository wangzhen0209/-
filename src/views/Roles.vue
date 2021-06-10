<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加角色</el-button
      ><el-table :data="tableData" style="width: 95%; margin-top: 20px" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              v-for="item in props.row.children"
              :key="item.id"
              style="border: 1px solid #ededed"
            >
              <!-- 第一层 -->
              <el-col :span="5">
                <el-tag
                  effect="dark"
                  closable
                  @close="sc(props.row.id, item.id)"
                >
                  {{ item.authName }}
                </el-tag>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="item1 in item.children"
                  :key="item1.id"
                  style="border-left: 1px solid #ededed"
                >
                  <!-- 第二层 -->
                  <el-col :span="8">
                    <el-tag
                      effect="dark"
                      type="success"
                      closable
                      @close="sc(props.row.id, item1.id)"
                    >
                      {{ item1.authName }}
                    </el-tag>
                  </el-col>
                  <!-- 第三层 -->
                  <el-col :span="16">
                    <el-tag
                      effect="dark"
                      type="warning"
                      closable
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      style="margin: 7px"
                      @close="sc(props.row.id, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" prop="rolesid" width="50"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="xg(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-star-off"
              @click="js(scope.row.id)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改角色" :visible.sync="dialogFormVisible1">
      <el-form :model="forms" :rules="rules">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="forms.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="forms.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="qr">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible2">
      <el-tree
        :data="Treedata"
        :default-checked-keys="keyAll"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="jsqr">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      tableData: [],
      Treedata: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      value: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      form: {
        roleName: "",
        roleDesc: "",
      },
      forms: {
        roleName: "",
        roleDesc: "",
      },
      formLabelWidth: "120px",
      rules: {
        roleName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
      },
      // 默认选中的key
      keyAll: [],
    };
  },
  created() {
    this.show();
  },
  methods: {
    show() {
      this.$http.get("/roles").then((res) => {
        res.data.data.map((item, index) => {
          Object.assign(item, { rolesid: index + 1 });
        });
        this.tableData = res.data.data;
        this.tableData.map((item) => {
          item.children.map((item1) => {
            item1.children.map((item2) => {
              item2.children.map((item3) => {
                // console.log(item3);
                this.keyAll.push(item3.id);
              });
            });
          });
        });
      });
    },
    // 添加
    add() {
      this.$http
        .post("/roles", {
          roleName: this.form.roleName,
          roleDesc: this.form.roleDesc,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 201) {
            this.show();
          }
        });
      this.dialogFormVisible = false;
    },
    // 删除
    del(id) {
      this.$http.delete("/roles/" + id).then((res) => {
        if (res.data.meta.status == 200) {
          this.show();
        }
      });
    },
    // 修改
    xg(id) {
      this.dialogFormVisible1 = true;
      localStorage.setItem("id", id);
      this.$http.get("/roles/" + id).then((res) => {
        this.forms.roleName = res.data.data.roleName;
        this.forms.roleDesc = res.data.data.roleDesc;
      });
    },
    // 确认修改
    qr() {
      this.dialogFormVisible1 = false;
      let id = localStorage.getItem("id");
      this.$http
        .put("/roles/" + id, {
          roleName: this.forms.roleName,
          roleDesc: this.forms.roleDesc,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.show();
          }
        });
    },
    // 分配角色
    js(rid) {
      this.dialogFormVisible2 = true;
      this.$http.get("/rights/tree").then((res) => {
        this.Treedata = res.data.data;
      });
      localStorage.setItem("roleId", rid);
    },
    // 确认分配
    jsqr() {
      this.dialogFormVisible2 = false;
      let roleId = localStorage.getItem("roleId");

      let arr = this.$refs.tree.getCheckedKeys();
      this.Treedata.map((item1) => {
        item1.children.map((item2) => {
          item2.children.map((item3) => {
            // console.log(item3.pid);
            if (arr.indexOf(item3.id) != -1) {
              let parr = item3.pid.split(",");
              parr.map((fid) => {
                if (arr.indexOf(fid) == -1) {
                  arr.push(fid);
                }
              });
            }
          });
        });
      });
      console.log(arr);
      this.$http
        .post("/roles/" + roleId + "/rights", {
          rids: arr.toString(),
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.show();
          }
        });
    },
    // 删除指定权限
    sc(roleId, rightId) {
      console.log(roleId, rightId);
      this.$http
        .delete("/roles/" + roleId + "/rights/" + rightId + "")
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.show();
          }
        });
    },
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
.el-tag {
  margin-left: 20px;
  margin-top: 5px;
}
</style>