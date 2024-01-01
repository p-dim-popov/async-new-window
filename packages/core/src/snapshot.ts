export function Snapshot<T extends readonly unknown[]>(initialValue: [...T]) {
  let _snapshot = initialValue;

  return {
    calculate: (value: [...T]): T => {
      for (let i = 0; i < _snapshot.length - 1; i++) {
        if (_snapshot[i] !== value[i]) {
          _snapshot = value;
          break;
        }
      }

      return _snapshot;
    }
  }
}
