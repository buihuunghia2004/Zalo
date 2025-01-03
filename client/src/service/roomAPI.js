import AxiosInstant from '../config/axiosInstant'

const getAllRoomAPI = async () => {
  try {
    return await AxiosInstant.get('rooms')
  } catch (error) {
    
  }
}

const sendRequestAddFriendAPI = async (data) => {
  try {
    return await AxiosInstant.post('relations/sent-request', data)
  } catch (error) {
    
  }
}

const handleRequestAddFriendAPI = async (data) => {
  try {
    return await AxiosInstant.post('relations/handle-request', data)
  } catch (error) {
    
  }
}

const roomAPI = {
  getAllRoomAPI
}

export default roomAPI