import { useNavigate } from "react-router-dom";
import { Descope, useSession } from "@descope/react-sdk";
import { useEffect } from "react";
import "../assets/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="root">
      <div className="login-container">
        <div className="btn-container">
          <Descope
            flowId="sign-in"
            theme="light"
            onSuccess={() => {
              navigate("/");
            }}
            onError={(err) => {
              alert("Error: " + err.detail.message);
            }}
          />
        </div>
      </div>
    </div>
  );
}