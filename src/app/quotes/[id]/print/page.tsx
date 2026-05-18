import { QuotePrintPage } from "@/modules/quotes/pages/quote-print-page";

export const metadata = {
  title: "Print Quote | Deco Panel",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <QuotePrintPage quoteId={resolvedParams.id} />;
}
