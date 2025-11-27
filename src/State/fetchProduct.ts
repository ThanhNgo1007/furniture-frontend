import axios from 'axios'
import { API_BASE_URL } from '../config/Api'

const api = `${API_BASE_URL}/products`


export const fetchProduct = async () => {
  try {
    const response = await axios.get(api)
    console.log('response', response)
  } catch (error) {
    console.error(error)

  }
}
