import Header from "./components/Header";

function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  return (
    <main>
      <Header name={params.name} />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        {children}
      </div>
    </main>
  );
}

export default RestaurantLayout;
