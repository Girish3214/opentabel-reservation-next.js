"use client";
import Link from "next/link";
import React from "react";
import Modal from "./Modal";
import { useGlobalContext } from "../store/AuthContext";

function NavBar() {
  const { data, loading } = useGlobalContext();
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button className="bg-blue-400 text-white border p-1 px-4 rounded mr-3">
                Logout
              </button>
            ) : (
              <>
                <Modal isSignIn={true} />
                <Modal isSignIn={false} />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
