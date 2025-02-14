import AxiosInstant from '../config/axiosInstant'


const sentMessage = async (data) => {
  try {
    return await AxiosInstant.post('messages',data)
  } catch (error) {
    console.log('lỗi',error);
    
  }
}

const messageAPI = {
  sentMessage
}

export default messageAPI