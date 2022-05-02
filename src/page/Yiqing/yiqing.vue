<template>
  <div>
    <section class="w mt30 clearfix">
      <y-shelf title="疫情地图">

        <div slot="content" class="table" v-loading="loading" element-loading-text="加载中...">

          <div style="margin-top:3%;margin-bottom:3%;margin-left:15%;margin-right:15%;">


            <div id="china_map_box">
              <div id="china_map"></div>
            </div>


          </div>
        </div>
      </y-shelf>
    </section>

    <section class="w mt30 clearfix">
      <y-shelf title="我们保险推荐系统的特色">
        <div slot="content" class="donate">
          <p>将互联网的优点最大化</p>
          <p>结合疫情大数据，对重点地区针对化推荐</p>
          <p>在被保险人发生意外、疾病，或者是有资金需求时，保险公司提供相应的报销、给付，以减轻经济压力。</p>
          <p>规避风险 重疾高发,治疗费用昂贵,一旦罹患重疾,家庭、工作、生活都会受到影响。</p>
          <p>减轻负担 现代人生活压力大,面临上有老、下有小的窘境。</p>
          <p>抵制通胀 投保年交保险,能够拥有安全稳健的预期收益,加上分红和万能险预期收益,基本上可以抵消通胀。</p>
          <p>财商体现 俗话说,穷人买彩票,富人买保险。</p>
        </div>
      </y-shelf>
    </section>
    
    <!-- <section class="w mt30 clearfix">
      <y-shelf :title="thankPanel.name">
        <div slot="content" class="hot">
          <mall-goods :msg="item" v-for="(item,i) in thankPanel.panelContents" :key="i"></mall-goods>
        </div>
      </y-shelf>
    </section> -->

    <!-- <div id="comment" style="width: 1220px;margin: 0 auto;"></div> -->
  </div>
</template>
<script>
import echarts from "echarts";       
import 'echarts/map/js/china.js'    //引入中国地图数据 （*********重中之重）

import {getYiqing} from '../../api/goods'

  import { thank, thanksList, getQues } from '/api/index.js'
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  import product from '/components/product'
  import mallGoods from '/components/mallGoods'
  import 'gitment/style/default.css'
  import Gitment from 'gitment'
  export default {
    data () {
      return {
        // radio: [],
        mapTime: '',
        thankPanel: [],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          sex: '',
          pro: '',
          work: '',
          age: '',
          health: '',
          radio: []

        },
        
        // epidemicCount: 0, // 查看人数
        mapData: {list: [], otherlist: []}, // 整体数据
        //echart 配制option  
        options: {
            tooltip: {
            triggerOn: "mousemove",   //mousemove、click
            padding:8,
            borderWidth:1,
            borderColor:'#409eff',
            backgroundColor:'rgba(255,255,255,0.7)',
            textStyle:{
                color:'#000000',
                fontSize:13
            },
            formatter: function(e, t, n) {
                let data = e.data;
                //模拟数据 
                // data.specialImportant = Math.random()*1000 | 0;
                // data.import = Math.random()*1000 | 0;
                // data.compare = Math.random()*1000 | 0;
                // data.common = Math.random()*1000 | 0;
                // data.specail = Math.random()*1000 | 0;

                let context = `
                <div>
                    <p><b style="font-size:15px;">${data.name}</b>(${data.time})</p>
                    <p class="tooltip_style"><span class="tooltip_left">现存确诊</span><span class="tooltip_right">${data.value}</span></p>
                    <p class="tooltip_style"><span class="tooltip_left">治愈人数</span><span class="tooltip_right">${data.cureNum}</span></p>
                    <p class="tooltip_style"><span class="tooltip_left">死亡人数</span><span class="tooltip_right">${data.deathNum}</span></p>
                    <p class="tooltip_style"><span class="tooltip_left">境外输入</span><span class="tooltip_right">${data.jwsrNum}</span></p>
                    <p class="tooltip_style"><span class="tooltip_left">累计确诊</span><span class="tooltip_right">${data.valueAll}</span></p>
                </div>
                `
                return context;
            }
            },
            visualMap: {
            show:true,
            left: 26,
            bottom: 40,
            showLabel:true,
            pieces: [
                {
                gte: 100,
                label: ">= 1000",
                color: "#1f307b"
                },
                {
                gte: 500,
                lt: 999,
                label: "500 - 999",
                color: "#3c57ce"
                },
                {
                gte: 100,
                lt:499,
                label: "100 - 499",
                color: "#6f83db"
                },
                {
                gte: 10,
                lt: 99,
                label: "10 - 99",
                color: "#9face7"
                },
                {
                lt:10,
                label:'<10',
                color: "#bcc5ee"
                }
            ]
            },
            geo: {
            map: "china",
            scaleLimit: {
                min: 1,
                max: 2
            },
            zoom: 1,
            top: 120,
            label: {
                normal: {
                show:true,
                fontSize: "14",
                color: "rgba(0,0,0,0.7)"
                }
            },
            itemStyle: {
                normal: {
                //shadowBlur: 50,
                //shadowColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: "rgba(0, 0, 0, 0.2)"
                },
                emphasis: {
                areaColor: "#f2d5ad",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                borderWidth: 0
                }
            }
            },
            series: [
            {
                name: "突发事件",
                type: "map",
                geoIndex: 0,
                data:[]
            }
            ]
        },
        //echart data
        dataList: [
    {
      name: "南海诸岛",
      time: '暂无数据',
      value: '暂无数据',
      cureNum:'暂无数据',
      deathNum:'暂无数据',
      jwsrNum:'暂无数据',
      valueAll:'暂无数据',
    },

        ]
      }
    },
    methods: {
    
        // 获取数据
        getDataAxios () {
            getYiqing().then(res => {
                // if (res.code === 200) {
                    console.log(res)
                    this.mapData = res.data
                    this.mapTime = res.data.cachetime
                    for(var i = 0, len = res.data.list.length; i < len; i++) {
                      let responseData = {
                        time: this.mapTime,
                        value: parseInt(res.data.list[i].econNum), 
                        cureNum: parseInt(res.data.list[i].cureNum), 
                        deathNum: parseInt(res.data.list[i].deathNum), 
                        jwsrNum: parseInt(res.data.list[i].jwsrNum), 
                        valueAll: parseInt(res.data.list[i].value), 
                        name: res.data.list[i].name
                      }
                      this.dataList.push(responseData)
                    }
                    this.initEchartMap();


                // }
                })
        },
        //初始化中国地图
        initEchartMap() {
        let mapDiv = document.getElementById('china_map');
        let myChart = echarts.init(mapDiv);
        myChart.setOption(this.options);
        },
        //修改echart配制
        setEchartOption(){
        this.options.series[0]['data'] = this.dataList;
        }
    },
    created() {


      this.setEchartOption();

      
    },
    mounted () {

      this.getDataAxios()

      this.$nextTick(()=>{

      })
      this.loading = false
    },
    components: {
      YShelf,
      YButton,
      product,
      mallGoods
    }
  }
</script>

<style scoped>
/* .yiqing {
  width: 1220px;
  margin: auto;
} */

    #china_map_box {
        /* height: 100%; */
        height: 850px;
        width: 850px;
        position: relative;
    }
    #china_map_box #china_map{
        /* height: 100%; */
        height: 850px;
        width: 850px;
    }
     #china_map_box .china_map_logo{
        position: absolute;
        top: 0;
        left: 0;
        width:45px;
     }
</style>
<style>
  #china_map .tooltip_style{
      line-height:1.7;
      overflow: hidden;
  }
  #china_map .tooltip_left{
      float: left;
  }
  #china_map .tooltip_right{
      float: right;
  }

</style>


<style lang="scss" rel="stylesheet/scss" scoped>
  .sk_item {
    width: 170px;
    height: 225px;
    padding: 0 14px 0 15px;
    > div {
      width: 100%;
    }
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all .3s;
      &:hover {
        transform: translateY(-5px);
      }
    }
    img {
      width: 130px;
      height: 130px;
      margin: 17px 0;
    }
    .sk_item_name {
      color: #999;
      display: block;
      max-width: 100%;
      _width: 100%;
      overflow: hidden;
      font-size: 12px;
      text-align: left;
      height: 32px;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .sk_item_price {
      padding: 3px 0;
      height: 25px;
    }
    .price_new {
      font-size: 18px;
      font-weight: 700;
      margin-right: 8px;
      color: #f10214;
    }
    .price_origin {
      color: #999;
      font-size: 12px;
    }
  }

  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 29px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);

  }

  ul.box {
    display: flex;
    li {
      flex: 1;
      img {
        display: block;
        width: 305px;
        height: 200px;
      }
    }
  }

  .mt30 {
    margin-top: 30px;
  }

  .hot {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }

  .table {
    align-items: left;
    display: flex;
    flex-direction: column;
    p{
      font-size: 18px;
      margin-top: 2vw;
      // color: #5683EA;
    }
    .el-table{
      // margin: 5vw 8vw 2vw 8vw;
      margin: 2vw 0 2vw 0vw;
    }
    .el-pagination{
      align-self: flex-end;
      margin: 0 3.5vw 2vw;
    }
  }

  .donate {
    // align-items: center;
    display: flex;
    flex-direction: column;
    margin: 1vw 3vw 2vw 3vw;
    p{
      font-size: 16px;
      margin-top: 1vw;
    }
  }

  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .imgbanner {
      width: 50%;
      height: 430px;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

</style>
