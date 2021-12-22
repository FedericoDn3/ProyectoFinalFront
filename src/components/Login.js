import React, { useState } from 'react';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
    const settings = {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(credentials)
      }
    return fetch('http://127.0.0.1:5000/login',settings)
      .then(data => data.json())
   }

   export default function Login({setToken}) {
        const [id, setId] = useState();
        const [password, setPassword] = useState();
        //const [seguirConectado,setSeguirConectado] = useState()
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            const tokens = await loginUser({
                id,
                password
        })
        const token = tokens
        setToken(token)
    }

    return (
        <>
            <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css" />
            <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" />


            <section className="bg-blueGray-50">
                <div className="w-full lg:w-4/12 px-4 mx-auto pt-6">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                            </div>
                            <div className="btn-wrapper text-center">

                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <div className="text-blueGray-400 text-center mb-3 font-bold">
                                <small>“Guardias Médicas” te da la bienvenida!</small>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">Usuario</label><input type="text" onChange={e => setId(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Cedula" />
                                </div>
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">Contraseña</label><input type="password" onChange={e => setPassword(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="**********" />
                                </div>
                                {/*<div>
                <label className="inline-flex items-center cursor-pointer"><input id="customCheckLogin" type="checkbox" onChange={e => setSeguirConectado(e.target.value)} className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"/><span className="ml-2 text-sm font-semibold text-blueGray-600">Mantenerme Online</span></label>
            </div> */}
                                <div className="text-center mt-6">
                                    <button className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150" type="submit"> Ingresar </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <footer className="relative pt-8 pb-6 mt-2">
                    <div className="container mx-auto px-2">
                        <div className="flex flex-wrap items-center md:justify-between justify-center">
                            <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                                <div className="text-sm text-blueGray-500 font-semibold py-1">
                                    Guardias Médicas
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </>
    )
}
Login.propTypes = {
    setToken: PropTypes.func.isRequired
    }







