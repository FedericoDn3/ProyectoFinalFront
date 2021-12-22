import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (

        <>
        <header className="  my-6 p-1 float-left justify-around">
        <div className="p-2 w-full h-20 border-box bottom-0">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            <div className="flex bg-blue-500 justify-around text-white w-flex h-3/4 rounded-xl">
                <Link to = '/Login'  className="below-menu-holder rounded-bl-xl rounded-tl-xl w-1/4 flex duration-700 justify-around">
                    <span className="self-center" >&nbsp;&nbsp;Login&nbsp;</span><span className="material-icons self-center">login &nbsp;</span>
                </Link>
            </div>
        </div>
        </header>
            
        </>
    )
}
export default Header