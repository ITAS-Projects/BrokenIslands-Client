import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Logout() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(true);

  useEffect(() => {
      if(Cookies.get("access_token") == undefined) {
          setIsLoggedin(false);
      } else {
        Cookies.remove("access_token");
      }
  }, []);

  useEffect(() => {
    if (!isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <div className="root">
      <h1>Logging Out...</h1>
    </div>
  );
}