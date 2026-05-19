import { Navigate, useParams } from 'react-router-dom'
import { EditQuotePage } from '@/modules/quotes/pages/edit-quote-page'

export function EditQuoteRoute() {
  const { id } = useParams()

  if (!id) {
    return <Navigate to="/quotes" replace />
  }

  return <EditQuotePage quoteId={id} />
}
