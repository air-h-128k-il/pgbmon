<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ $t('label.pageNotFound') }}
    </h1>
    <h1 v-else>
      {{ $t('label.otherError') }}
    </h1>
    <NuxtLink to="/">
      {{ $t('label.homePage') }}
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    const $t = this.$t.bind(this)
    return {
      pageNotFound: $t('message.pageNotFound'),
      otherError: $t('message.otherError')
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
