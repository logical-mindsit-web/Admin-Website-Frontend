import axios from 'axios';

const apiticket = axios.create({
  baseURL: 'https://time-management-671b.onrender.com',  
});

export default apiticket;