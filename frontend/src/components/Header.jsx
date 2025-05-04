import React from "react";
import { useLocation, Link } from "react-router-dom";
import Logout from "./Auth/Logout";

const Header = ({ userName }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex justify-between items-center p-4 bg-teal-500 text-white">
      <h1 className="font-bold text-xl">
        <a href="/">Home</a>
      </h1>
      {userName && (
        <div className="text-lg font-semibold">Good to Go, {userName}</div>
      )}
      <nav>
        <ul className="flex space-x-4">
          {userName ? (
            <Logout />
          ) : (
            <>
              {currentPath !== "/signin" && (
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
              )}
              {currentPath !== "/signup" && (
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;