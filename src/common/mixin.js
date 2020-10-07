import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backTop/BackTop";


export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh)

    this.itemImgListener = () => {
      refresh()
    }

    this.$bus.$on('itemImageLoad', this.itemImgListener )

    // console.log('我是mixin');
  }


}


export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
  }
}