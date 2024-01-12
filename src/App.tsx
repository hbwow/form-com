import { useState } from 'react';
import Form from './components/Form';

function App() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<string>('{}');

  const handleSubmit = () => {
    const res = form.getFieldsValue();

    setResult(JSON.stringify(res));
  };
  const handleValidateSubmit = async () => {
    const res = await form.validateFields();

    setResult(JSON.stringify(res));
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <Form form={form}>
        <Form.Item
          name="test1"
          label="test1"
          rules={[{ required: true, message: '请输入test1！' }]}
        >
          <input />
        </Form.Item>

        <Form.Item
          name="test2"
          label="test2"
          rules={[
            {
              required: true,
              validator(_: any, value: any) {
                if (!value) {
                  return Promise.reject('请输入test2！');
                }
                return Promise.resolve();
              },
            },
            {
              required: true,
              validator(_: any, value: any) {
                if (value === '151') {
                  return Promise.reject('不能输入151！');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <input />
        </Form.Item>

        <Form.Item name="test3" label="test3">
          <input />
        </Form.Item>
      </Form>

      <div>
        <button className="mr-2" onClick={handleSubmit}>
          提交
        </button>
        <button className="mr-2" onClick={handleValidateSubmit}>
          校验成功后提交
        </button>
      </div>

      <div className="flex mt-10">
        <span>结果：</span>
        <div>{result}</div>
      </div>
    </div>
  );
}

export default App;
