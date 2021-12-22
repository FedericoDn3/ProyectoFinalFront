import React from 'react'
import moment from 'moment'
import 'moment/locale/es'

const Alert = ({alerts}) => {
    return (
        <><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" crossOrigin="anonymous" /><div>
            <div className="py-8 px-8 max-w-sm mx-auto bg-blue-100 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                <div className="text-center space-y-2 sm:text-left">
                    <div className="space-y-0.5">
                        <hr/>
                        <br/>
                        <p className="text-lg text-black font-semibold">
                            {alerts.guard.subscription_name}
                        </p>
                        <p className="text-gray-500 font-medium">                            
                        <i className="far fa-calendar-alt"></i> {moment(alerts.date).locale('es').format("DD-MMMM-YYYY")}&nbsp; &nbsp;Horario {alerts.guard.start_time}-{alerts.guard.end_time}                           
                        </p>
                        <br/>
                        <hr/>
                        <br/><p>Mensaje:</p>    
                        <p className="text-lg text-red-400 font-semibold" >{alerts.message}<br/>    
                        {moment(alerts.timestamp).locale('es').format("DD-MMMM-YYYY HH:mm:ss")}</p>                      
                        
                    </div>
                </div>
            </div>
        </div>                        
        <br/>
        </>
    )
}


export default Alert