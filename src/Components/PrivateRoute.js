import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

function PrivateRoute({children}) {
    const navigate = useNavigate();
    function loggedIn(){
      return localStorage.getItem("token") ? children : navigate("/login")
    }
    useEffect(()=>{
      loggedIn()
    })
  return (
    loggedIn()
  )
}

export default PrivateRoute;