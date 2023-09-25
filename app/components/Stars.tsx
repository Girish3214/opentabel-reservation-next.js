import Image from "next/image";
import { Review } from "@prisma/client";

import EmptyStar from "../../public/icons/empty-star.png";
import FullStar from "../../public/icons/full-star.png";
import HalfStar from "../../public/icons/half-star.png";
import calculateAvrRating from "../utils/calculateAvrRating";

function Stars({ reviews, rating }: { reviews: Review[]; rating?: number }) {
  const reviewRating = rating || calculateAvrRating(reviews);
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const diff = parseFloat((reviewRating - i).toFixed(1));
      if (diff >= 1) stars.push(FullStar);
      else if (diff < 1 && diff > 0) {
        if (diff <= 0.2) stars.push(EmptyStar);
        else if (diff > 0.2 && diff <= 0.6) stars.push(HalfStar);
        else stars.push(FullStar);
      } else stars.push(EmptyStar);
    }
    return stars.map((star) => {
      return <Image src={star} alt="" className="w-4 h-4 mr-1" />;
    });
  };
  return <div className="flex items-center">{renderStars()}</div>;
}

export default Stars;
