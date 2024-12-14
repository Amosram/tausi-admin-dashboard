import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import axios from 'axios';

const AuthenticatedComponent = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const validateUserToken = () => {
    // if (!user.user) return navigate('/auth/login', { replace: true });
     
  };

  useEffect(() => {
    validateUserToken();
  }, []);


  return (
    <div/>
  );
};

export default AuthenticatedComponent;
