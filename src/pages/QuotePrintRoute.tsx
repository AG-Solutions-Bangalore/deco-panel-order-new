import { Navigate, useParams } from 'react-router-dom'
import { QuotePrintPage } from '@/modules/quotes/pages/quote-print-page'

export function QuotePrintRoute() {
  const { id } = useParams()

  if (!id) {
    return <Navigate to="/quotes" replace />
  }

  return <QuotePrintPage quoteId={id} />
}
