import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    posts: [],
    comments: [],
    users: [],
    postComments: {},
    allPostsLoaded: false,
  },
  mutations: {
    setAllPostsLoaded(state, bool) {
      state.allPostsLoaded = bool;
    },
    setPostComment(state, { postId, comment }) {
      state.postComments[postId] = comment;
    },
    setPosts(state, posts) {
      state.posts = posts;
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    setUsers(state, users) {
      state.users = users;
    },
    addComment(state, comment) {
      state.comments.push(comment);
    },
    addPosts(state, newPosts) {
      state.posts = [...state.posts, ...newPosts];
    },
  },
  actions: {
    savePostComment({ commit }, { postId, comment }) {
      commit("setPostComment", { postId, comment });
    },
    async fetchPostsByUser({ commit }, userId) {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      commit("setPosts", response.data);
    },
    async fetchPosts({ commit }) {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      commit("setPosts", response.data);
    },
    async fetchComments({ commit, state }) {
      if (state.comments.length === 0) {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/comments"
        );
        const serverComments = response.data;

        const allComments = [
          ...new Set([...serverComments, ...state.comments]),
        ];

        commit("setComments", allComments);
      }
    },
    async fetchUsers({ commit }) {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      commit("setUsers", response.data);
    },
    addComment({ commit }, comment) {
      commit("addComment", comment);
    },
  },
});
