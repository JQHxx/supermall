<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">

<!--      <div>-->
<!--        <ul>-->
<!--          <li v-for="item in $store.state.cartList">-->
<!--            {{item}}-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @load="imgLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>



    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
<!--    <toast :message="message" :show="show"></toast>-->
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
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";


  import Scroll from "@/components/common/scroll/Scroll";
  import GoodsList from "@/components/content/goods/GoodsList";
  import Toast from "@/components/common/toast/Toast";


  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
  import {debounce} from "@/common/utils";
  import {itemListenerMixin, backTopMixin} from "@/common/mixin";

  import {mapActions} from 'vuex'



  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],

    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        console.log(res);
        // 1.获取顶部图片轮播数据
        const data = res.result;
        // console.log(res);
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

        this.$nextTick(() => {
          //DOM已经被渲染出来
          //但是图片没有加载完
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)

          console.log(this.themeTopYs);

        })


      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      // //4.给 getThemeTopY 赋值
      //     2020.10.4 做不出来 imgLoad()进不去
      // this.getThemeTopY = debounce(() => {
      //   console.log('----');
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //
      //   console.log(this.themeTopYs);
      //
      // }, 300)
    },
    methods: {
      imgLoad() {
        console.log('-----');
        this.$refs.scroll.refresh()
        // this.getThemeTopY()
      },

      titleClick(index) {
        // console.log(index);
        // this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },

      contentScroll(position) {
        // 1.获取y值
        const  positionY = -position.y

        // 2.positionY和主题中的值进行对比

        // console.log(Number.MAX_VALUE);

        let length = this.themeTopYs.length
        for (let i = 0; i < length-1; i++) {

          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
              this.currentIndex = i;
            //   console.log(this.currentIndex);
              this.$refs.nav.currentIndex = this.currentIndex
          }



          // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i]) && positionY < this.themeTopYs[i+1] ||
          //     (i === length - 1 && positionY > this.themeTopYs[i]))) {
          //   this.currentIndex = i;
          //   console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }

        }

        // 2.是否显示回到顶部
        this.isShowBackTop = -position.y > 1000
      },

      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 2.将商品添加到购物车
        // this.$store.commit('addCart', product)

        // 2020.10.6 第221集开始 跟不上
        this.$store.dispatch('addCart', product).then(res => {
          console.log(res+'-----');
        })
      }


    },
    mounted() {

      // // this.themeTops = []
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //
      // console.log(this.themeTopYs);
    },
    // updated() {
    //   this.themeTopYs = []
    //
    //   this.themeTopYs.push(0)
    //   this.themeTopYs.push(this.$refs.param.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    //
    //   console.log(this.themeTopYs);
    // },



    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },




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

    background-color: #fff;
    z-index: 1;

  }


  .content {
    background-color: #fff;
    height: calc(100% - 93px);
  }
  
</style>