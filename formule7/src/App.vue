<template>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <Component :is="Component" />
      </transition>
    </router-view>
</template>

<style>
@import url('assets/css/style.css');
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s ease-out;
}

</style>