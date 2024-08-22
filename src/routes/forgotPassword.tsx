
const ForgotPassword: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-white text-center">
      <div className="w-full h-24 bg-gray-900"></div>
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
        <h1 className="text-4xl font-bold mb-2">Forgot Password</h1>
        <h2 className="text-sm text-gray-500">Enter your email address below and we'll send you a link to</h2>
        <h3 className="text-sm text-gray-500 mb-5">reset your password.</h3>
        <div className="w-full max-w-lg bg-white p-8 rounded-lg border border-gray-300">
          <label htmlFor="email" className="block text-sm mb-2 text-left">Email</label>
          <input type="email" id="email" className="w-full p-2 text-base border border-gray-300 rounded mb-10" placeholder="Enter your email" />
          <button className="reset-button">Reset Password</button>
        </div>
      </div>
      <div className="w-full h-24 bg-gray-900"></div>
    </div>
  );
};

export default ForgotPassword;
