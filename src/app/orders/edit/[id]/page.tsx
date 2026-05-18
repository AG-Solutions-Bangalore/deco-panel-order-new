import EditOrderForm from "@/modules/orders/components/EditOrderForm";

export const metadata = {
  title: "Edit Order | Deco Panel",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <EditOrderForm orderId={resolvedParams.id} />
    </div>
  );
}
