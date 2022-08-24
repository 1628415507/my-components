<template>
    <div class="time-wrap">
        <div class="numbox">
            <span v-for="(item, index) in arr" :key="index" class="num">{{ item }}</span>
        </div>
        <p>{{ text }}</p>
    </div>
</template>
<script>
    export default {
        props: {
            time: {
                type: Number,
                require: true,
                default: 0
            },
            text: {
                type: String,
                require: true,
                default: ''
            },
            prefixzero: {
                type: Number,
                require: true,
                default: 2
            }
        },
        computed: {
            arr() {
                return this.PrefixZero(this.time, this.prefixzero).toString().split('');
            }
        },
        created() {},
        methods: {
            // 差位向前补0
            PrefixZero(num, n) {
                return (Array(n).join(0) + num).slice(-n);
            }
        }
    };
</script>
<style lang="less" scoped>
    .time-wrap {
        text-align: center;
        .numbox {
            display: flex;
            justify-content: space-between;
            span {
                margin: 0 5px;
                display: inline-block;
                background: url('@/assets/images/countdown_num.png') no-repeat;
                width: 65px;
                height: 91px;
                border-radius: 4px;
                font-size: 40px;
                font-weight: 400;
                line-height: 91px;
                text-align: center;
            }
        }
        p {
            margin-top: 8px;
            font-size: 18px;
            font-weight: 500;
            line-height: 27px;
        }
    }
</style>
