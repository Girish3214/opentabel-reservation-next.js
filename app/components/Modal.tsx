"use client";
import React, { useState } from "react";
import FormInputs from "./FormInputs";

const Modal = ({ isSignIn }: { isSignIn: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <button
        className={`${
          isSignIn ? "bg-blue-400 text-white" : ""
        }  border p-1 px-4 rounded mr-3`}
        onClick={openModal}
      >
        {isSignIn ? "Sign in" : "Sign up"}
      </button>

      <div
        className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 ${
          isModalOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 cursor-pointer"
          onClick={closeModal}
        ></div>
        <div className="bg-white rounded-lg p-8 z-10">
          {/* Your modal content */}
          <h2 className="text-xl font-bold text-center pb-2 border-b mb-4 uppercase ">
            {isSignIn ? "Sign in" : "Create Account"}
          </h2>
          <div>
            <FormInputs
              inputs={inputs}
              handleInputChange={handleInputChange}
              isSignIn={isSignIn}
            />
            <button className="uppercase bg-red-600  w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400">
              {isSignIn ? "Sign In" : "Create Account"}
            </button>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
