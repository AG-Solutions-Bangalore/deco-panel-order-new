import { useParams } from 'react-router-dom'
import { ViewQuotePage } from '@/modules/quotes/pages/view-quote-page'

export function ViewQuoteRoute() {
  const { id } = useParams()

  return <ViewQuotePage quoteId={id} />
}
