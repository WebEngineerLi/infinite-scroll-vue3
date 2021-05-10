<template>
  <div>
    <div>锚点索引：{{ anchorItem.index }}</div>
    <div>锚点偏移：{{ anchorItem.offset }}</div>
    <div>平移量：{{ translateY }}</div>
    <div>滚动高度：{{ actualHeight }}</div>
    <div class="infinite-scroll" ref="container" @scroll="handleScroll">
      <!-- 撑开高度 -->
      <!-- :style="{ transform: `translateY(${8400}px)` }" -->
      <div
        class="infinite-scroll_runway"
        :style="{ height: `${actualHeight}px` }"
      ></div>
      <ul
        :style="{
          transform: `translateY(${translateY}px)`,
        }"
      >
        <Item
          class="item-card"
          v-for="item in visibleList"
          :data-index="item.index"
          :ref="setItemRefs"
          :key="item.index"
          :data="item"
          @sizeChange="handleSizeChange"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import Item from "@/components/Item.vue";
import { ref } from "vue";
import { fetchData } from "@/helper";

export default {
  name: "Home",
  components: {
    Item,
  },
  data() {
    return {
      bufferSize: 8,
      estimated_height: 180,
      // 开始索引
      startAttachedIndex: 0,
      // 结束索引
      endAttachedIndex: 0,
      // 锚点元素
      anchorItem: {
        index: 0,
        offset: 0,
      },
      visibleCount: 0,
      visibleList: [],
      cachedHeight: [],
      translateY: 0,
      prevScrollTop: 0,
      itemRefs: [],
    };
  },
  computed: {
    actualHeight() {
      let height = 0;
      this.userList.forEach((item, index) => {
        height += this.cachedHeight[index] || this.estimated_height;
      });
      return height;
    },
  },
  setup() {
    // let itemRefs = ref([]);
    // const setItemRefs = (el) => {
    //   if (!itemRefs.value.includes(el)) {
    //     itemRefs.value.push(el);
    //   }
    // };

    const userList = ref([]);
    const getUserList = async (count) => {
      userList.value = await fetchData(count);
      userList.value.forEach((item, index) => {
        Object.assign(item, {
          index,
        });
      });
    };

    return {
      userList,
      getUserList,
      // itemRefs,
      // setItemRefs,
    };
  },
  async mounted() {
    const { clientHeight } = this.$refs.container;
    this.visibleCount = Math.floor(clientHeight / this.estimated_height);
    await this.getUserList(1000);
    this.getVisibleData();
  },
  methods: {
    setItemRefs(el) {
      if (!this.itemRefs.includes(el)) {
        this.itemRefs.push(el);
      }
    },
    getVisibleData() {
      this.startAttachedIndex = Math.max(
        0,
        this.anchorItem.index - this.bufferSize
      );
      this.endAttachedIndex = Math.min(
        this.anchorItem.index + this.visibleCount + this.bufferSize,
        this.userList.length
      );
      this.visibleList = this.userList.slice(
        this.startAttachedIndex,
        this.endAttachedIndex
      );
    },
    updateAnchorItem(delta) {
      let { index } = this.anchorItem;
      delta += this.anchorItem.offset;
      const { scrollTop } = this.$refs.container;
      // 滑动到最上面，需要重置translateY为0
      if (scrollTop <= 0) {
        this.translateY = 0;
      }
      if (delta > 0) {
        if (this.endAttachedIndex >= this.userList.length) {
          return;
        }
        // 向下滚动
        while (
          index < this.userList.length &&
          delta > (this.cachedHeight[index] || this.estimated_height)
        ) {
          if (!this.cachedHeight[index]) {
            this.cachedHeight[index] = this.estimated_height;
          }
          delta -= this.cachedHeight[index];
          index++;
        }
        this.anchorItem = {
          index,
          offset: delta,
        };
      } else {
        while (delta < 0) {
          if (!this.cachedHeight[index - 1]) {
            this.cachedHeight[index - 1] = this.estimated_height;
          }
          delta += this.cachedHeight[index - 1];
          index--;
        }
        if (index < 0) {
          this.anchorItem = {
            index: 0,
            offset: 0,
          };
        } else {
          this.anchorItem = {
            index,
            offset: delta,
          };
        }
      }
    },
    handleScroll() {
      const delta = this.$refs.container.scrollTop - this.prevScrollTop;
      this.prevScrollTop = this.$refs.container.scrollTop;
      this.updateAnchorItem(delta);
      this.getVisibleData();
    },
    handleSizeChange(index, height) {
      this.cachedHeight[index] = height;
      this.calTranslateY();
    },
    async calTranslateY() {
      await this.$nextTick();
      const { scrollTop } = this.$refs.container;
      const { index: anchorDomIndex, offset } = this.anchorItem;
      const anchorDomScrollY = scrollTop - offset;
      let firstAttachedDomScrollY = anchorDomScrollY;
      for (let i = anchorDomIndex - 1; i >= this.startAttachedIndex; i--) {
        firstAttachedDomScrollY -= this.cachedHeight[i];
      }
      this.translateY = firstAttachedDomScrollY;
    },
  },
};
</script>

<style scoped lang="scss">
.infinite-scroll {
  border-top: 1px solid #444;
  position: relative;
  overflow: auto;
  padding: 0%;
  height: 90vh;
  &_runway {
    width: 1px;
    height: 1px;
    transition: transform 0.2s;
    position: absolute;
  }
}
</style>
