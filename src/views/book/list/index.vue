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
          <a-list-item :class="`${prefixCls}__custom-item-style`">
            <template #extra>
              <a :href="`https://www.youbaobao.xyz/book/res/img/${item.cover}`" target="_blank">
                <img
                  :class="`${prefixCls}__cover`"
                  alt="logo"
                  :src="`https://www.youbaobao.xyz/book/res/img/${item.cover}`"
                />
              </a>
            </template>
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__action`">
                  <template v-for="action in actions" :key="action.icon">
                    <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                  </template>
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
        v-model:current="current"
        v-model:page-size="pageSize"
        :total="total"
        :show-total="(total) => `共计 ${total} 项`"
        @change="onPageChange"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Tag, List, Pagination } from 'ant-design-vue';
  import { defineComponent, ref, unref, computed } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, searchList, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';

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
      const title = ref();
      const author = ref();
      const total = ref(0);
      const current = ref(1);
      const pageSize = ref(20);
      const searchParams = computed(() => {
        return {
          title: unref(title),
          author: unref(author),
          page: unref(current),
          pageSize: unref(pageSize),
        };
      });
      const handleSearch = (e) => {
        console.log(e);
        title.value = e.name ? e.name : null;
        author.value = e.author ? e.author : null;
        handleSearchList(unref(searchParams));
      };
      const handleSearchList = (params = {}) => {
        searchList(params).then(({ result, count }) => {
          list.value = result;
          total.value = count;
        });
      };

      const onPageChange = (page, pagesize) => {
        current.value = +page;
        pageSize.value = +pagesize;
        handleSearchList(unref(searchParams));
      };

      handleSearchList();
      return {
        prefixCls: 'list-search',
        list,
        actions,
        schemas,
        handleSearch,
        current,
        pageSize,
        total,
        onPageChange,
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

    &__custom-item-style {
      align-items: flex-start;
    }

    &__title {
      margin-bottom: 0;
      font-size: 18px;
    }

    &__content {
      margin-bottom: 12px;
      color: @text-color-secondary;
    }

    &__cover {
      width: 160px;
      height: 180px;
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
      left: 0;
      color: rgb(0 0 0 / 45%);
    }
  }
</style>
