import Stars from "@/app/components/Stars";
import calculateAvrRating from "@/app/utils/calculateAvrRating";
import { Review } from "@prisma/client";
import React from "react";

function Ratings({ reviews }: { reviews: Review[] }) {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <Stars reviews={reviews} />
        <p className="text-reg ml-3">{calculateAvrRating(reviews)}</p>
      </div>
      <div>
        <p className="text-reg ml-4">
          {reviews.length} Review{reviews.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

export default Ratings;
