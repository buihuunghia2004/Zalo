import ConversationList from './chatPage/ConversationList'
import { Outlet } from 'react-router-dom'

const ChatPage = () => {
  console.log('re-render-ChatPage');

  return (
    <div className="flex size-full flex-row overflow-hidden">
      {/* danh sách hội thoại */}
      <ConversationList/>
      <div className='w-0.5 h-full bg-slate-400'/>
      {/* hội thoại */}
      <Outlet/>
    </div>
  )
}

export default ChatPage