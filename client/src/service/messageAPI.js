import AxiosInstant from '../config/axiosInstant'

const loadMoreMessage = async (data) => {
  try {
    const {roomId} = data
    let query = `roomId=${roomId}`
    // if (roomId) {
    //   query += 'roomId='
    // }
    const result = await AxiosInstant.get(`messages?`+query)
    console.log('mess',result);
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