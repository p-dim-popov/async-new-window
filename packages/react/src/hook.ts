import {
  isValidElement as isValidReactElement,
  ReactElement,
  useEffect, useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {AsyncNewWindow, InitiateWindowOptions, LoadingView, WindowOptions} from "async-new-window-core";
import ReactDom, {flushSync as reactDomFlushSync} from "react-dom";
import ReactDomClient from "react-dom/client";

type ReactLoadingView = LoadingView | ReactElement;

type ReactAsyncWindowOptions = Omit<WindowOptions, 'loadingView'> & {
  loadingView?: ReactLoadingView;
}

type ReactInitiateWindowOptions = Omit<ReactAsyncWindowOptions, 'url'>;

type ReactAsyncNewWindow = {
  hasFailed: boolean;

  initiate: (options?: ReactInitiateWindowOptions) => void;
  navigate: (url?: string) => void;
}

export function useAsyncNewWindow(options: ReactAsyncWindowOptions): ReactAsyncNewWindow {
  const coreOptions =  {
    ...options,
    loadingView: isValidReactElement(options?.loadingView)
      ? parseReactElementLoadingView.bind(null, options.loadingView)
      : options?.loadingView as LoadingView | undefined,
  }

  const [store] = useState(() => new AsyncNewWindow(coreOptions))

  useEffect(() => {
    store.windowOptions = coreOptions
  }, [coreOptions]);

  useSyncExternalStore(store.subscribe, store.getSnapshot)

  return useMemo(() => ({
    hasFailed: store.hasFailed,
    initiate: (options) => {
      const dynamicOptions: InitiateWindowOptions = {
        ...options,
        loadingView: isValidReactElement(options?.loadingView)
          ? parseReactElementLoadingView.bind(null, options.loadingView)
          : options?.loadingView as LoadingView | undefined,
      }

      store.initiate(dynamicOptions)
    },
    navigate: store.navigate,
  }), [store]);
}

const parseReactElementLoadingView = (loadingView: ReactElement): string => {
  const div = document.createElement('div');
  reactRenderSync(loadingView, div);
  return div.innerHTML;
}

const reactRenderSync = (reactElement: ReactElement, container: HTMLElement) => reactDomFlushSync(() => reactRender(reactElement, container));

const reactRender = ((): (element: ReactElement, container: HTMLElement) => void => {
  if ('createRoot' in ReactDomClient && typeof ReactDomClient.createRoot === 'function') {
    const reactCreateRoot = ReactDomClient.createRoot
    return (element, container) => reactCreateRoot(container)
      .render(element);
  }

  return (element, container) => ReactDom.render(element, container);
})();
