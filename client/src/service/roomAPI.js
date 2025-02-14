import AxiosInstant from '../config/axiosInstant'

const getAllRoomAPI = async () => {
  try {
    return await AxiosInstant.get('rooms')
  } catch (error) {
    
  }
}

const getAllGroupAPI = async () => {
  try {
    return await AxiosInstant.get('rooms/groups')
  } catch (error) {
    
  }
}

const getRoomIdByUserIdAPI = async (partnerId) => {
  try {
    return await AxiosInstant.get(`rooms/partner/${partnerId}`)
  } catch (error) {
    
  }
}

// const getRoomByIdAPI = async (id) => {
//   try {
//     return await AxiosInstant.get(`rooms/${id}`)
//   } catch (error) {
    
//   }
// }

const createNewGroupdAPI = async (data) => {
  try {
    return await AxiosInstant.post(`rooms/groups`,data)
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
  getAllRoomAPI,
  // getRoomByIdAPI,
  getRoomIdByUserIdAPI,
  getAllGroupAPI,
  createNewGroupdAPI
}

export default roomAPI