// components/common/LoadingSpinner.js
const LoadingSpinner = () => (
    <div className="loading active fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-customGreen"></div>
      <img 
        src="/images/image.png" 
        className="absolute h-24 w-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
        alt="Loading"
      />
    </div>
  );
  
  export default LoadingSpinner;
  