<template>
  <div>
    <h2 class="main-heading">Посты</h2>
    <h3 v-if="selectedUser?.name" class="user-posts-heading">
      Посты пользователя: {{ selectedUser?.name }}
    </h3>

    <ul class="post-list">
      <li v-for="post in visiblePosts" :key="post.id" class="post-item">
        <h3 class="post-title">{{ post.title }}</h3>
        <p class="post-body">{{ post.body }}</p>
        <p v-if="getUser(post.userId)" class="post-user">
          Пользователь: {{ getUser(post.userId).name }}
        </p>
        <ul class="comment-list">
          <li
            v-for="comment in getComments(post.id)"
            :key="comment.id"
            class="comment-item"
          >
            <p class="comment-text">{{ comment.body }}</p>
          </li>
        </ul>
        <textarea
          v-model="postComments[post.id]"
          :placeholder="'Добавить комментарий к посту ' + post.id"
          class="comment-textarea"
        ></textarea>
        <button @click="addComment(post.id)" class="add-comment-btn">
          Добавить комментарий
        </button>
      </li>
    </ul>
    <div v-if="loading" class="loading-indicator">Загрузка...</div>
    <div v-if="allPostsLoaded" class="all-posts-loaded">
      Все посты загружены
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedUser: { type: Number, default: null },
  },

  data() {
    return {
      page: 1,
      pageSize: 20,
      loading: false,
    };
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
    postComments() {
      return this.$store.state.postComments;
    },
    visiblePosts() {
      return this.selectedUser
        ? this.posts
            .filter((post) => post.userId == this.selectedUser)
            .slice(0, this.page * this.pageSize)
        : this.posts.slice(0, this.page * this.pageSize);
    },
    allPostsLoaded() {
      return this.$store.state.allPostsLoaded;
    },
  },
  methods: {
    getUser(userId) {
      return this.$store.state.users.find((user) => user.id === userId);
    },
    getComments(postId) {
      return this.$store.state.comments.filter(
        (comment) => comment.postId === postId
      );
    },
    addComment(postId) {
      if (
        this.postComments[postId] != null &&
        this.postComments[postId] != ""
      ) {
        const newComment = {
          postId,
          body: this.postComments[postId],
        };
        this.$store.dispatch("addComment", newComment);
        this.$store.dispatch("savePostComment", { postId, comment: "" });
      }
    },
    handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight &&
        !this.loading &&
        !this.allPostsLoaded
      ) {
        this.page++;
        this.loadMorePosts();
      }
    },
    async loadMorePosts() {
      this.loading = false;
      let countPages;
      if (!this.selectedUser) {
        countPages = Math.ceil(this.posts.length / 20);
      } else {
        countPages = Math.ceil(this.visiblePosts.length / 20);
      }

      if (countPages !== 1) {
        if (countPages > this.page) {
          this.loading = false;
        } else {
          this.$store.commit("setAllPostsLoaded", true);
        }
      } else {
        this.loading = false;
        this.$store.commit("setAllPostsLoaded", true);
        this.page = 1;
      }
    },
  },
  mounted() {
    this.$store.dispatch("fetchPosts");
    this.$store.dispatch("fetchComments");
    this.$store.dispatch("fetchUsers");

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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

.user-posts-heading {
  font-size: 18px;
  margin-bottom: 10px;
}

.reset-filter-btn {
  background-color: $accent-color;
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.post-list {
  list-style: none;
  padding: 0;
}

.post-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 40px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}

.post-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: $main-color;
}

.post-body {
  margin-bottom: 15px;
}

.post-user {
  font-style: italic;
  color: #555;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.comment-item {
  border-top: 1px solid #ccc;
  padding: 10px 0;
}

.comment-text {
  font-size: 14px;
  color: #444;
}

.comment-textarea {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-comment-btn {
  background-color: $main-color;
  color: #fff;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: darken($main-color, 10%);
  }
}

.loading-indicator,
.all-posts-loaded {
  margin-top: 20px;
  font-style: italic;
  color: #888;
  text-align: center;
}
</style>
