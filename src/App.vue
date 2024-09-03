<template>
  <div id="app">
    <!-- 检查当前路由是否需要全局布局 -->
    <router-view v-slot="{ Component }">
      <template v-if="$route.meta.layout !== false">
        <Layout>
          <component :is="Component" />
        </Layout>
      </template>
      <template v-else>
        <component :is="Component" />
      </template>
    </router-view>
  </div>
</template>

<script>
import Layout from '@/components/Layout.vue'; // 全局布局组件

export default {
  components: {
    Layout,
  },
};
</script>
