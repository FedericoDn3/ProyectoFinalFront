import React ,{useState,useEffect} from "react";
import { useMediaQuery } from 'react-responsive'
import Aside from './components/Aside';
import MainContent from './components/MainContent';
import {
  BrowserRouter as Router, Route ,Redirect
} from "react-router-dom";
import "@material-tailwind/react/tailwind.css";
// -------------------------------------------------
import Header from "./components/Header"
import LHeader from "./components/LHeader"
import Guardias from "./components/Guardias"
import Calendario from "./components/Calendario"
import Producto from "./components/Producto"
import useToken from "./components/useToken"
import Loader from "react-loader-spinner";
import Login from  "./components/Login"
import Alertas from "./components/Alertas";

function App() {

  const { token, setToken } = useToken()
  const [isClosed, setClosed] = React.useState(false)
  const [user, setUser] = useState(null)



   useEffect(() => {
    if(token)
      fetchInitObject().then(data => setUser(data))
  }, [token]) 


  const fetchInitObject =async () => {
    const token = sessionStorage.getItem('ftoken')
    const x =token.replace(/['"]+/g, '')
    const settings = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization:'Bearer ' +  x
        }
    }
    const fetchResponse =await fetch('http://127.0.0.1:5000/login', settings).then()
    const data =await fetchResponse.json()
    sessionStorage.setItem('id', JSON.stringify(data.id))
    sessionStorage.setItem('name', JSON.stringify(data.name))
    return data
  }

  const isStatic = useMediaQuery({
      query: '(min-width: 640px)'
  })
  
  if(!token) {
    return (
      <Router>    
      <Redirect to="/Landing" />  
      <LHeader/>  
      <div className='container contents'>
      <Route path='/Login' exact render={(props) => (<>
      <Login setToken={setToken}/>
      </>)}/>
      <Route path='/Landing' exact render={(props) => (<>
      <Producto/>
      </>)}/>
      </div>
      </Router>


  
    )
  } else if(user!=null){
    if (user.type === "administrator") {
      return (
        <div className="flex bg-gray-100">
          <Router>
            {(isStatic || !isClosed) && (
    
              <Aside/>
    
            )}
    
            <MainContent isStatic = {isStatic} isClosed = {isClosed} setClosed = {setClosed} />
          
          </Router>
        </div>
      );
    }else if(user.type === "medical_doctor"){
      return (
        <Router>
        <div className='container contents'>
        <Header />
        <Redirect to="/" />
        <Route path='/Guardias' exact render={(props) => (<>
        <Guardias/>
        </>)}/>
        <Route path='/' exact render={(props) => (<>
        <Calendario/>
        </>)}/>
        <Route path='/Notificaciones' exact render={(props) => (<>
        <Alertas/>
        </>)}/>
        </div>
        </Router>
      )  
    } else {
      return(<div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"><Loader
        type="ThreeDots"
        color="#00A5E3"
        height={10}
        width={10}
        timeout={5000} //3 secs
      /></div>)
    }
  }else{
    return(<div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"><Loader
      type="ThreeDots"
      color="#00A5E3"
      height={10}
      width={10}
      timeout={5000} //3 secs
    /></div>)
  }
}

export default App;
