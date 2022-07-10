import ReactLoading from 'react-loading';

const LoadingOverlay = () => {
  return (
    <div className='absolute left-0 top-0 z-50 w-full min-h-screen flex justify-center items-center bg-gray-800 bg-opacity-30'>
      <ReactLoading type='spin' color='#fff' height={50} width={50} />
    </div>
  );
};

export default LoadingOverlay;
