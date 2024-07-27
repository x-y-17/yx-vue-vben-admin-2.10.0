<template>
  <PageWrapper :class="prefixCls" title="图书列表">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="schemas"
        :showActionButtonGroup="true"
        @submit="handleSearch"
      />
    </template>

    <div :class="`${prefixCls}__container`">
      <a-list>
        <template v-for="item in list" :key="item.id">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__action`">
                  <template v-for="action in actions" :key="action.icon">
                    <div :class="`${prefixCls}__action-item`">
                      <Icon
                        v-if="action.icon"
                        :class="`${prefixCls}__action-icon`"
                        :icon="action.icon"
                        :color="action.color"
                      />
                      {{ action.text }}
                    </div>
                  </template>
                  <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                </div>
              </template>
              <template #title>
                <p :class="`${prefixCls}__title`">
                  {{ item.title }}
                </p>
                <div :class="`${prefixCls}__content`">
                  {{ item.content }}
                </div>
                <div>
                  <template v-for="tag in item.description" :key="tag">
                    <Tag class="mb-2">
                      {{ tag }}
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <a-pagination
        v-model:current="current1"
        v-model:page-size="pageSize1"
        :total="85"
        :show-total="(total) => `Total ${total} items`"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Tag, List, Pagination } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, searchList, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';

  const handleSearch = (e) => {
    console.log(e);
  };
  export default defineComponent({
    components: {
      Icon,
      Tag,
      BasicForm,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Pagination.name]: Pagination,
    },
    setup() {
      const list = ref([]);
      const current1 = ref<number>(1);
      const pageSize1 = ref<number>(20);
      searchList().then((data) => (list.value = data));
      return {
        prefixCls: 'list-search',
        list,
        actions,
        schemas,
        handleSearch,
        current1,
        pageSize1,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      padding: 12px;
      background-color: @component-background;
    }

    &__title {
      margin-bottom: 0px;
      font-size: 18px;
    }

    &__content {
      margin-bottom: 12px;
      color: @text-color-secondary;
    }

    &__action {
      margin-top: 10px;

      &-item {
        display: inline-block;
        padding: 0 16px;
        color: @text-color-secondary;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:nth-child(1),
        &:nth-child(2) {
          border-right: 1px solid @border-color-base;
        }
      }

      &-icon {
        margin-right: 3px;
      }
    }

    &__time {
      position: absolute;
      right: 20px;
      color: rgb(0 0 0 / 45%);
    }
  }
</style>
