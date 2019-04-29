import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';


//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })  
    );

};

//Login: Get User Token
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      //save token to local storage
      const { token } = res.data;
      //set token to local storage
      localStorage.setItem('jwtToken', token);
      //set token to auth header
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })  
    });
};

//set login user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

//log user out
export const logoutUser = (history) => dispatch => {
  //remove token from local storage
  localStorage.removeItem('jwtToken');

  //remove the auth header for future request
  setAuthToken(false);

  //set the current user to empty object will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}