export function SimpleEmitter() {
  const _listeners: Array<() => void> = [];

  const addListener = (listener: () => void) => {
    _listeners.push(listener);
    return () => removeListener(listener);
  }

  const removeListener = (listener: () => void) => {
    const index = _listeners.indexOf(listener);
    if (!~index) {
      _listeners.splice(index, 1);
    }
  }

  const emit = () => {
    _listeners.forEach(listener => listener());
  }

  return {
    addListener,
    removeListener,
    emit,
  }
}
