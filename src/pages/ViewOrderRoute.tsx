import { useParams } from 'react-router-dom'
import ViewOrderDetails from '@/modules/orders/components/ViewOrderDetails'

export function ViewOrderRoute() {
  const { id } = useParams()

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <ViewOrderDetails orderId={id} />
    </div>
  )
}
