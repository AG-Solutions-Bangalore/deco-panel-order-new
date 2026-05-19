import { Navigate, useParams } from 'react-router-dom'
import { CreateQuotePage } from '@/modules/quotes/pages/create-quote-page'

export function CreateQuoteRoute() {
  const { id } = useParams()

  if (!id) {
    return <Navigate to="/" replace />
  }

  return <CreateQuotePage orderId={id} />
}
