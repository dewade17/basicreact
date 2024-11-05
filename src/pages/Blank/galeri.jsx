import { Col, Row, Typography, Card, Divider, List, Flex, Input, FloatButton, Drawer, Form, Button, notification } from 'antd';
import { DeleteFilled, EditFilled, PlusCircleOutlined } from '@ant-design/icons';

import { useEffect, useState, useCallback } from 'react';

import { getData, sendData } from '../../utils/api';

const { Title, Text } = Typography;

const { Search } = Input;
const Galeri = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [dataSource, setDataSource] = useState([]);
  const [originalDataSource, setOriginalDataSource] = useState([]);

  useEffect(() => {
    getDataGallery();
  }, []);

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const getDataGallery = () => {
    getData('/api/natures')
      .then((resp) => {
        if (resp) {
          // tambahkan state penampung nya
          setDataSource(resp);
          setOriginalDataSource(resp);
        }
      })
      .catch((err) => console.log(err));
  };

  const onSearch = useCallback(
    (value) => {
      console.log('onSearch dipanggil dengan value:', value);
      const filteredData = originalDataSource.filter((item) => {
        const name = item.name_natures.toLowerCase().includes(value.toLowerCase());
        const description = item.description.toLowerCase().includes(value.toLowerCase());
        return name || description;
      });
      console.log('filteredData:', filteredData);
      setDataSource(filteredData);
    },
    [originalDataSource]
  );

  const [isDrawer, setIsDrawer] = useState(false);
  const onCloseDrawer = () => {
    setIsDrawer(false);
  };
  const handleDrawer = () => {
    setIsDrawer(true);
  };

  const handleSubmit = () => {
    let url = '/api/natures';
    let nameNatures = form.getFieldValue('name_natures');
    let description = form.getFieldValue('description');

    let formData = new FormData();
    formData.append('name_natures', nameNatures);
    formData.append('description', description);

    sendData(url, formData)
      .then((resp) => {
        if (resp?.datas) {
          getDataGallery();
          form.resetFields();
          onCloseDrawer();
          showAlert('success', 'Success', 'Data Submitted');
        } else {
          showAlert('error', 'Submit Failed', 'Data natures Not Submitted');
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert('error', 'Submit Failed', 'Something went wrong');
      });
  };

  const renderDrawer = () => {
    return (
      <Drawer
        title='Basic Drawer'
        onClose={onCloseDrawer}
        open={isDrawer}
        extra={
          <>
            <Button
              type='primary'
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </>
        }
      >
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
            label='Name Of Natures'
            name='name_natures'
            required
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
            required
          >
            <Input.TextArea Rows={3} />
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  return (
    <div className='layout-content'>
      {contextHolder}
      <Row
        gutter={[24, 16]}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Col
          xs={22}
          className='mb-24'
        >
          <Card
            bordered={false}
            className='criclebox h-full w-full'
          >
            <FloatButton
              onClick={() => handleDrawer()}
              tooltip={<div>Add Galery</div>}
              type='primary'
              icon={<PlusCircleOutlined />}
            />
            ;<Title>Nature Gallery</Title>
            {renderDrawer()}
            <Text style={{ fontSize: '12pt' }}>List of Natures</Text>
            <Divider />
            <Col style={{ marginBottom: 20 }}>
              <Search
                placeholder='input search text'
                allowClear
                enterButton='Search'
                size='large'
                onSearch={onSearch}
                onChange={(e) => {
                  onSearch(e.target.value);
                }}
              />
            </Col>
            <List
              grid={{ gutter: 16, xs: 1, xl: 3, sm: 1, md: 3, lg: 3 }}
              dataSource={dataSource}
              style={{ justifyContent: 'center', alignItems: 'center' }}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    style={{ width: 260 }}
                    cover={
                      <img
                        alt='data-nature'
                        src={item?.url_photo}
                      />
                    }
                  >
                    <Card.Meta
                      title={item?.name_natures}
                      description={item?.description}
                    />
                    <Divider></Divider>
                    <Flex
                      gap={70}
                      align='center'
                      justify='center'
                      gutter={16}
                    >
                      <EditFilled />
                      <Divider type='vertikal' />
                      <DeleteFilled />
                    </Flex>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Galeri;
