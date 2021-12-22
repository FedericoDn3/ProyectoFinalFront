import React from 'react'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'

const Logout = () => {
    //alert("Hasta la Proxima")
    
    swal({
        title: sessionStorage.getItem('name')+ "hasta la próxima , 'Guardias Médicas' te desea un lindo día.",
        icon: "info",
        button: false,
        timer:3000
    });
    setTimeout(() => {    
        sessionStorage.clear()
        window.location.reload(false);}, 500);
    }

const Header = () => {
    return (

        <>
        <header className="flex flex-col justify-around">
        <div className="p-2 w-full h-20 border-box bottom-0">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            <div className="flex bg-blue-500 justify-around text-white w-flex h-3/4 rounded-xl">
                <Link to = '/Guardias'  className="below-menu-holder rounded-bl-xl rounded-tl-xl w-1/4 flex duration-700 justify-around">
                    <span className="material-icons self-center">medical_services</span>
                </Link>
                <Link to = '/'className="below-menu-holder  w-1/4 flex duration-700 justify-around">
                    <span className="material-icons self-center">calendar_today</span>
                </Link>
                <Link to = '/Notificaciones'className="below-menu-holder  w-1/4 flex duration-700 justify-around">
                    <span className="material-icons self-center">notifications</span>
                </Link>
                <div className="below-menu-holder rounded-tr-xl rounded-br-xl w-1/4 flex duration-700 justify-around">
                    <button onClick={()=>Logout()} className="material-icons self-center">logout</button>
                </div>
            </div>
        </div>
        </header>
            
        </>
    )
}
export default Header
