import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SequenceBuilder from "./pages/SequenceBuilder";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Home from "./pages/Home";
const App = () => {
  const userName = localStorage.getItem("schedulerUserName");
  const isLoggedIn = userName !== null;
  return (
    <Router>
      <Header userName={userName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sequence"
          element={isLoggedIn ? <SequenceBuilder /> : <Home />}
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;