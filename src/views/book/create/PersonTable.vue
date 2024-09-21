<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, toRefs, h } from 'vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';

  const columns: BasicColumn[] = [
    {
      title: '序号',
      dataIndex: 'playOrder',
    },
    {
      title: '目录ID',
      dataIndex: 'id',
    },
    {
      title: '目录名称',
      dataIndex: 'text',
    },
    {
      title: '目录链接',
      dataIndex: 'href',
      customRender: (data) => {
        const { text } = data;
        return {
          children: h(
            'a',
            { href: `http://localhost:8081/upload/book/${text}`, target: '_blank' },
            '阅读',
          ),
        };
      },
    },
  ];

  export default defineComponent({
    components: { BasicTable },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const { data } = toRefs(props);
      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        showIndexColumn: false,
        dataSource: data,
        scroll: { y: '100%' },
        pagination: false,
      });

      return {
        registerTable,
        getDataSource,
      };
    },
  });
</script>
