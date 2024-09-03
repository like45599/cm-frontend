<template>
  <div class="profile-container">
    <el-card>
      <h2>个人信息</h2>
      <el-form :model="form" ref="formRef" label-width="120px">
        <el-form-item label="用户账号">
          <el-input v-model="form.userAccount" disabled />
        </el-form-item>
        <el-form-item label="用户角色">
          <el-input v-model="form.userRole" disabled />
        </el-form-item>
        <el-form-item label="学生信息ID">
          <el-input v-model="form.studentNum" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showChangePasswordDialog">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码的弹框 -->
    <el-dialog title="修改密码" v-model="changePasswordDialogVisible">
      <el-form :model="passwordForm" ref="passwordFormRef" label-width="120px">
        <!-- 当前密码输入框 -->
        <el-form-item v-if="!isPasswordVerified" label="当前密码">
          <el-input v-model="passwordForm.currentPassword" placeholder="请输入当前密码" show-password />
        </el-form-item>
        <!-- 新密码输入框 -->
        <el-form-item v-if="isPasswordVerified" label="新密码">
          <el-input v-model="passwordForm.newPassword" placeholder="请输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
<div  class="dialog-footer">
        <el-button @click="changePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="isPasswordVerified ? updatePassword() : verifyCurrentPassword()">
          {{ isPasswordVerified ? '确认修改' : '验证当前密码' }}
        </el-button>
      </div>
</template>
    </el-dialog>
  </div>
</template>

<script>
import {getLoginUser, updateUser, userLogin} from "@/api/user.js";

export default {
  name: "ProfilePage",
  data() {
    return {
      form: {
        userAccount: "",
        userRole: "",
        studentNum: "",
      },
      passwordForm: {
        currentPassword: "",
        newPassword: "",
      },
      changePasswordDialogVisible: false,
      isPasswordVerified: false,
    };
  },
  async mounted() {
    await this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        const response = await getLoginUser();
        if (response && response.data && response.data.code === 0) {
          const userData = response.data.data;
          this.form.userAccount = userData.userAccount;
          this.form.userRole = userData.userRole;
          this.form.studentNum = userData.studentNum;
        } else {
          this.$message.error(response.data.message || "加载用户信息失败！");
        }
      } catch (error) {
        this.$message.error("加载用户信息时出错！");
        console.error("Error loading user profile:", error);
      }
    },
    showChangePasswordDialog() {
      this.changePasswordDialogVisible = true;
    },
    async verifyCurrentPassword() {
      if (!this.passwordForm.currentPassword) {
        this.$message.error("请填写当前密码！");
        return;
      }

      try {
        // 使用登录 API 验证当前密码
        const response = await userLogin({
          userAccount: this.form.userAccount,
          userPassword: this.passwordForm.currentPassword,
        });

        if (response && response.data && response.data.code === 0) {
          this.$message.success("密码验证成功，请输入新密码！");
          this.isPasswordVerified = true;
        } else {
          this.$message.error(response.data.message || "密码验证失败！");
        }
      } catch (error) {
        this.$message.error("密码验证时出错，请重试！");
        console.error("Error verifying current password:", error);
      }
    },
    async updatePassword() {
      if (!this.passwordForm.newPassword) {
        this.$message.error("请填写新密码！");
        return;
      }

      const userUpdateRequest = {
        userPassword: this.passwordForm.newPassword, // 修改字段名称以匹配后端的期望
      };

      try {
        const response = await updateUser(userUpdateRequest);
        if (response && response.data && response.data.code === 0) {
          this.$message.success("密码修改成功，请重新登录！");
          this.changePasswordDialogVisible = false;
          this.isPasswordVerified = false;
          this.$router.replace({ name: "Login" });
        } else {
          this.$message.error(response.data.message || "密码修改失败！");
        }
      } catch (error) {
        this.$message.error("密码修改时出错，请重试！");
        console.error("Error updating password:", error);
      }
    }
  },
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.el-card {
  max-width: 500px;
  margin: 0 auto;
}
</style>
