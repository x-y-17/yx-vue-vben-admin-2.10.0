<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          title="角色列表"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import type { DefineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './user.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { getMenuList } from '/@/api/demo/system';
  import { addUser, updateUser } from '/@/api/book/user';

  const DEFAULT_AVATAR =
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

  export default defineComponent({
    name: 'UserDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);

      const [
        registerForm,
        { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema },
      ] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          treeData.value = (await getMenuList()) as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          data.record.active = String(data.record.active);
          data.record.avatar = [data.record.avatar];
          data.record.role = JSON.parse(data.record.role);
          // 移除schema中的password
          const schemas = formSchema.filter((item) => item.field !== 'password');
          console.log(
            '🚀 ~ const[registerDrawer,{setDrawerProps,closeDrawer}]=useDrawerInner ~ schemas:',
            schemas,
          );
          // 重新设置schema
          updateSchema(schemas);

          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          console.log(values);
          const params: any = {};
          params.username = values.username;
          params.password = values.password;
          params.nickname = values.nickname;
          params.avatar = values.avatar || DEFAULT_AVATAR;
          params.role = values.role || '[]';
          params.active = values.active || 1;
          const update = unref(isUpdate);
          let res;
          if (update) {
            // 编辑
            res = await updateUser(params);
          } else {
            // 新增
            res = await addUser(params);
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  }) as DefineComponent;
</script>
