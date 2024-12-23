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
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import type { DefineComponent } from 'vue';
  import { addRole, updateRole, addRoleMenu, getRoleMenu, updateRoleMenu } from '/@/api/book/role';
  import { getMenuList } from '/@/api/book/menu';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema(isUpdate),
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const menuList = await getMenuList();
          treeData.value = menuList as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          const roleId = data.record.id;
          const result = await getRoleMenu({ roleId });
          if (result.length > 0) {
            const menuIdArr = JSON.parse(result[0].menuId);
            data.record.menu = menuIdArr;
          }
          console.log(
            '🚀 ~ const[registerDrawer,{setDrawerProps,closeDrawer}]=useDrawerInner ~ roleMenuList:',
            result,
          );
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
          let res;
          let msg = '';
          console.log(values);
          if (isUpdate.value) {
            res = await updateRole(values);
            msg = '编辑成功';
            const { id, menu = [] } = values;
            const res2 = await updateRoleMenu({ roleId: id, menuId: menu });
            console.log('🚀 ~ handleSubmit ~ res2:', res2);
          } else {
            res = await addRole(values);
            msg = '新增成功';
            const { id } = res;
            const { menu = [] } = values;
            const res2 = await addRoleMenu({ roleId: id, menuId: menu });
            console.log('🚀 ~ handleSubmit ~ res2:', res2);
          }
          console.log('🚀 ~ handleSubmit ~ res:', res);
          // 新增角色后，需要提交角色与菜单的关联关系

          if (res) {
            createMessage.success(msg);
            closeDrawer();
            emit('success');
          } else {
            createMessage.error(msg);
          }
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
