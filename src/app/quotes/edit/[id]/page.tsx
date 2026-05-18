import { EditQuotePage } from "@/modules/quotes/pages/edit-quote-page";

export const metadata = {
  title: "Edit Quotation | Deco Panel",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EditQuotePage quoteId={resolvedParams.id} />;
}
