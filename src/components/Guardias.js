import React from 'react'
import GuardiasDisponibles from './GuardiasDisponibles';
import {useState,useEffect} from 'react'

const Guardias = () => {

    const [guardias,setGuardias] = useState([])

    useEffect(() => {
        const BuscarGuardias = async () =>{
            const GuardiasServidor =await fetchGuardias()
            setGuardias(GuardiasServidor)
        }
        BuscarGuardias()
    },[])

    // Llamar Guardias
    const fetchGuardias = async () => {
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
    const fetchResponse = await fetch('http://127.0.0.1:5000/guards', settings)
    const resp = await fetchResponse.json()
    const data = resp.guards
    return data
    }

    return(
    
    <><div className="py-8 px-8 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            &emsp;"Guardias Disponibles"
        </div><div><GuardiasDisponibles guardias={guardias} /></div></>

   
    )
}
export default Guardias