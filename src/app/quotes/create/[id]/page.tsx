import { CreateQuotePage } from "@/modules/quotes/pages/create-quote-page";

export const metadata = {
  title: "Create Quotation | Deco Panel",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CreateQuotePage orderId={resolvedParams.id} />;
}
