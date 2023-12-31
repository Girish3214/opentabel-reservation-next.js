import Header from "./components/Header";
import SearchSidebar from "./components/SearchSidebar";
import RestaurantCard from "./components/RestaurantCard";
import type { Metadata } from "next";
import { PRICE, PrismaClient } from "@prisma/client";

export const metadata: Metadata = {
  title: "Search | Open Table",
  description: "Generated by create next app",
};

interface searchParamsType {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}
const prisma = new PrismaClient();

const fetchRestaurantsByLocation = async (searchParams: searchParamsType) => {
  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLocaleLowerCase(),
      },
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cusine = {
      name: {
        equals: searchParams.cuisine?.toLocaleLowerCase(),
      },
    };
    where.cuisine = cusine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    location: true,
    price: true,
    cuisine: true,
    slug: true,
    reviews: true,
  };
  const restaurants = await prisma.restaurant.findMany({
    where,
    select,
  });
  return restaurants;
};

const fetchLocations = async () => {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return locations;
};

const fetchCusines = async () => {
  const cuisines = await prisma.cuisine.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return cuisines;
};
async function SearchPage({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const restaurants = await fetchRestaurantsByLocation(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCusines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>Sorry, we found no restaurants in {searchParams.city}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
