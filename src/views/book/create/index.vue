<template>
  <PageWrapper class="high-form" title="添加图书" content="请填写图书信息，并提交表单">
    <a-card title="基本信息" :bordered="false">
      <BasicForm @register="register" />
    </a-card>
    <a-card title="上传电子书" :bordered="false" class="!mt-5">
      <BasicForm @register="registerTask" />
    </a-card>
    <a-card title="电子书目录" :bordered="false" class="!mt-5">
      <PersonTable ref="tableRef" :data="contentData" />
    </a-card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent, ref, onMounted } from 'vue';
  import PersonTable from './PersonTable.vue';
  import { PageWrapper } from '/@/components/Page';
  import { schemas, taskSchemas, categoryTypeOptions } from './data';
  import { Card } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addContents, deleteContents } from '@/api/book/menu';
  import { useRouter } from 'vue-router';
  import { addBook, getBook, updateBook } from '@/api/book/book';

  const DIR = 'E:/nginx-1.26.1/html/upload';

  export default defineComponent({
    name: 'FormHightPage',
    components: { BasicForm, PersonTable, PageWrapper, [Card.name]: Card },
    setup() {
      const tableRef = ref<{ getDataSource: () => any } | null>(null);
      const contentData = ref([]);
      const { currentRoute } = useRouter();
      const { id } = currentRoute.value.query;
      const { createMessage } = useMessage();
      // setFieldsValue({})
      onMounted(() => {
        getBook(id).then((res) => {
          console.log('🚀 ~ onMounted ~ res:', res);
          const [book] = res;
          const { title, author, cover, fileName, language, publisher, categoryText, rootFile } =
            book;
          setFieldsValue({
            title,
            author,
            cover,
            fileName,
            lang: language,
            publisher,
            categoryText,
            rootFile,
          });
          setTaskFieldsValue({
            book: [
              {
                data: book,
                dir: DIR,
                mimeType: 'application/epub+zip',
                originalName: fileName,
                path: `${DIR}/${fileName}`,
              },
            ],
          });
        });
      });
      const [register, { validate, getFieldsValue, setFieldsValue, resetFields }] = useForm({
        layout: 'vertical',
        baseColProps: {
          span: 6,
        },
        schemas: schemas,
        showActionButtonGroup: false,
      });

      const [
        registerTask,
        {
          validate: validateTaskForm,
          resetFields: resetTaskFields,
          setFieldsValue: setTaskFieldsValue,
        },
      ] = useForm({
        layout: 'vertical',
        baseColProps: {
          span: 6,
        },
        schemas: taskSchemas({ contentData }),
        showActionButtonGroup: false,
      });

      async function submitAll() {
        try {
          if (tableRef.value) {
            console.log('table data:', tableRef.value.getDataSource());
          }

          const [values, taskValues] = await Promise.all([validate(), validateTaskForm()]);
          console.log('form data:', values, taskValues);
          const {
            title,
            author,
            fileName,
            cover,
            lang: language,
            publisher,
            rootFile,
            categoryText,
          } = values;
          const category = categoryTypeOptions.find((item) => item.value === categoryText);
          if (id) {
            const res = await updateBook({
              id,
              title,
              author,
              language,
              publisher,
              categoryText,
            });
            console.log('update book res:', res);
            if (res.affectedRows > 0) {
              createMessage.success('电子书更新成功');
            }
          } else {
            const res = await addBook({
              title,
              author,
              fileName,
              cover,
              language,
              publisher,
              rootFile,
              category: categoryText,
              categoryText: category?.label,
            });
            console.log('add book res:', res);
            for (const content of contentData.value) {
              const { text, id, playOrder, href } = content;
              const url = `http://localhost:8081/upload/book/${href}`;

              await addContents({
                fileName,
                text: url,
                id,
                href,
                order: playOrder,
                level: 0,
                label: text,
                pid: '',
                navId: id,
              });
            }
            if (res.affectedRows > 0) {
              createMessage.success('电子书新增成功');
              await resetFields();
              await resetTaskFields();
              contentData.value = [];
            }
          }
        } catch (error) {
          console.log('error:', error);
          if (error.message.startsWith('Duplicate entry')) {
            createMessage.error('电子书重复添加');
          } else {
            createMessage.error(error.message);
          }
        }
      }

      return { register, registerTask, submitAll, tableRef, contentData };
    },
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
