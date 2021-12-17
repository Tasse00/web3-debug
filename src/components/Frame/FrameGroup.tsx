import React from 'react';
import TopSideContent from '../Layouts/TopSideContent';
import Frame from './Frame';
import FrameTabs from './FrameTabs';

const FrameGroup: React.FC<{
  initialFrames?: FrameConfig[];
}> = ({ initialFrames = [] }) => {
  const [currFrameId, setCurrFrameId] = React.useState(
    initialFrames.length > 0 ? initialFrames[0].id : '',
  );
  const [frames, setFrames] = React.useState<FrameConfig[]>(initialFrames);

  const switchFrame = React.useCallback((id: string) => {
    setCurrFrameId(id);
  }, []);
  const createFrame = React.useCallback(
    (
      frameConfig: {
        id?: string;
        title: string;
        component: React.ReactElement;
        closable?: boolean;
      },
      autoSwith?: boolean,
    ) => {
      const id = frameConfig.id || generateFrameId();
      setFrames([...frames, { ...frameConfig, id }]);
      if (!!autoSwith) {
        setCurrFrameId(id);
      }
    },
    [frames],
  );
  const closeFrame = React.useCallback(
    (id: string) => {
      const idx = frames.findIndex((f) => f.id === id);

      if (idx > -1) {
        if (currFrameId === frames[idx].id) {
          if (idx < frames.length - 1) {
            switchFrame(frames[idx + 1].id);
          } else if (idx > 0) {
            switchFrame(frames[idx - 1].id);
          } else {
            switchFrame('');
          }
        }
        frames.splice(idx, 1);
        setFrames([...frames]);
      }
    },
    [frames, currFrameId],
  );
  const setFrameTitle = React.useCallback(
    (id: string, title: string) => {
      const idx = frames.findIndex((f) => f.id === id);
      if (idx > -1) {
        frames[idx].title = title;
        setFrames([...frames]);
      }
    },
    [frames],
  );
  // TODO: 为了保留各Frame状态,所有frame都渲染. 但是只显示当前Frame.
  // ----: 通过width来控制?

  const currFrame = React.useMemo(() => {
    return frames.find((f) => f.id === currFrameId) || null;
  }, [frames, currFrameId]);
  return (
    <FrameGroupContext.Provider
      value={{
        frames,
        currFrame,
        switchFrame,
        closeFrame,
        createFrame,
        setFrameTitle,
      }}
    >
      <TopSideContent
        style={{ width: '100%', height: '100%' }}
        top={<FrameTabs />}
        content={
          <div style={{ display: 'flex', minHeight: '100%' }}>
            {frames.map((frame) => (
              <div
                key={frame.id}
                style={{
                  width: currFrameId === frame.id ? '100%' : 0,
                  // transition: 'all 0.3s',
                  overflow: 'hidden',
                }}
              >
                <Frame config={frame} />
              </div>
            ))}
          </div>
        }
      />
    </FrameGroupContext.Provider>
  );
};

// 1. create tab
// 2. tab provider
// 3. components can use tab provider change any thing

interface FrameGroupContextValue {
  // 切换当前的Frame
  switchFrame: (id: string) => void;
  // 创建Frame
  createFrame: (
    frameConfig: { id?: string; title: string; component: React.ReactElement, closable?: boolean },
    autoSwith?: boolean,
  ) => void;
  // 关闭Frame
  closeFrame: (id: string) => void;
  setFrameTitle: (id: string, title: string) => void;
  // 所有的Frame
  frames: FrameConfig[];
  currFrame: FrameConfig | null;
}
export const FrameGroupContext = React.createContext<FrameGroupContextValue>({
  switchFrame: () => {},
  createFrame: () => {},
  closeFrame: () => {},
  setFrameTitle: () => {},
  frames: [],
  currFrame: null,
});

export interface FrameConfig {
  id: string;
  title: string;
  closable?: boolean;
  component: React.ReactElement;
}

function generateFrameId(): string {
  return Math.random().toString();
}

export default FrameGroup;
