<template>
    <div class="list-wrap">
        <div v-if="dataList.length">
            <!-- 列表 -->
            <div class="listbox">
                <div v-for="(item, index) in dataList" :key="index" class="item pointers" @click="handleItemClick(item)">
                    <div class="title">
                        <div v-if="prefix" class="prefix">
                            <slot name="prefix"></slot>
                        </div>
                        <p class="ellipsis" :title="item.title">{{ item.title }}</p>
                    </div>
                    <div v-if="item.publishTime" class="time">【{{ item.publishTime }}】</div>
                    <div v-if="item.createTime" class="time">【{{ item.createTime }}】</div>
                </div>
            </div>
            <!-- 分页 -->
            <pagination :total="totalPages" :size="size" :currentpage.sync="curpage" @change-page="handlePageChange"></pagination>
        </div>
        <div v-if="!dataList.length && isRequested" class="empty">
            暂无数据
            <!-- <el-empty description=" "></el-empty> -->
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            info: {
                type: Object,
                require: true,
                default: () => {}
            },
            requested: {
                type: Boolean,
                require: false,
                default: false // 是否请求完数据
            },
            prefix: {
                type: Boolean,
                require: true,
                default: false
            },
            size: {
                type: Number,
                require: true,
                default: 10
            }
        },
        data() {
            return {
                dataList: [],
                totalPages: 0,
                curpage: 1,
                isRequested: false
            };
        },
        watch: {
            info: {
                handler() {
                    this.dataList = this.info.data;
                    this.totalPages = this.info.totalPages;
                },
                deep: true
            },
            requested(newval, oldval) {
                this.isRequested = newval;
            }
            // 监听页数变化
            // curpage(newval, oldval) {
            //   console.log('curpage', newval, oldval)
            // },
        },
        created() {},
        methods: {
            handlePageChange(val) {
                this.$emit('update:curpage', this.curpage); // 发送当前页数
                this.$emit('get-pagedata', val);
            },
            handleItemClick(item) {
                this.$emit('handle-item', item);
            }
        }
    };
</script>
<style lang="less" scoped>
    .list-wrap {
        .listbox {
            min-height: 400px;
            .item {
                border-bottom: 2px dashed rgba(0, 0, 0, 0.1);
                color: #666;
                font-size: 14px;
                font-weight: 500;
                height: 48px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .title {
                    width: 70%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .prefix {
                        margin-right: 8px;
                    }
                }
                .time {
                    width: 30%;
                    text-align: right;
                }
            }
        }

        .empty {
            color: rgb(160, 159, 159);
            min-height: 350px;
            // background-color: #bfa;
            text-align: center;
            line-height: 350px;
        }
    }
</style>
