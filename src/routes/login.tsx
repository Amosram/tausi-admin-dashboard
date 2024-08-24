import React, { useState } from "react";
import ImageOfGirl from "../assets/tausi-girl.avif";
import TausiLogo from "../assets/Artboard 1 copy 9.png";
import ShowPasswordIcon from "../assets/show.png";
import HidePasswordIcon from "../assets/icons8-hide-password-50.png";
import { createFileRoute } from "@tanstack/react-router";

const login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side with the girl image */}
      <div className="w-1/2 h-full">
        <img
          src={ImageOfGirl}
          alt="Image of a girl"
          className="w-full h-full object-cover rounded-tr-3xl rounded-br-3xl"
        />
      </div>

      {/* Right side with the logo and form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-12">
        <img src={TausiLogo} alt="Tausi Logo" className="w-32 mb-8" />
        <h1 className="text-2xl font-semibold mb-4">Login To Your Account</h1>
        <h2 className="text-sm text-gray-500 text-center mb-6">
          Enter Your Email Address And Password To Access Admin Panel.
        </h2>
        <form className="flex flex-col w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="relative w-full mb-4">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <img
              src={passwordVisible ? ShowPasswordIcon : HidePasswordIcon}
              alt="Toggle Password"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="flex items-center mb-6">
            <input type="checkbox" id="remember-me-checkbox" className="mr-2" />
            <label htmlFor="remember-me-checkbox" className="text-sm">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <h4 className="text-sm text-gray-500">Forgot Your Password?</h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: login,
});
