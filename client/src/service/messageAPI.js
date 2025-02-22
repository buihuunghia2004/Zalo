import AxiosInstant from '../config/axiosInstant'


const messageUrl = 'messages'

const sentMessage = async (data) => {
  try {
    return await AxiosInstant.post('messages',data)
  } catch (error) {
    console.log('sentMessage error: ',error.message);
    
  }
}

const loadMoreMessagesAPI = async ({roomId, afterCursor, beforeCursor}) => {
  try {
    let q = `${messageUrl}?roomId=${roomId}`
    if (afterCursor) q += `&afterCursor=${afterCursor}`
    if (beforeCursor) q += `&beforeCursor=${beforeCursor}` 
    console.log('cccc');
         
    const result =  await AxiosInstant.get(q)
    return {
      ...result,
      load: beforeCursor ? 'new' : 'old'
    }
  } catch (error) {
    console.log('loadMoreMessagesAPI error: ',error.message);
  }
}

const messageAPI = {
  sentMessage,
  loadMoreMessagesAPI
}

export default messageAPI