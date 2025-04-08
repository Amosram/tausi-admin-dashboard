import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/reducers/userSlice";
import { TausiUser } from "@/models/user";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/app/firebase";
import { checkIfUserIsAdmin } from "@/app/firebase/adminService";
import { useToast } from "@/hooks/use-toast";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    
    onSubmit: async (values) => {
      try {
        setErrorMessage("");
        setPersistence(auth, browserSessionPersistence).then(async () => {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              values.email,
              values.password
            );
    
            const firebaseUser = userCredential.user;
            
            // Check if user is an admin
            const isAdmin = await checkIfUserIsAdmin(firebaseUser.uid);
            
            if (!isAdmin) {
              setErrorMessage("You don't have permission to access the admin dashboard");
              await auth.signOut();
              return;
            }
            
            const accessToken = await firebaseUser.getIdToken(); // Get Firebase access token
    
            const tausiUser: TausiUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              createdAt: new Date(),
              deactivatedAt: null,
              deactivatedBy: null,
              deactivatedReason: null,
              deletedAt: null,
              deletedReason: null,
              emailVerified: false,
              fcmToken: "",
              isActive: false,
              isDeleted: false,
              latitude: "",
              locationAddress: "",
              longitude: "",
              phoneNumber: "",
              phoneVerified: false,
              profilePicturePath: "",
              profilePictureUrl: "",
              updatedAt: undefined,
              sessionData: undefined,
              professional: undefined
            };
    
            // Dispatch user and access token
            dispatch(setUser({ user: tausiUser, accessToken, refreshToken: "" }));
            toast({
              title: "Login successful",
              description: "Welcome to Tausi Admin Dashboard",
              variant: "success",
            });
            navigate("/");
          } catch (error: any) {
            console.error("Login failed", error);
            setErrorMessage(error.message || "Login failed. Please try again.");
          }
        });
      } catch (error: any) {
        console.error("Login failed", error);
        setErrorMessage(error.message || "Login failed. Please try again.");
      }
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side with image */}
      <div className="w-1/2 h-full">
        <img
          src="/tausi-girl.avif"
          alt="Login Illustration"
          className="w-full h-full object-cover rounded-tr-3xl rounded-br-3xl"
        />
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-card p-12">
        <img src="/tausi-logo.png" alt="Tausi Logo"
          className="w-32 mb-8" />
        <h1 className="text-2xl font-semibold mb-4">Login to Your Account</h1>
        <form onSubmit={formik.handleSubmit} className="flex flex-col w-full max-w-sm">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <div className="relative w-full mb-4">
            <Input
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
            <img
              src={passwordVisible ? "/show.png" : "/icons8-hide-password-50.png"}
              alt="Toggle Password"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <Button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 dark:bg-blue-700 dark:hover:bg-gray-800"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
