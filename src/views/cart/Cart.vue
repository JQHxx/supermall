<template>
  <div class="cart">
<!--    导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{Length}})</div>
    </nav-bar>

<!--    商品列表-->
    <cart-list></cart-list>

<!--    底部汇总-->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import CartList from "@/views/cart/childComps/CartList";
  import CartBottomBar from "@/views/cart/childComps/CartBottomBar";

  import {mapGetters} from 'vuex'


  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar

    },
    computed: {
      // ...mapGetters([
      //     "cartList",
      //     "cartLength"
      // ])

      ...mapGetters({
        Length: 'cartLength',
        list: 'cartList'
      })
    }

  }
</script>

<style scoped>

  .cart {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #f6f6f6;
    /*font-weight: 700;*/
  }

</style>
