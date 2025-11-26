import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToSubscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/subscription", { replace: true });
  }, [navigate]);

  return null;
};

export default RedirectToSubscription;
