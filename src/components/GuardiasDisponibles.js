import React from 'react'
import swal from 'sweetalert'
import Notif from './Notif'
import {useState,useEffect} from 'react'

const GuardiasDisponibles = ({guardias}) => {
    const [guardiasD,setGuardiasD] = useState([])
    // Aceptar Guardia

    useEffect(() => {
        const Set = async () =>{
            setGuardiasD(guardias)
        }
    Set()
    },[guardias])


    const aceptarGuardia = (id) => {
        setGuardiasD(guardias.filter((guardiasD) => guardiasD.id !== id ))
        const token = sessionStorage.getItem('ftoken')
        const x =token.replace(/['"]+/g, '')
        const settings = {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization:'Bearer ' +  x
            }
        }
        const mid = sessionStorage.getItem('id').replace(/['"]+/g, '')    
        const xx = fetch('http://127.0.0.1:5000/assignment/'+mid+'/'+id, settings)
    xx.then((value) => {
        if (value.status === 500) {
            //alert("La Guardia seleccionada ya no se encuentra disponible, refresca el navegador para ver la lista de guardias actualizada.") 
            swal({
                title: sessionStorage.getItem('name')+" Lamentamos informarte que la guardia seleccionada ya no se encuentra disponible, refresca el navegador para ver la lista de guardias actualizada. ",
                icon: "warning",
                button: false
              });   
        }else if(value.status === 201 ){
            //alert("La guardia fue asignada correctamente.")
            swal({
                title: sessionStorage.getItem('name')+ "la guardia te fue asignada con éxito",
                icon: "success",
                button: false
              });
        }
       
        if (value.status){window.location.reload(false)}
    })
    }
    


    if (guardias.length !== 0) {
        return (
            <>
            {guardiasD.map(
                (guardias) => (
                <Notif
                key={guardias.id}
                guardias={guardias} 
                aceptada = {aceptarGuardia}
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
                            No hay guardias sin asignar.
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

export default GuardiasDisponibles








