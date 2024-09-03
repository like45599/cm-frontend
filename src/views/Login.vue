<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-form">
        <el-card shadow="always">
          <img src="@/assets/head.jpg" alt="logo" class="logo">
          <h2>六哥の班级管理系统</h2>
          <p>史上最好用的班级管理系统平台</p>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="登录" name="login">
              <el-form @submit.prevent="handleSubmit">
                <el-form-item>
                  <el-input
                      v-model="form.userAccount"
                      placeholder="请输入用户名"
                      prefix-icon="el-icon-user"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                      v-model="form.userPassword"
                      placeholder="请输入密码"
                      show-password
                      prefix-icon="el-icon-lock"
                  ></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSubmit">登录</el-button>
                <div class="login-extra">
                  <el-checkbox v-model="form.autoLogin">自动登录</el-checkbox>
                  <a @click="forgotPassword" class="forgot-password">忘记密码?</a>
                </div>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="注册" name="register">
              <el-form @submit.prevent="handleRegister">
                <el-form-item>
                  <el-input
                      v-model="form.userAccount"
                      placeholder="请输入用户名"
                      prefix-icon="el-icon-user"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                      v-model="form.studentNum"
                      placeholder="请输入学号"
                      prefix-icon="el-icon-idcard"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                      v-model="form.userPassword"
                      placeholder="请输入密码"
                      show-password
                      prefix-icon="el-icon-lock"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                      v-model="form.checkPassword"
                      placeholder="请再次输入密码"
                      show-password
                      prefix-icon="el-icon-lock"
                  ></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleRegister">注册</el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin, userRegister } from "@/api/user.js";

export default {
  name: "LoginPage",
  data() {
    return {
      form: {
        userAccount: "",
        userPassword: "",
        checkPassword: "",
        studentNum: "",
        autoLogin: false,
      },
      activeTab: "login",
    };
  },
  methods: {
    async handleSubmit() {
      const { userAccount, userPassword } = this.form;

      try {
        const response = await userLogin({ userAccount, userPassword });
        if (response && response.data && response.data.code === 0) {
          this.$message.success("登录成功！");

          const userData = response.data.data;
          localStorage.setItem("userAccount", userData.userAccount);
          localStorage.setItem("userRole", userData.userRole);
          localStorage.setItem("studentNum", userData.studentNum);
          localStorage.setItem("userId", userData.id);

          // 触发路由守卫重新检查角色权限
          this.$router.replace({ name: 'Home' }).then(() => {
            this.$router.go(0); // 强制刷新页面，重新检查权限
          });
        } else {
          this.$message.error(response.data.message || "登录失败！");
        }
      } catch (error) {
        this.$message.error("登录时出错，请重试！");
      }
    },
    async handleRegister() {
      const { userAccount, userPassword, checkPassword, studentNum } = this.form;

      if (userPassword !== checkPassword) {
        this.$message.error("两次输入密码不一致！");
        return;
      }

      try {
        const response = await userRegister({
          userAccount,
          userPassword,
          checkPassword,
          studentNum,
        });

        if (response && response.data && response.data.code === 0) {
          this.$message.success("注册成功！");
          this.activeTab = "login";
        } else {
          this.$message.error(response.data.message || "注册失败！");
        }
      } catch (error) {
        this.$message.error("注册时出错，请重试！");
      }
    },
    forgotPassword() {
      this.$message.info("忘记密码功能尚未实现。");
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
}

.login-background {
  background-image: url("@/assets/background.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  align-items: center;
}

.login-form {
  width: 400px;
  //background-color: white;
  padding: 20px;
  border-radius: 10px;
  //box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-right: 3%;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h2 {
  text-align: center;
  margin-bottom: 10px;
}

p {
  text-align: center;
  margin-bottom: 30px;
  color: #888;
}

.el-tabs__nav {
  justify-content: center;
}

.login-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.forgot-password {
  color: #409EFF;
  cursor: pointer;
}
</style>