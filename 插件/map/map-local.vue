<template>
    <!--
        https://dafrok.github.io/vue-baidu-map/#/zh/start/installation
        $ npm install vue-baidu-map --save
    -->
    <div>
        <label>
            关键词：
            <input v-model="keyword" />
        </label>
        <label>
            地区：
            <input v-model="location" />
        </label>
        <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bm-view" ak="bqiDujgsaWN1QfYBijag7EbWmVtNU6wE"></baidu-map>
    </div>
</template>
<script>
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    export default {
        name: 'pm-distribution',
        components: { BaiduMap },
        data () {
            return {
                center: { lng: 0, lat: 0 },
                zoom: 3,
                location: '北京',
                keyword: '百度'
            }
        },
        watch: {},
        computed: {},
        methods: {
            handler ({ BMap, map }) {
                console.log(BMap, map)
                this.center.lng = 116.404
                this.center.lat = 39.915
                this.zoom = 15
            }
        },
        mounted () {}
    }
</script>
<style lang="less" scoped>
    .bm-view {
        width: 400px;
        height: 300px;
    }
</style>
