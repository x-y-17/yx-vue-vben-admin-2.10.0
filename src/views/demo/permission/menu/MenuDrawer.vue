<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { getMenuList } from '/@/api/demo/system';
  import { createMenu, updateMenu } from '/@/api/sys/menu';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let menuList = [];
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await getMenuList();
        menuList = treeData;
        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      function checkAllChildrenMenuDisabeld(updateMenu) {
        let isAllClosed = true;
        const id = updateMenu.id;
        // 子菜单
        const submenu = menuList.filter((item) => item.pid === id);
        if (!submenu || submenu.length === 0) {
          return true;
        }
        isAllClosed = submenu.every((menu) => +menu.active === 0);
        if (isAllClosed) {
          isAllClosed = checkAllChildrenMenuDisabeld(submenu);
        }
        return isAllClosed;
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          console.log(values);
          if (values.parentMenu) {
            values.pid = values.parentMenu;
          } else {
            values.pid = 0;
          }
          values.active = +values.active;
          delete values.parentMenu;
          const isUpdateForm = unref(isUpdate);
          let res = {};
          console.log(values);
          if (isUpdateForm) {
            const menu = menuList.find((item) => values.name === item.name);
            values.id = (menu && menu.id) || '';
            if (checkAllChildrenMenuDisabeld(menu)) {
              res = await updateMenu({ data: values });
            } else {
              createMessage.error('请禁用该菜单下的所有子菜单再关闭该菜单！');
            }
          } else {
            res = await createMenu({ data: values });
          }
          console.log('🚀 ~ handleSubmit ~ res:', values, '--', res);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
