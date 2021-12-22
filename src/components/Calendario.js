import React, {useState,useEffect} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'
import 'moment/locale/es'
import MisGuardias from "./MisGuardias"
import MisGuardiasDia from "./MisGuardiasDia"
import GoogleEventComponent from './GoogleEventComponent';
import Popup from 'reactjs-popup';

const Calendario = () => {
    const [dateState, setDateState] = useState(new Date())
    const changeDate = (e) => {setDateState(e)}
    const [date, setDate] = useState(undefined)
    const [misguardias,setMisGuardias] = useState([])

    useEffect(() => {
        const BuscarMisGuardias = async () =>{
            const GuardiasServidor = await fetchMisGuardias()
            setMisGuardias(GuardiasServidor)
        }
    BuscarMisGuardias()
    },[])


  // Llamar MisGuardias
    const fetchMisGuardias = async () => {
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
    const fetchResponse = await fetch('http://127.0.0.1:5000/myguards/', settings)
    const resp = await fetchResponse.json()
    const data = resp.myguards
    return data
}

    //Selector Fechas
    const DiaSeleccionado = async () => {
        const Igual = moment(date).format("YYYY-MM-DD")
    return Igual
    }
     return (
        <>
        <div>
        <h1 className="py-2 px-2 max-w-sm mx-auto space-y-1 sm:py-1 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">Calendario Guardias</h1>
        </div>
        <div className="py-8 px-8 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <Calendar 
                value={dateState}
                onChange={changeDate}
                onClickDay={(e) => {setDate(e)}}
            /> 
        </div>

        

        

        <div>
        <Popup trigger={<button onClick={()=>DiaSeleccionado(misguardias)} className="py-2 px-2 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 relative bg-blue-100 p-1 m-1 text-black rounded overflow-visible">Ver Guardias del Día: &emsp;
            <b>{moment(dateState).locale('es').format("DD MMMM YYYY")}</b>
        </button>} position="bottom">
        <div><MisGuardiasDia misguardias={misguardias} date={date}/></div>
        </Popup>
        </div>

        <div className="py-8 px-8 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"><GoogleEventComponent misguardias={misguardias}/></div>

        <h1 className="py-8 px-8 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">Todas mis Guardias :</h1>
        <div>
        <MisGuardias misguardias={misguardias}/>      
        </div>

        </>


    )
}

export default Calendario

