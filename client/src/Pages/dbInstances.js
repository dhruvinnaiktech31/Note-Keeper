import axios from 'axios';

export const baseURL=axios.create({
      baseURL:"http://localhost:8000/note"
})