import React from 'react'
import moment from 'moment'
import 'moment/locale/es'

const Notif2 = ({misguardias,liberada}) => {
    return (
        <><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" crossOrigin="anonymous" /><div>
            <div className="py-8 px-8 max-w-sm mx-auto bg-blue-100 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                <div className="text-center space-y-2 sm:text-left">
                    <div className="space-y-0.5">
                    <hr/>
                        <p className="text-lg text-black font-semibold">
                            {misguardias.subscription_name}
                        </p>
                        <p className="text-gray-500 font-medium">
                            <i className="far fa-calendar-alt"></i> {moment(misguardias.date).locale('es').format("DD-MMMM-YYYY")}&nbsp;&nbsp;Horario {misguardias.start_time}-{misguardias.end_time}                              
                        </p>
                        <hr/>
                        <br/>
                        <button className="px-4 py-1 text-sm text-gray-500 font-semibold rounded-full border border-gray-500 hover:border-red-500 hover:text-red-500" onClick={() => liberada(misguardias.id)}  >Liberar</button>                       
                    </div>
                </div>
            </div>
        </div>                        
        <br/>
        </>
    )
}


export default Notif2
