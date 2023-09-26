import Link from "next/link";
import React from "react";
import Modal from "./Modal";

function NavBar() {
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        <div className="flex">
          <Modal isSignIn={true} />
          <Modal isSignIn={false} />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
