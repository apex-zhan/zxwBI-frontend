import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'thiszxw出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
        display: 'flex',
        //自动居于该页面底部
        alignItems: 'flex-end',
        //居中
        justifyContent: 'center',

      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'my BI',
          title: 'my BI',
          href: 'http://gitlab.code-nav.cn/zxw/mybi.git',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'http://gitlab.code-nav.cn/zxw/mybi.git',
          blankTarget: true,
        },
        {
          key: 'my BI',
          title: 'my BI',
          href: 'http://gitlab.code-nav.cn/zxw/mybi.git',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
