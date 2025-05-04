import React from "react";

const Home = () => {
  const userName = localStorage.getItem("schedulerUserName");
  const isLoggedIn = userName !== null;
  return (
    <div>
      <h1 className="text-center text-4xl font-semibold mt-12">
      Simplify your workflow-start now!{" "}
      </h1>
      <p className="text-center text-lg my-6 w-2/3 mx-auto">
      "Start creating, start innovating—let’s go!"
      </p>
      <div className="flex justify-center mt-8">
        <a
          href={isLoggedIn ? "/sequence" : "/signin"}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-red-500 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;