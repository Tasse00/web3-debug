import React from 'react';
import { FrameGroupContext } from '@/components/Frame/FrameGroup';

export function useFrameGroup() {
  return React.useContext(FrameGroupContext);
}
