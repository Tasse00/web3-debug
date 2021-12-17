import storage from '@/storage';
import React from 'react';

interface CachedValue<T> {
  value: T;
  update: (v: T) => void;
}

export function useCachedState<T>(
  key: string,
  defaultValue: T,
): [T, (v: T) => void] {
  const [value, setValue] = React.useState(() =>
    storage.get(key, defaultValue),
  );

  React.useEffect(() => {
    setValue(storage.get(key, defaultValue));
  }, [key]);

  const update = React.useCallback(
    (v: T) => {
      setValue(v);
      storage.set(key, v);
    },
    [key],
  );
  return [value, update];
}
