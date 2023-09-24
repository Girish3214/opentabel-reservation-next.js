import { PRICE } from "@prisma/client";
import Link from "next/link";

interface PropsTypes {
  id: number;
  name: string;
}

interface searchParamsType {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

function SearchSidebar({
  locations,
  cuisines,
  searchParams,
}: {
  locations: PropsTypes[];
  cuisines: PropsTypes[];
  searchParams: searchParamsType;
}) {
  const prices = [
    {
      price: PRICE.CHEAP,
      label: "$",
      classNames: "rounded-l",
    },
    {
      price: PRICE.REGULAR,
      label: "$$",
      classNames: "",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
      classNames: "rounded-r",
    },
  ];
  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: location.name,
              },
            }}
            key={location.id}
            className="font-light text-reg capitalize"
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: cuisine.name,
              },
            }}
            key={cuisine.id}
            className="font-light text-reg capitalize"
          >
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map((price) => (
            <Link
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: price.price,
                },
              }}
              className={`text-center border w-full text-reg font-light p-2 ${price.classNames}`}
            >
              {price.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchSidebar;
