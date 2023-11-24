<template>
  <div>
    <nav>
      <button
        @click="switchTab('posts')"
        :class="{ active: activeTab === 'posts' }"
      >
        Посты
      </button>
      <button
        @click="switchTab('users')"
        :class="{ active: activeTab === 'users' }"
      >
        Пользователи
      </button>
    </nav>
    <button v-if="selectedUserId" @click="clearFilter" class="reset-filter-btn">
      Сбросить фильтр X
    </button>
    <component
      :is="activeTabComponent"
      :selectedUser="selectedUserId"
      @switch-to-posts="switchToPosts"
    />
  </div>
</template>

<script>
import Posts from "./components/Posts.vue";
import Users from "./components/Users.vue";

export default {
  components: {
    Posts,
    Users,
  },
  data() {
    return {
      activeTab: "posts",
      selectedUserId: null,
    };
  },
  computed: {
    activeTabComponent() {
      return this.activeTab === "posts" ? "Posts" : "Users";
    },
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    switchToPosts(user) {
      this.selectedUserId = user.id;

      this.switchTab("posts");
    },
    clearFilter() {
      this.selectedUserId = null;
      this.$store.commit("setAllPostsLoaded", false);
    },
  },
};
</script>

<style scoped lang="scss">
$accent-color: #e74c3c;

nav {
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
}

button.active {
  outline: 4px auto -webkit-focus-ring-color;
}

.reset-filter-btn {
  background-color: $accent-color;
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}
</style>
