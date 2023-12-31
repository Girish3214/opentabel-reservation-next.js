import React from "react";
import Header from "./components/Header";

function Loading() {
  return (
    <main>
      <Header />
      <div className="py-3 px-3 mt-10 flex flex-wrap justify-center">
        {Array.from(Array(10).keys()).map((i) => (
          <div
            key={i}
            className="animate-pulse bg-slate-200 w-64 h-72 rounded overflow-hidden border cursor-pointer m-3"
          ></div>
        ))}
      </div>
    </main>
  );
}

export default Loading;
