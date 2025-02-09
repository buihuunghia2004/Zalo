import AxiosInstant from '../config/axiosInstant'

const loadMoreMessage = async (data) => {
  try {
    const {roomId, afterCursor} = data
    
    let query = `roomId=${roomId}`    
    if (afterCursor) {
      query += `&afterCursor=${afterCursor}`
    }    
    const result = await AxiosInstant.get(`messages?`+query)
    return result
    
  } catch (error) {
    
  }
}

const sentMessage = async (data) => {
  try {
    return await AxiosInstant.post('messages',data)
  } catch (error) {
    console.log('lỗi',error);
    
  }
}

const messageAPI = {
  loadMoreMessage,
  sentMessage
}

export default messageAPI