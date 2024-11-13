import { FormSchema } from '/@/components/Form/index';
import { getBookList, deleteBook } from '/@/api/book/book';

export const deleteBookById = async (extraParams) => {
  console.log('extraParams', extraParams);
  return await deleteBook(extraParams);
};

export const searchList = async (extraParams) => {
  console.log(extraParams);
  const result: any[] = [];
  const params: any = {
    page: extraParams.page ? extraParams.page : 1,
    pageSize: extraParams.pageSize ? extraParams.pageSize : 20,
  };
  if (extraParams.title) params.title = extraParams.title;
  if (extraParams.author) params.author = extraParams.author;
  if (extraParams.id) params.id = extraParams.id;
  const { data, count } = await getBookList(params);
  console.log('🚀 ~ searchList ~ data:', data);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    result.push({
      id: item.id,
      title: item.title,
      description: [item.categoryText, item.language],
      content: item.author,
      time: item.publisher,
      cover: item.cover,
    });
  }
  console.log('🚀 ~ searchList ~ result:', result);

  return { result, count };
};

export const actions: any[] = [
  { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '书名',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'author',
    component: 'Input',
    label: '作者',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
];
