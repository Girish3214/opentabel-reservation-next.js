import Header from "./components/Header";
import Form from "./components/Form";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export const metadata = {
  title: "Reservation | Open Table",
  description: "Generated by create next app",
};

const fetchRestaurantByName: any = async (name: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: name,
    },
  });
  if (!restaurant) {
    notFound();
  }
  return restaurant;
};
async function ReservationPage({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { date: string; partySize: string };
}) {
  const restaurant = await fetchRestaurantByName(params.name);
  return (
    <>
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <Header
            image={restaurant.main_image}
            name={restaurant.name}
            date={searchParams.date}
            partySize={searchParams.partySize}
          />
          <Form />
        </div>
      </div>
    </>
  );
}

export default ReservationPage;
