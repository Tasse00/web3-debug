import { useFrameGroup } from '@/hooks/frames';
import { Card } from 'antd';
import React from 'react';
import { history } from 'umi';
import ERC721Debug from './ERC721Debug';

const Dashboard: React.FC<{}> = (props) => {
  const { createFrame } = useFrameGroup();
  return (
    <>
      <Card
        hoverable
        onClick={() => {
          createFrame(
            {
              title: 'ERC721 Debug',
              component: <ERC721Debug />,
            },
            true,
          );
        }}
      >
        New ERC721 Debug
      </Card>
    </>
  );
};

export default Dashboard;
