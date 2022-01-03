<template>
  <div class="post-list">

    <div
      class="post"
      v-for="post in posts"
      :key="post.id"
    >

      <div v-if="userById(post.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <app-avatar-img class="avatar-large" :src="userById(post.userId).avatar" alt="" />
        </a>

        <p class="desktop-only text-small">{{userById(post.userId).postsCount}} posts</p>
        <p class="desktop-only text-small">{{userById(post.userId).threadsCount}} threads</p>

      </div>

      <div class="post-content">
        <div>
          <post-editor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
          />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
        <a
          href="#" style="margin-left: auto"
          class="link-unstyled" title="Make a Change"
          @click.prevent="toggleEditMode(post.id)"
          v-if="post.userId === $store.state.auth.authId"
        >
          <fa icon="pencil-alt" />
        </a>
      </div>
      <div class="post-date text-faded">
        <div class="edition-info" v-if="post.edited?.at">edited</div>
        <app-date
          :timestamp="post.publishedAt"
        />
      </div>

    </div>
  </div>
</template>

<script>
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate'
import { mapActions } from 'vuex'
import AppAvatarImg from '@/components/AppAvatarImg'
export default {
  name: 'PostList',
  components: {
    AppAvatarImg,
    PostEditor,
    AppDate
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      editing: null
    }
  },
  computed: {
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    ...mapActions('posts', ['updatePost']),
    userById (userId) {
      return this.$store.getters['users/user'](userId)
    },
    toggleEditMode (id) {
      this.editing = id === this.editing ? null : id
    },
    handleUpdate (event) {
      this.updatePost(event.post)
      this.editing = null
    }
  }
}
</script>

<style scoped>

</style>
