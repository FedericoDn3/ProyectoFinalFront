import React from 'react'
import Alert from './Alert'
import {useState,useEffect} from 'react'


const Alertas = () => {

    const [alerts,setAlerts] = useState([])

    useEffect(() => {
        const BuscarAlerts = async () =>{
            const AlertsServidor =await fetchAlerts()
            setAlerts(AlertsServidor)
        }
        BuscarAlerts()
    },[])

    // Llamar Alerts
    const fetchAlerts = async () => {
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
    const fetchResponse = await fetch('http://127.0.0.1:5000/notifications', settings)
    const resp = await fetchResponse.json()
    return resp
    }

    if (alerts.length !== 0) {
        return (
            <>
            <div className="py-8 px-8 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            &emsp;"Notificaciones"
            </div>
            {alerts.map(
                (alerts) => (
                <Alert
                key={alerts.id}
                alerts={alerts} 
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
                            No hay Alertas.
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
export default Alertas

