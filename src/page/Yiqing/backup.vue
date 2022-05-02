<template>
    <div class="index-page">
        <!--顶部区域-->

        <!-- <top-epidemic :epidemicCount="epidemicCount"></top-epidemic>
        <tabs class="tabs-warp" scrollspy sticky :duration="0.5">
            <tab title="数据统计">
                <data-statistics :mapData="mapData"></data-statistics>
            </tab>
            <tab title="疫情图">
                <china-map :mapData="mapData"></china-map>
            </tab>
            <tab title="国内疫情">
                <data-table :list="mapData.list" title="中国病例"></data-table>
            </tab>
            <tab title="国外疫情">
                <data-table :list="mapData.otherlist" title="全球病例"></data-table>
            </tab>
        </tabs> -->

    </div>
</template>

<script>
    // import Tab from 'vant/lib/tab';
    // import Tabs from 'vant/lib/tabs';
    // import 'vant/lib/tab/style';

    // import 'vant/lib/tabs/style';

    // import {jsonp} from '../../../static/js/jsonp'; // 封装的jsonp

    import {getYiqing} from '../../api/goods'

    // import TopEpidemic from '../../components/map/top-epidemic' ; // 顶部人次区域组件
    // import DataStatistics from '../../components/map/data-statistics'; // 数据统计组件
    // import ChinaMap from '../../components/map/china-map' ; // 全国疫情地图组件
    // import DataTable from '../../components/map/data-table' ; // 全国疫情表格组件

    export default {
        // components: { DataStatistics, ChinaMap, TopEpidemic, DataTable},
        data() {
            return {
                // epidemicCount: 0, // 查看人数
                mapData: {list: [], otherlist: []}, // 整体数据
            }
        },
        methods: {
            // 获取数据
            getDataAxios () {
                getYiqing().then(res => {
                    // console.log(res)
                    if (res.code === 200) {
                        console.log(res)
                        this.mapData = res
                    }
                    })
            },

        }, 
        created() {
            let that = this;
            that.getDataAxios()
        }
    }
</script>

<style lang="less" scoped>
    // @import "../../assets/style/color";

    // .index-page {
    //     padding-bottom: 20px;
    //     .tabs-warp {
    //         /deep/ .van-sticky {
    //             .van-tabs__wrap {
    //                 .van-tabs__nav {
    //                     .van-tabs__line {
    //                         background-color: @cl-main;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
</style>