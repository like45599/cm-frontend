<template>
  <div class="forbidden-container">
<!--    <div class="login-background">-->
    <h1>403 - 禁止访问</h1>
    <p>您没有权限访问此页面。</p>
    <img src="@/assets/login-background.png" alt="403 Forbidden" class="forbidden-image">
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'ForbiddenPage',
  methods: {
    goHome() {
      this.$router.push({name: 'Home'});
    }
  }
};
</script>

<style scoped>
.forbidden-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
}

.forbidden-image {
  max-width: 700px;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 10px;
  font-size: 2em;
}

p {
  margin-bottom: 20px;
  color: #888;
}

.login-background {
  background-image: url("@/assets/login-background.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
