import { ViewQuotePage } from "@/modules/quotes/pages/view-quote-page";

export const metadata = {
  title: "Quotation Details | Deco Panel",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ViewQuotePage quoteId={resolvedParams.id} />;
}
