import { FormSchema } from '/@/components/Form';
import axios from 'axios';
import { useGlobSetting } from '/@/hooks/setting';
import { getToken } from '/@/utils/auth';

const basicOptions: LabelValueOptions = [
  {
    label: 'EN',
    value: 'en-US',
  },
  {
    label: 'CN',
    value: 'cn',
  },
];

const storeTypeOptions: LabelValueOptions = [
  {
    label: '私密',
    value: '1',
  },
  {
    label: '公开',
    value: '2',
  },
];

const categoryTypeOptions: LabelValueOptions = [
  {
    label: 'Biomedicine',
    value: '12',
  },
  {
    label: 'BusinessandManagement',
    value: '13',
  },
  {
    label: 'EarthSciences',
    value: '14',
  },
  {
    label: 'Engineering',
    value: '15',
  },
  {
    label: 'ComputerScience',
    value: '16',
  },
  {
    label: 'Economics',
    value: '17',
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: '书名',
    required: true,
  },
  {
    field: 'author',
    component: 'Input',
    label: '作者',
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'publisher',
    component: 'Input',
    label: '出版社',
    componentProps: {
      options: basicOptions,
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'lang',
    component: 'Select',
    label: '语言',
    componentProps: {
      options: basicOptions,
    },
    required: true,
  },
  {
    field: 'categoryText',
    component: 'Select',
    label: '类别',
    componentProps: {
      options: categoryTypeOptions,
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'fileName',
    component: 'Input',
    label: '文件路径',
    // required: true,
    componentProps: {
      disabled: true,
    },
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'cover',
    component: 'Input',
    label: '封面路径',
    componentProps: {
      options: storeTypeOptions,
      disabled: true,
    },
    // required: true,
  },
  {
    field: 'rootFile',
    component: 'Input',
    label: '根文件',
    componentProps: {
      options: storeTypeOptions,
      disabled: true,
    },
    // required: true,
    colProps: {
      offset: 2,
    },
  },
];
// export const taskSchemas: FormSchema[] = [
//   {
//     field: 'book',
//     component: 'Upload',
//     label: '电子书',
//     required: true,
//     componentProps: {
//       maxSize: 10,
//       maxNumber: 1,
//       accept: ['epub'],
//       api: (data) => {
//         const formData = new FormData();
//         formData.append('file', data.file);
//         const globaleSetting = useGlobSetting();
//         const { apiUrl } = globaleSetting;
//         const requireUrl = `${apiUrl}/book/upload`;
//         return axios.post(requireUrl, formData, {
//           headers: {
//             'Content-Type': data.file.type,
//             Authorization: `Bearer ${getToken()}`,
//           },
//         });
//       },
//       onChange(data) {
//         console.log('change:', data);
//       },
//     },
//   },
// ];
export const taskSchemas = (methods): FormSchema[] => {
  const { getFieldsValue, setFieldsValue } = methods;
  return [
    {
      field: 'book',
      component: 'Upload',
      label: '电子书',
      required: true,
      componentProps: {
        maxSize: 10,
        maxNumber: 1,
        accept: ['epub'],
        api: (data) => {
          const formData = new FormData();
          formData.append('file', data.file);
          const globaleSetting = useGlobSetting();
          const { apiUrl } = globaleSetting;
          const requireUrl = `${apiUrl}/book/upload`;
          return axios.post(requireUrl, formData, {
            headers: {
              'Content-Type': data.file.type,
              Authorization: `Bearer ${getToken()}`,
            },
          });
        },
        onChange(files) {
          console.log('change:', files);
          // 获取解析后的电子书数据
          if (files.length > 0) {
            if (!files || files.length < 0) {
              return;
            }
            const [file] = files;
            const fileData = file.data;
            if (fileData) {
              setFieldsValue({
                title: fileData.title,
                author: fileData.creator['_'] || fileData.creator,
                publisher: fileData.publisher,
                lang: fileData.language,
                categoryText: fileData.categoryText,
                fileName: file.originalName,
                cover: fileData.cover,
                rootFile: fileData.rootFile,
              });
            }
          }
        },
      },
    },
  ];
};
