import { useRef } from 'react';
import { IField } from './FormItem';

type INamePath = string | number;

type IRegisterField = (entity: IField) => () => void;
type ISetFieldValue = (name: INamePath, value: any) => void;
type IGetFieldValue = (name: INamePath) => any;
type IGetFieldsValue = () => any;
type IValidateFields = (nameList?: INamePath[]) => Promise<any>;

export interface IForm {
  registerField: IRegisterField;
  setFieldValue: ISetFieldValue;
  getFieldValue: IGetFieldValue;
  getFieldsValue: IGetFieldsValue;
  validateFields: IValidateFields;
}

const useForm = (_form?: IForm) => {
  const store = useRef<Record<any, any>>({});

  const entities = useRef<IField[]>([]);

  // 注册字段
  const registerField: IRegisterField = (entity) => {
    entities.current.push(entity);

    return () => {
      entities.current = entities.current.filter(
        (item) => item.name !== entity.name,
      );
    };
  };

  // 通过name设置表单的值
  const setFieldValue: ISetFieldValue = (name, value) => {
    store.current[name] = value;
  };

  // 通过name获取信息
  const getFieldValue: IGetFieldValue = (name) => {
    return store.current[name];
  };

  // 获取全部信息
  const getFieldsValue: IGetFieldsValue = () => {
    return store.current;
  };

  // 触发表单验证 全部成功 则返回全部信息
  const validateFields: IValidateFields = () => {
    return new Promise((resolve, reject) => {
      Promise.all([
        ...entities.current.map((entity) =>
          entity.validateField(store.current[entity.name]),
        ),
      ])
        .then(() => {
          resolve(getFieldsValue());
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const form: IForm = {
    registerField,
    setFieldValue,
    getFieldValue,
    getFieldsValue,
    validateFields,
  };

  return [_form ?? form];
};

export default useForm;
