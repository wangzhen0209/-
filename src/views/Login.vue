<template>
  <div class="login">
    <div class="box">
      <el-image
        style="width: 130px; height: 130px"
        src="http://p3.music.126.net/lqjULlOBxuA6q-hUraovtQ==/109951165699833802.jpg?param=140y140"
      ></el-image>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <i class="el-icon-user person"></i>
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off">
          </el-input>
        </el-form-item>
        <i class="el-icon-lock lock"></i>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "login",
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (
        this.ruleForm.username !== "" &&
        this.ruleForm.username.length > 3 &&
        this.ruleForm.username.length < 6
      ) {
        callback();
      } else {
        callback(new Error("请输入正确的用户名"));
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (
        this.ruleForm.password !== "" &&
        this.ruleForm.password.length >= 3 &&
        this.ruleForm.password.length <= 6
      ) {
        callback();
      } else {
        callback(new Error("请输入正确的密码"));
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("/login", {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
            })
            .then((res) => {
              console.log(res);
              let token = res.data.data.token;
              this.$store.commit("gettoken", token);
              if (res.data.data == null) {
                alert("请重新输入");
              }this.$router.push("/Welcome")
            });
        } else {
          return false;
        }
      });
    },
    ...mapMutations(["gettoken"]),
  },
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
 background-image: url(../img/IMG79.jpg);
 background-size: 100% 100%;
}
.login {
  position: relative;
}
.box {
  width: 450px;
  height: 250px;
  line-height: 250px;
  position: absolute;
  left: 50%;
  top: 85%;
  transform: translate(-50%, 85%);
  position: relative;
}
.el-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  left: 165px;
  top: -75px;
}
.el-form {
  padding: 0 20px;
  padding-top: 68px !important;
  position: relative;
}
.el-form-item__content {
  width: 100%;
  margin-left: 0 !important;
}
.person {
  position: absolute;
  left: 25px;
  top: 80px;
  z-index: 999;
}
.lock {
  position: absolute;
  left: 25px;
  top: 145px;
  z-index: 999;
}
.el-input__inner {
  text-indent: 1em;
}
.el-button--primary {
  margin-left: 340px;
}
</style>