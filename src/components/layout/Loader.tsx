import { RingLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <RingLoader
        color="#f73a0b"
        size={40}
        loading={true}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default Loader;
