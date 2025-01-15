import AxiosInstant from '../config/axiosInstant'

const loadMoreMessage = async (data) => {
  try {
    const {roomId} = data
    let query = `roomId=${roomId}`
    // if (roomId) {
    //   query += 'roomId='
    // }
    return await AxiosInstant.get(`messages?`+query)
  } catch (error) {
    
  }
}

const sentMessage = async ({receiverId, roomId, content, contentType}) => {
  try {
    return await AxiosInstant.post('messages',{
      receiverId,
      roomId,
      content,
      contentType
    })
  } catch (error) {
    console.log('lỗi',error);
    
  }
}

const messageAPI = {
  loadMoreMessage,
  sentMessage
}

export default messageAPI