import { useParams } from 'react-router-dom'
import { EditQuotePage } from '@/modules/quotes/pages/edit-quote-page'

export function EditQuoteRoute() {
  const { id } = useParams()

  return <EditQuotePage quoteId={id} />
}
