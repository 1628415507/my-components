<!--
 * @Author: Hong Yiqun
 * @LastEditors  : ryan
-->

<script>
// 表头组件，跟 el-table-column 一致，当传入的参数带有 children 属性时会渲染为多级表头
import { map } from 'lodash'

export default {
  props: {},
  methods: {
    renderNode(h, node, scopedSlots, slots) {
      let children = []
      if (node.children && 0 < node.children.length) {
        children = map(node.children, e =>
          this.renderNode(h, e, scopedSlots, slots)
        )
      }

      return h(
        'el-table-column',
        {
          props: {
            ...node
          },
          scopedSlots: scopedSlots
        },

        children
      )
    }
  },
  render(h) {
    return this.renderNode(
      h,
      {
        ...this.$attrs
      },
      this.$scopedSlots,
      this.$slots
    )
  }
}
</script>

<style></style>
