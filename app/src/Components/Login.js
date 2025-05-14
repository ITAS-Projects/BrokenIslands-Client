import { useNavigate } from "react-router-dom";
import { Descope } from "@descope/react-sdk";
import "../assets/Login.css";

export default function Login() {
  const navigate = useNavigate();

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