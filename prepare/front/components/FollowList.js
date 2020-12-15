import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';

const FollowList = ({ header, data }) => {
    const style = useMemo(() => ({ marginBottom: 20 }), []);
    const grid = useMemo(() => ({ gutter: 4, xs: 2, md: 3 }), []);
    const headerDiv = useMemo(() => (<div>{header}</div>), []);
    const loadMoreButton = useMemo(() => (<div style={{ textAlign: 'center', margin: '10px 0' }}><Button>더 보기</Button></div>), []);

    return(
        <List 
            style={style}
            grid={grid}
            size="small"
            header={headerDiv}
            loadMore={loadMoreButton}
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item style={{ marginTop: 20 }}>
                    <Card actions={[<StopOutlined key="stop" />]}>
                        <Card.Meta description={item.nickname} />
                    </Card>
                </List.Item>
            )}
        />
    );
};

FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
};

export default FollowList;