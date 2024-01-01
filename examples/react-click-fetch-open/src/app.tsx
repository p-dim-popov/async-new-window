import { LazyLink } from './lazy-link.tsx';

function App() {
  return (
    <>
      <h1>
        <LazyLink
          url={() => sleep().then(() => 'https://vitejs.dev')}
          loadingView={<h1>loading...</h1>}
        >
          Vite
        </LazyLink>
        +
        <LazyLink
          url={() => sleep().then(() => 'https://react.dev')}
          loadingView="loading..."
          target="ReactWindow"
        >
          React
        </LazyLink>
      </h1>
      <h2>
        with the help of{' '}
        <LazyLink
          url="https://google.com"
          target="GoogleWindow"
        >
          Google
        </LazyLink>
        {' '}and{' '}
        <LazyLink
          url="https://stackoverflow.com"
          target="StackOverflowWindow"
          loadingView="stackoverflow loading..."
        >
          StackOverflow
        </LazyLink>
      </h2>
      <p>Click on the links to test</p>
    </>
  );
}

export default App;

const sleep = (timeoutMs = 1000) => new Promise((resolve) => setTimeout(resolve, timeoutMs));
