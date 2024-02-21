<template>
    <div class="test-wrapper">
        <h2>Video Test</h2>
        <luma-player src="test-files/video/test.mp4" poster-image="test-files/image/Firefox_wallpaper.png" />
        <h2>Audio Test</h2>
        <luma-player src="test-files/audio/test.wav" poster-image="test-files/image/Firefox_wallpaper.png" />
    </div>
</template>

<script setup>
import LumaPlayer from "@/components/LumaPlayer.vue";
</script>

<style scoped>
html, body {
    margin: 0;
    padding: 0;
}

.test-wrapper {
    margin: 0 12px;
}
</style>
