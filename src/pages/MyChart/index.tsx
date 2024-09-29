import {
  deleteChartDocumentUsingPost,
  listMyChartByPageUsingPost,
} from '@/services/zxwbi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Button, Card, Col, List, message, Popconfirm, Result, Row } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  // 把初始条件分离出来，便于后面恢复初始条件
  const initsearchparams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  const [searchparams, setsearchparams] = useState<API.ChartQueryRequest>({ ...initsearchparams });
  //用户的初始信息状态
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [chartList, setchartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setloading] = useState<boolean>(true);

  // 获取图表数据
  const loadData = async () => {
    setloading(true);
    try {
      const msg = await listMyChartByPageUsingPost(searchparams);
      console.log(msg);
      if (msg.data) {
        // 如果成功,把图表数据回显到前端;如果为空，传一个空数组
        // 这里返回的是分页，msg.data.records拿到数据列表
        setchartList(msg.data.records ?? []);
        //数据总数为空就传0
        setTotal(msg.data.total ?? 0);
        // 隐藏图表的 title
        if (msg.data.records) {
          msg.data.records.forEach((data) => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取图表失败' + msg.message);
      }
    } catch (e: any) {
      message.error('获取图表失败' + e.message);
    }
    setloading(false);
  };
  //首次页面加载时，触发加载数据
  useEffect(() => {
    //这个页面首次渲染的时候，以及这个数组中的搜索条件发生变化的时候，会执行1oadData方法,自动触发重新搜索
    loadData();
  }, [searchparams]);
  //删除图表
  const handleDeleteChart = async (chartId: number) => {
    const param = {
      id: chartId,
    };
    const result = await deleteChartDocumentUsingPost(param);
    console.log(result);
    if (result.data === false) {
      message.error('删除失败');
    } else {
      message.success('删除成功!');
    }
    // 删除完成后自动刷新页面数据
    loadData();
  };

  return (
    <div className="my-chart-page">
      <div>
        <h2 style={{ marginLeft: 16 }}>我的图表</h2>
        <Search
          placeholder="请输入图表名称"
          enterButton="搜索"
          allowClear
          loading={loading}
          size="large"
          showCount
          maxLength={20}
          style={{ width: 600, marginLeft: 16 }}
          onSearch={(value: string) => {
            //当用户点击搜索按钮时，把当前搜索条件重新赋值给searchparams
            setsearchparams({
              ...searchparams,
              name: value,
            });
          }}
        />
        {/*新建页面跳转到addchart页面*/}
        <Button
          type="primary"
          size={'large'}
          style={{ marginLeft: 700 }}
          onClick={() => {
            window.location.href = '/add_chart';
          }}
        >
          新建图表
        </Button>
      </div>
      <div style={{ marginBottom: 16 }}></div>
      {/*先把数据展示出来。直接展示对象会报错,所以要把后端拿到的对象数组进行格式化;把对象转为JSON字符串*/}
      {/*数据列表：{JSON.stringify(chartList)}*/}
      <List
        grid={{ gutter: 16, xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        //   page第几页，pagesize每页显示多少条;
        // 当用户点击这个分页组件,切换分页时,这个组件就会去触发onchange方法,会改变咱们现在这个页面的搜索条件
        pagination={{
          onChange: (page, pageSize) => {
            //当切换分页，在当前搜索条件的基础上，把页数调整为当前的页数
            setsearchparams({
              ...searchparams,
              current: page,
              pageSize,
            });
          },
          current: searchparams.current,
          total: total,
          pageSize: searchparams.pageSize,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser?.userAvatar} />}
                title={
                  <>
                    <Row>
                      <Col lg={8} md={14}>
                        {item.name}
                      </Col>
                      <Col lg={8}>
                        <span>
                          生成时间： {item && new Date(item.createTime).toLocaleString('zh-CN')}
                        </span>
                      </Col>
                      <Col>
                        {item && item.id && (
                          <Popconfirm
                            title="确定要删除吗？"
                            description="此操作不可逆，请谨慎操作!~"
                            onConfirm={() => handleDeleteChart(item.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <a>删除</a>
                          </Popconfirm>
                        )}
                      </Col>
                    </Row>
                  </>
                }
                description={item.chartType ? '图表类型是' + item.chartType : undefined}
              />
              <>
                {item.status === 'wait' && (
                  <>
                    <Result
                      status="warning"
                      title="待生成"
                      // 这里很适合打广告哈哈哈
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                  </>
                )}
                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                  </>
                )}
                {item.status === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'分析目标：' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  </>
                )}
                {item.status === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                  </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
      {'总数:' + total}
    </div>
  );
};
export default MyChartPage;
