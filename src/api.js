import axios from './axios';

export const baseUrl = 'http://localhost:3000';

/** Account */

export const signup = data => axios.plain.post(`${baseUrl}/signup`, data);

export const signin = data => axios.plain.post(`${baseUrl}/signin`, data);

export const signout = () => axios.secured.delete(`${baseUrl}/signin`);

/** Todos */

export const getTodos = () => axios.secured.get(`${baseUrl}/todos`);
