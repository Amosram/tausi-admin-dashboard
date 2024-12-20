import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { signOutUser } from "@/redux/reducers/userSlice";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/Utils/constants";
import { useEffect } from "react";

const AuthenticatedComponent = () => {
  const { user, accessToken } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const validateUserToken = async () => {
    try {
      if (!user || !user.id || !accessToken) {
        dispatch(signOutUser());
        return navigate("/auth/login", { replace: true });
      }

      const response = await axios.post(`${API_URL}/auth/verify-access-token`, {
        userId: user.id,
        accessToken,
      });

      if (response.data.statusCode != "SUCCESS") {
        dispatch(signOutUser());
        navigate("/auth/login", { replace: true });
        toast.toast({
          title: "Authorized",
          description: "You are authorized to access this page.",
          variant: "success",
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
