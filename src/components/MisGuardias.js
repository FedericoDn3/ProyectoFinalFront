import React from 'react'
import swal from 'sweetalert'
import Notif2 from './Notif2'
import {useState,useEffect} from 'react'

const MisGuardias = ({misguardias}) => {
    const [misguardiasm,setMisGuardiasM] = useState([])

    useEffect(() => {
        const Set = async () =>{
            setMisGuardiasM(misguardiasm)
        }
    Set()
    },[misguardiasm])


    // Liberar Guardia
    const liberarGuardia = (id) => {
        setMisGuardiasM(misguardiasm.filter((guardia) => guardia.id !== id ))
        const token = sessionStorage.getItem('ftoken')
        const x =token.replace(/['"]+/g, '')
        const settings = {
            method: 'DELETE',
            headers: {
            Accept: 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization:'Bearer ' +  x
            }
        }
        const mid = sessionStorage.getItem('id').replace(/['"]+/g, '')
        const xx = fetch('http://127.0.0.1:5000/assignment/'+mid+'/'+id, settings)
        xx.then((value) => {
            //alert("La guardia fue liberada correctamente.")
            swal({
                title: sessionStorage.getItem('name')+ "la guardia fue liberada correctamente.",
                icon: "success",
                button: false
            });
        if (value.status){window.location.reload(false)}
    })
    }

    if (misguardias.length !== 0) {
        return (
            <>
            {misguardias.map(
                (misguardias) => (
                <Notif2 
                key={misguardias.id}
                misguardias={misguardias} 
                liberada = {liberarGuardia}
            />
            ))}
            </>
        )    
    } else {
        return(
        <><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" crossOrigin="anonymous" /><div>
        <div className="py-8 px-8 max-w-sm mx-auto bg-red-50 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <div className="text-center space-y-2 sm:text-left">
                <div className="space-y-0.5">
                    <p className="text-lg text-black font-semibold">
                        No hay guardias agendadas.
                    </p>

                </div>
            </div>
        </div>
    </div>                        
    <br/>
    </>
        )
    }




    }

export default MisGuardias
