import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data }) => {
    const dispatch = useDispatch();
    const style = useMemo(() => ({ marginBottom: 20 }), []);
    const grid = useMemo(() => ({ gutter: 4, xs: 2, md: 3 }), []);
    const headerDiv = useMemo(() => (<div>{header}</div>), []);
    const loadMoreButton = useMemo(() => (<div style={{ textAlign: 'center', margin: '10px 0' }}><Button>더 보기</Button></div>), []);

    // 반복문 안에서 onClick이 있을때
    // 반복문 데이터를 넘겨줘야하는데, 이럴때는 고차함수를 사용해서 데이터를 넘겨줄 수 있다.
    const onCancel = (id) => () => {
        if(header === '팔로잉'){
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: id,
            });  
        }

        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: id,
        }); 
    };

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
                    <Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}>
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