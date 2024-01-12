import { cloneElement, useContext, useEffect, useMemo, useState } from 'react';

import { FormContext } from './Form';

interface IFormItemProps {
  label?: React.ReactNode;
  name?: string;
  rules?: {
    required?: boolean;
    message?: React.ReactNode;
    validator?: (rule: any, value: any) => Promise<string | void>;
  }[];
  children: React.ReactElement;
}

type IValidateField = (value: any) => Promise<string | void>;

export interface IField extends IFormItemProps {
  validateField: IValidateField;
}

const FormItem = (props: IFormItemProps) => {
  const { label = '', name = '', rules = [], children } = props;

  const formContext = useContext(FormContext);

  const [errorList, setErrorList] = useState<(React.ReactNode | string)[]>([]);

  // 是否必填
  const isRequired = useMemo(() => {
    const isTrue = rules.find((rule) => rule.required);

    if (isTrue) {
      return true;
    } else {
      false;
    }
  }, [rules]);

  // 触发校验
  const validateField: IValidateField = (value) => {
    return new Promise((resolve, reject) => {
      const ruleList = rules.map((rule) => {
        const { validator, message } = rule;

        if (validator) {
          return new Promise((resolve, reject) => {
            validator(rule, value)
              .then(() => {
                resolve();
              })
              .catch((errorValidator) => {
                reject(errorValidator);
              });
          });
        } else {
          return new Promise((resolve, reject) => {
            if (value === null || value === '' || value === undefined) {
              reject(message);
            } else {
              resolve();
            }
          });
        }
      });

      Promise.all(ruleList)
        .then(() => {
          setErrorList([]);
          resolve();
        })
        .catch((error) => {
          setErrorList([error]);
          reject(error);
        });
    });
  };

  // 注册
  useEffect(() => {
    const cancelRegisterItem = formContext.registerField({
      ...props,
      validateField,
    });

    return () => {
      cancelRegisterItem();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-24">
      <div>
        {isRequired && <span>*&nbsp;</span>}
        <span>{label}</span>
      </div>
      <div>
        {cloneElement(children, {
          // value: formContext.getFieldValue(name),
          onChange: (e: Event) => {
            const { value } = e.target;
            formContext.setFieldValue(name, value);

            validateField(value);
          },
        })}
      </div>
      <div className="h-2">
        {errorList.map((errorMsg) => {
          return <span className="text-xs">{errorMsg}</span>;
        })}
      </div>
    </div>
  );
};

export default FormItem;
