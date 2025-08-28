import axios from 'axios';

export const URL=axios.create({
      baseURL:"http://localhost:8000/todo"
})