import AxiosInstant from '../config/axiosInstant'

const getAllRelationsRequestAPI = async (status) => {
  try {
    return await AxiosInstant.get(`relations?status=${status}`)
  } catch (error) {
    
  }
}

const unFriendAPI = async (id) => {
  try {
    return await AxiosInstant.delete(`relations/${id}`)
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

const relationAPI = {
  sendRequestAddFriendAPI,
  handleRequestAddFriendAPI,
  getAllRelationsRequestAPI,
  unFriendAPI
}

export default relationAPI