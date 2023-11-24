<template>
  <div>
    <h2 class="main-heading">Пользователи</h2>
    <ul class="user-list">
      <li v-for="user in users" :key="user.id" class="user-item">
        {{ user.name }}
        <button @click="switchToPosts(user)" class="switch-to-posts-btn">
          Переключить на посты
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    users() {
      return this.$store.state.users;
    },
  },
  methods: {
    switchToPosts(user) {
      if (user.id !== this.$store.state.selectedUserId) {
        this.$emit("switch-to-posts", user);
      }
    },
  },
  mounted() {
    this.$store.dispatch("fetchUsers");
  },
};
</script>
<style scoped lang="scss">
$main-color: #3498db;
$accent-color: #e74c3c;

.main-heading {
  font-size: 24px;
  margin-bottom: 20px;
  color: $main-color;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  color: black;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  button {
    margin-left: 15px;
    background-color: $accent-color;
    color: #fff;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: darken($accent-color, 10%);
    }
  }
}
</style>
