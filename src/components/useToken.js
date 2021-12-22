import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.access_token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken))//si quiero solo el token poner .accesstoken
    sessionStorage.setItem('ftoken', JSON.stringify(userToken.access_token))
    setToken(userToken.access_token);
  };

  return {
    setToken: saveToken,
    token
  }
}