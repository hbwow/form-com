// 输入控件渲染，自定义校验，表单提交

import { createContext } from 'react';
import FormItem from './FormItem';
import useForm, { IForm } from './useForm';

interface IFormProps {
  form: IForm;
  children?: React.ReactNode;
}

export const FormContext = createContext({} as IForm);

const Form = ({ form, children }: IFormProps) => {
  const [_form] = useForm(form);

  return (
    <form>
      <FormContext.Provider value={_form}>{children}</FormContext.Provider>
    </form>
  );
};

Form.Item = FormItem;
Form.useForm = useForm;

export default Form;
