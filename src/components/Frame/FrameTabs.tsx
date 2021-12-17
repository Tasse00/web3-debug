import { useFrameGroup } from '@/hooks/frames';
import React from 'react';
import { Card, Button, Col, Row } from 'antd';

import { CloseOutlined } from '@ant-design/icons';

const FrameTabs: React.FC = () => {
  const { frames, closeFrame, switchFrame } = useFrameGroup();

  return (
    <div style={{ width: '100%', overflow: 'auto', display: 'flex', }}>
      {frames.map((frame) => (
        <div key={frame.id} style={{ marginRight: 8 }}>
          <Card
            size="small"
            onClick={()=>switchFrame(frame.id)}
            // title={frame.title}
            // extra={
            //   <Button
            //     icon={<CloseOutlined />}
            //     type="text"
            //     onClick={() => closeFrame(frame.id)}
            //   />
            // }
          >
            <Row justify="space-between" align="middle">
              <Col>{frame.title}</Col>
              <Col>
                <Button
                  icon={<CloseOutlined />}
                  type="text"
                  onClick={() => closeFrame(frame.id)}
                />
              </Col>
            </Row>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default FrameTabs;
