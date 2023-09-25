import { Review } from "@prisma/client";

function calculateAvrRating(reviews:Review[]) {
  if(!reviews.length) return 0;
    return (reviews.reduce((acc, curr) => {
    return acc+ curr.rating
  }, 0) / reviews.length)
}

export default calculateAvrRating