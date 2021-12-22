import React from 'react'
import ImgMedicos from '../images/ImgMedicos.jpg'
import swal from 'sweetalert'
import { PayPalButton } from "react-paypal-button-v2";

const Producto = () => {
  const paypalKey = ''//Aqui usar la key que le proporciono paypal
  return (
    <div className="contents">
      {/* video Promocional */}
      <div className='flex max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden mx-auto'>
        <div className="flex flex-col m-5 ">
            <iframe width="340" height="191" src="https://www.youtube-nocookie.com/embed/NpEaa2P7qZI?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
      {/* Parte Pprincipal */}
      <div className= "contents">
        <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"/>
        <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"/>
        {/*Fondo Gris*/}
        <section className=" bg-blueGray-200 -mt-24">
          <div className="container mx-auto px-4">
            {/*Espacio entre imagen y header*/}
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-1 shadow-lg rounded-lg">
                  <div className="px-4 flex-auto">
                  </div>
                </div>
              </div>
            </div> 
            {/*Cuerpo*/}
            <div className="flex flex-wrap items-center mt-16">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                {/*Personitas*/}
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  La solución para sus problemas de Administración.
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                  Nuestro software es lo ultimo en tecnología para el manejo de guardias en el mercado Uruguayo. 
                </p>
                <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-600"> 
                  "Guardias Médicas" permite el manejo y control de las guardias de múltiples médicos en tiempo real, fácil creación y manipulación de ellas y
                  vista de reportes detallando tiempos de espera, cantidad de guardias asignadas y carga laboral.<br/>
                  Permitiendo así el control de cada uno de los servicios dentro del hospital con listas que permiten la visualización detallada e independiente.
                </p>
                <p className="font-bold text-blueGray-700 mt-8"></p>
              </div>
              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg rounded-lg bg-blue-500">
                    <img alt="..." src={ImgMedicos} className="w-full align-middle rounded-t-lg"/>
                    <blockquote className="relative p-8 mb-4">
                      <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 95" className="absolute left-0 w-full block h-95-px -top-94-px">
                      <polygon points="-30,95 583,95 583,65" className="text-blue-500 fill-current"></polygon>
                      </svg>
                      <h4 className="text-xl font-bold text-white">Guardias Médicas</h4>
                      <p className="text-md font-light mt-2 text-white">
                      Olvídate del software obsoleto y de las hojas de cálculo difíciles de entender.<br/>
                      Únete a la revolución del software de administración.
                      </p>
                      <p>&nbsp;</p>
                      <span>&nbsp;</span>
                      <b className="text-md font-light mt-2 text-white">¡Te esperamos!</b>
                      <span>&nbsp;</span>
                    </blockquote>
                      <div className="relative p-2 mt-1 bg-black">
                          <span>&nbsp;</span>

                          <PayPalButton
                              options={{vault: true,intent: "subscription" ,clientId: paypalKey}}
                              createSubscription={(data,actions) => {
                                return actions.subscription.create({
                                  plan_id: '' //Aqui usar el plan id proporcionado por Paypal
                                });
                              }}
                              onApprove={(data, actions) => {
                                // Capture the funds from the transaction
                                return actions.subscription.get().then(function(details) {
                                  // Show a success message to your buyer
                                  const Susc = new Map([
                                    ['id',details.subscriber.email_address],
                                    ['name',details.subscriber.name.given_name]
                                  ]);
                                  const Cliente = JSON.stringify(Object.fromEntries(Susc));

                                  //alert("Gracias Por Suscribirte a Guardias Médicas."+details.subscriber.name.given_name+ ", Pronto Recibiras un Correo con mas Informacion")
                                  swal({
                                    title: "Gracias Por Suscribirte a Guardias Médicas."+details.subscriber.name.given_name+ ", Pronto Recibiras un Correo con mas Informacion",
                                    icon: "success",
                                    button: false,
                                    timer:4000
                                  });

                                  
                                  const NuevoAdmin = async () => {  
                                    const settings = {
                                      method: 'POST',
                                        headers: {
                                          Accept: 'application/json',
                                          'Content-Type' : 'application/json; charset=UTF-8'
                                        },
                                      body:Cliente   
                                    }
                                  fetch('http://127.0.0.1:5000/superadmin/'+1 , settings)
                                  }
                                  NuevoAdmin()
                                });
                              }}
                              style={{
                                size:  'responsive',
                                shape: 'pill',
                                color: 'gold',
                                layout: 'vertical',
                                label: 'subscribe'
                              }}
                            />

                      </div>
                </div>
              </div>
            </div>
          </div>
          {/*Footer*/}
          <footer className="relative pt-8 pb-6 mt-8">
            <div className="container mx-auto px-4">
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
      </div>
    </div>
  )
}

export default Producto
