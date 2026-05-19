import { Navigate, useParams } from 'react-router-dom'
import { ViewQuotePage } from '@/modules/quotes/pages/view-quote-page'

export function ViewQuoteRoute() {
  const { id } = useParams()

  if (!id) {
    return <Navigate to="/quotes" replace />
  }

  return <ViewQuotePage quoteId={id} />
}
