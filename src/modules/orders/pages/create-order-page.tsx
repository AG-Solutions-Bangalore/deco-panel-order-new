import CreateOrderForm from "../components/CreateOrderForm";

export function CreateOrderPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <CreateOrderForm />
    </div>
  );
}
