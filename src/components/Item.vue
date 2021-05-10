<template>
  <li class="person-info-card" ref="card" :data-index="data.index">
    <div class="person-info-card_inner">
      <!-- <img :src="data.avatar" class="person-info-card_avatar" /> -->
      <div class="person-info-card_base-info">
        <span class="item">
          {{ data.index }}
        </span>
        <span class="item">
          {{ data.name }}
        </span>
        <span class="item">
          {{ data.email }}
        </span>
        <span class="item">
          {{ data.phone }}
        </span>
        <div class="person-info-card_paragraph">{{ data.paragraph }}</div>
      </div>
    </div>
  </li>
</template>

<script>
import { onUnmounted } from "vue";
export default {
  name: "Item",
  props: {
    data: Object,
    default() {
      return {};
    },
    fixedHeight: {
      type: Boolean,
      default: false,
    },
    sizeChange: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    if (this.fixedHeight) {
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const [
        {
          contentRect: { height },
        },
      ] = entries;
      if (height === 0) {
        return;
      }
      this.$emit("sizeChange", this.data.index, height + 12);
    });
    ro.observe(this.$refs.card);
    // console.log("this.$refs: ", this.$refs.card);
    onUnmounted(() => {
      ro.disconnect.bind(ro);
    });
  },
};
</script>

<style scoped lang="scss">
.person-info-card {
  padding-bottom: 12px;
  &_inner {
    box-sizing: border-box;
    display: flex;
    padding: 12px;
    width: 100%;
    border-bottom: 1px solid #dedede;
    border-top: 1px solid #dedede;
  }
  &_avatar {
    height: 80px;
    width: 80px;
  }
  &_paragraph {
    margin: 6px 0 0 12px;
    color: #666;
    font-size: 13px;
  }
  .item {
    margin-left: 12px;
  }
}
</style>
