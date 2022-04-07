import Error from 'next/error';
import styled from 'styled-components';

const ErrorWrapper = styled(Error)`
  background: black;
`;
export default function Custom404() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-center text-black">
      <div>
        <h1 className="m-0 mr-5 inline-block align-top text-2xl font-medium">404</h1>
        <div className="flex h-12 items-center text-left align-middle">
          <h2 className="m-0 p-0 text-sm font-normal">This page could not be found</h2>
        </div>
      </div>
    </div>
  );
}
