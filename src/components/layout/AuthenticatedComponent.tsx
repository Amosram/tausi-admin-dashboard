import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { signOutUser } from "@/redux/reducers/userSlice";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/Utils/constants";
import { useEffect } from "react";
import { checkIfUserIsAdmin } from "@/app/firebase/adminService";

const AuthenticatedComponent = () => {
  const { user, accessToken } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateUserToken = async () => {
    try {
      if (!user || !user.id || !accessToken) {
        dispatch(signOutUser());
        return navigate("/auth/login", { replace: true });
      }

      // Whitelist for the specific admin email - skip all checks
      if (user.email === "tausi-admin@tausiapp.com") {
        // Allow access without additional verification
        return;
      }

      // For all other users, check if they're an admin
      const isAdmin = await checkIfUserIsAdmin(user.id);
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive",
        });
        dispatch(signOutUser());
        return navigate("/auth/login", { replace: true });
      }

      // Then validate the token
      const response = await axios.post(`${API_URL}/auth/verify-access-token`, {
        userId: user.id,
        accessToken,
      });

      if (response.data.statusCode !== "SUCCESS") {
        dispatch(signOutUser());
        navigate("/auth/login", { replace: true });
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Token validation failed==========>", error);
      dispatch(signOutUser());
      navigate("/auth/login", { replace: true });
    }
  };

  useEffect(() => {
    validateUserToken();
  }, []);

  return <div />;
};

export default AuthenticatedComponent;
