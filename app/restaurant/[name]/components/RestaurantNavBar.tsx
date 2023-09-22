import Link from "next/link";
import React from "react";

function RestaurantNavBar() {
  return (
    <nav className="flex text-reg border-b pb-2">
      <Link href="/restaurant/milstones-grill" className="mr-7">
        Overview
      </Link>
      <Link href="/restaurant/milstones-grill/menu" className="mr-7">
        Menu
      </Link>
    </nav>
  );
}

export default RestaurantNavBar;
