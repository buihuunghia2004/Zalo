import useSocketEvent from './hooks/useSocket'
import { AppRoutes } from './Routes/routes'

export default function App() {

  useSocketEvent('received_relation_req', (data) => {
    console.log('Đã nhận được lời mời kết bạn', data)
  })
  useSocketEvent('accept_relation_req', (data) => {
    console.log('Lời mời kết bạn đã được chấp nhận', data)
  })

  return (
    <AppRoutes/>
  )
}
