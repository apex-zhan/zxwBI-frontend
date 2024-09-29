import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: true,
  title: 'zxw BI',
  pwa: true,
  logo: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.JFc_CgjsmObAZbvDhYQZfAHaHa?pid=ImgDet&w=474&h=474&rs=1',
  iconfontUrl: '//at.alicdn.com/t/font_1039684_r5u27wv5e8z.js',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};

export default Settings;
