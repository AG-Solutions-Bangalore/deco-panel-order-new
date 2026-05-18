import ViewOrderDetails from "@/modules/orders/components/ViewOrderDetails";

export const metadata = {
  title: "View Order | Deco Panel",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <ViewOrderDetails orderId={resolvedParams.id} />
    </div>
  );
}
