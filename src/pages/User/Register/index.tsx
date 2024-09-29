import Footer from '@/components/Footer';
// import { REGISTER_BACKGROUND_IMAGE, SYSTEM_LOGO, WELCOME } from '@/constants';
import { getLoginUserUsingGet, userRegisterUsingPost } from '@/services/zxwbi/userController';
import { Link } from '@@/exports';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { LoginFormPage } from '@ant-design/pro-form/lib';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGet();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s): any => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    console.log(values);
    try {
      const res = await userRegisterUsingPost(values);
      if (res.code === 0) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        // 获取用户信息
        await fetchUserInfo();
        // 获取当前页面的URL
        const urlParams = new URL(window.location.href).searchParams;
        // 如果URL中有redirect参数，则跳转到该参数指定的页面，否则跳转到/user/login页面
        window.location.href = urlParams.get('redirect') || '/user/login';
        // 返回
        return;
      } else {
        message.error(res.message);
      } // 等待获取用户信息
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={containerClassName}>
      <Helmet>
        {'注册'}- {Settings.title}
      </Helmet>
      <div
        style={{
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginFormPage
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          containerStyle={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 8,
            boxShadow: '0 1px 6px -1px rgba(0, 0, 0, 0.1)',
            width: 450,
            height: 500,
            padding: '30px 25px 50px 25px',
            margin: 'auto',
            marginTop: 100,
          }}
          title="智能 BI 数据分析平台"
          logo={<img alt="logo" src="/logo.svg" />}
          subTitle={
            <a href="http://gitlab.code-nav.cn/zxw/mybi.git" target="_blank">
              zxw BI
            </a>
          }
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账户'}
                rules={[
                  {
                    required: true,
                    message: '账户是必填项！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号不能小于4位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不能小于8位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不能小于8位！',
                  },
                ]}
              />
            </>
          )}
          <div style={{ marginBottom: '16px' }}>
            <Link to="/user/login">老用户？</Link>
          </div>
        </LoginFormPage>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
