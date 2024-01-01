import {FunctionComponent, ReactElement, ReactNode} from 'react';
import {useAsyncNewWindow} from 'react-async-new-window';

type Props = {
  url: string | (() => string) | (() => Promise<string>);
  loadingView?: ReactElement | string;
  children: ReactNode;
  target?: string;
};

export const LazyLink: FunctionComponent<Props> = ({ url, children, loadingView, target }) => {
  const asyncNewWindow = useAsyncNewWindow({ loadingView, target });
  console.log('render', url.toString(), asyncNewWindow)

  return (
    <span
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={async (event) => {
        console.log('click', asyncNewWindow)
        event.preventDefault();
        asyncNewWindow.initiate();
        resolveUrl(url).then(asyncNewWindow.navigate);
      }}
    >
      {children}
    </span>
  );
};

async function resolveUrl(url: string | (() => string) | (() => Promise<string>)) {
  if (typeof url === 'function') {
    return await url();
  }
  return url;
}
