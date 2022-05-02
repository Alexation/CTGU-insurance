<template>
  <div class="gray-box">
    <div class="title">
      <h2>{{title}}</h2>
      <div>
        <slot name="right"></slot>
      </div>
    </div>
    <!--内容-->
    <div>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: [
      'title'
    ]
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$background: #E4FFF7;
$textColor: #5362F6;

@function textShadow($precision, $size, $color){
  $value: null;
  $offset: 0;
  $length: $size * (1 / $precision) - 1;

  @for $i from 0 through $length {
    $offset: $offset + $precision;
    $shadow: $offset + px $offset + px $color;
    $value: append($value, $shadow, comma);
  }

  @return $value;
}



  .gray-box {
    position: relative;
    margin-bottom: 30px;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0, 0, 0, .14);
    box-shadow: 0 3px 8px -6px rgba(3, 2, 2, 0.1);
    // 
    .title {
      // color: $textColor;
      // text-shadow: textShadow(0.25, 2, #E485F8);

      background-color: #666;
      padding-left: 30px;
      position: relative;
      z-index: 10;
      height: 60px;
      padding: 0 10px 0 24px;
      border-bottom: 1px solid #d4d4d4;
      border-radius: 8px 8px 0 0;
      box-shadow: rgba(0, 0, 0, .06) 0 1px 7px;
      background: #f3f3f3;
      background: -webkit-linear-gradient(#fbfbfb, #ececec);
      background: linear-gradient(#fbfbfb, #ececec);
      line-height: 60px;
      font: 20px/100% '微软雅黑';
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        font-size: 20px;
        font-weight: 700;
        display: inline-block;
        text-transform: uppercase;
        font-family: "Archivo Black", "Archivo", sans-serif;
      }
    }
  }
</style>
