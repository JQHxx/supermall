<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @load="imgLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
    </scroll>
  </div>
</template>

<script>

  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
  import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";


  import Scroll from "@/components/common/scroll/Scroll";

  import {getDetail, Goods, Shop, GoodsParam} from "@/network/detail";


  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo
    },

    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {}
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部图片轮播数据
        const data = res.result;
        console.log(res);
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.取出评论的信息
        if(data.rate.cRate != 0) {
          this.commentInfo = data.rate.list[0]
        }
      })
    },
    methods: {
      imgLoad() {
        this.$refs.scroll.refresh()
      }
    }

  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;

  }


  .content {
    height: calc(100% - 44px);
  }
  
</style>