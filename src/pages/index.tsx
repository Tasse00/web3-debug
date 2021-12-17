import FrameGroup from '@/components/Frame/FrameGroup';
import Dashboard from '@/frames/Dashboard';
import React from 'react';

const Frames: React.FC<{}> = (props) => {
  return (
    <FrameGroup
      initialFrames={[
        {
          id: 'dashboard',
          title: 'Dashboard',
          component: <Dashboard />,
        },
      ]}
    />
  );
};

export default Frames;
