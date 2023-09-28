import React from "react";

const Alert = ({ type, message }: { type: string; message: string }) => {
  const alertClasses: any = {
    success: "bg-green-200 text-green-800",
    error: "bg-red-200 text-red-800",
    warning: "bg-yellow-200 text-yellow-800",
  };

  return (
    <div className={`p-2 mb-4 text-center rounded-md ${alertClasses[type]}`}>
      {message}
    </div>
  );
};

export default Alert;
