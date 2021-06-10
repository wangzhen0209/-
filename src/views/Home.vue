<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="left">
          <el-image
            style="width: 50px; height: 50px"
            src="http://p3.music.126.net/lqjULlOBxuA6q-hUraovtQ==/109951165699833802.jpg?param=140y140"
          ></el-image>
          <p style="margin-left: 20px; font-size: 22px; color: white">
            电商后台管理系统
          </p>
        </div>
        <div>
          <el-button type="info" style="margin-top: 10px" @click="open"
            >退出</el-button
          >
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" style="margin-left:-30px">
          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                :unique-opened="true"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                router
              >
                <el-submenu
                  v-for="item in menulist"
                  :key="item.id"
                  :index="String(item.id)"
                >
                  <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.authName }}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item
                    style="margin-left:20px"
                      v-for="ele in item.children"
                      :key="ele.id"
                      :index="ele.path"
                      ><i class="el-icon-menu"></i>{{ ele.authName }}</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view></router-view>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menulist: [],
    };
  },
  created() {
    this.$http.get("/menus").then((res) => {
      // console.log(res);
      let icons = [
        { icon: "el-icon-user-solid" },
        { icon: "el-icon-box" },
        { icon: "el-icon-shopping-bag-2" },
        { icon: "el-icon-s-order" },
        { icon: "el-icon-s-marketing" },
      ];
      res.data.data.map((item, index) => {
        icons.map((ele, index1) => {
          if (index == index1) {
            Object.assign(item, ele);
          }
        });
      });
      this.menulist = res.data.data;
    });
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    open() {
      this.$confirm("此操作将退出, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #535455;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 60px;
}

.left {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.el-image {
  width: 50px;
  height: 50px;
  margin-top: 5px;
  border-radius: 50%;
}
.el-aside {
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: center;
  line-height: 500px;
}
.el-menu {
  border-right: 2px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>

