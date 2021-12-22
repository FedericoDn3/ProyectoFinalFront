import React, { useEffect, useState,useRef  } from "react";

const Calendario = () => {

  
  const [inputFilterEmpleado, setInputFilterEmpleado] = useState('');
  const [inputFilterServicio, setInputFilterServicio] = useState('');
  const [inputFilterFechaHasta, setInputFilterFechaHasta] = useState('');
  const [inputFilterFechaDesde, setInputFilterFechaDesde] = useState('');
  const [listaGuardias, setListaGuardias] = useState([]);


  const token = sessionStorage.getItem('ftoken')
  const x =token.replace(/['"]+/g, '')

  // LLAMADAS A LA API
  useEffect(() => {

    const fetchGuards = async () => {
      let settings = {
        'headers':{
          'Accept': 'application/json',
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization':'Bearer ' +  x
        }  
        
      }

      try {

        const respMedicos = await fetch("/medical_doctors", settings);
        const jsonMedicos = await respMedicos.json();

        const response = await fetch("/guards", settings);
        const json = await response.json();

        
        let gu = json.guards 
        let guardiaEstructura = []
        const arrayListaGuardia = [];
        let medicos =jsonMedicos.medical_doctors
        let nombreMedico = ''

        gu.forEach((g) => {
          medicos.forEach((medico) => {
            if(g.medical_doctor_id !== null){
              if(g.medical_doctor_id === medico.id)
                nombreMedico = medico.name
            }else{
              nombreMedico= "Sin asignar"
            }
          })
            guardiaEstructura = {
              subscription_name: g.subscription_name,
              date: g.date,
              start_time: g.start_time,
              end_time: g.end_time,
              medicoNombre: nombreMedico
            }
            arrayListaGuardia.push(guardiaEstructura)
        })
        setListaGuardias(arrayListaGuardia);
        
      } catch (error) {
        console.log("error", error);
      }
    };
    
    fetchGuards();
    
  }, []);

  
  const ref1 = useRef();
  const ref2 = useRef();

  return (
    <div>
      <div id="titleComponent" className="flex justify-center font-extrabold items-center text-center text-xl tracking-widest bg-gray-400 h-12">
          <h1>CALENDARIO GUARDIAS</h1> 
      </div>
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="py-8">
          {/* FILTROS */}
          <h1 className="mb-3 font-extrabold">FILTROS</h1>
          
          <div className="mb-8 flex items-center justify-self-end">
            <div className="w-44">
              <input
                  className="rounded-full w-full py-2 px-3 text-gray-700 font-bold leading-tight focus:outline-none border-b-4 border-gray-300"
                  id="searchServicio"
                  type="text"
                  placeholder="Buscar servicio"
                  value={inputFilterServicio}
                  onChange={(event) => setInputFilterServicio(event.target.value)}
                />
              
            </div>
            <div className="bg-white flex items-center rounded-full shadow-xl w-48 h-3 ml-2">
           
              <input
                className="rounded-full w-full py-2 px-3 text-gray-700 font-bold leading-tight focus:outline-none border-b-4 border-gray-300"
                id="search"
                type="text"
                placeholder="Buscar empleado"
                value={inputFilterEmpleado}
                onChange={(event) => setInputFilterEmpleado(event.target.value)}
              />
            </div>
          

          {/* RANGO FECHAS */}
            
              <div className="bg-white flex items-center rounded-full shadow-xl w-36 h-3 ml-32">
               
                <input
                  className=" rounded-full w-full py-2 pl-2 text-gray-400 font-bold leading-tight focus:outline-none border-b-4 border-gray-300"
                  id="dateFrom"
                  type="text"
                  placeholder="Fecha desde"
                  ref={ref1}
                  onFocus={() => (ref1.current.type = "date")}
                  onBlur={() => (ref1.current.type = "text")}
                  value={inputFilterFechaDesde}
                  onChange={(event) => setInputFilterFechaDesde(event.target.value)}
                />
              </div>
              <div className="bg-white flex items-center rounded-full shadow-xl w-36 h-3 ml-2">
               
                <input
                  className=" rounded-full w-full py-2 pl-2 text-gray-400 font-bold leading-tight focus:outline-none border-b-4 border-gray-300"
                  id="dateTo"
                  type="text"
                  placeholder="Fecha hasta"
                  ref={ref2}
                  onFocus={() => (ref2.current.type = "date")}
                  onBlur={() => (ref2.current.type = "text")}
                  value={inputFilterFechaHasta}
                  onChange={(event) => setInputFilterFechaHasta(event.target.value)}
                />
              </div>
          </div>
          <hr className="border-black mb-3"></hr>
        

          <div className="-mx-4 px-6 py-4 overflow-x-auto mt-7">
            <div className="inline-block min-w-full shadow rounded overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="px-5 text-center text-xs bg-gray-300 font-bold text-black uppercase tracking-widest h-14 border">
                    {/* <th>MEDICO</th> */}
                    <th>SERVICIO</th>
                    <th>FECHA</th>
                    <th>HORA INICIO</th>
                    <th>HORA FIN</th>
                    <th>EMPLEADO</th>
                  </tr>
                </thead>
                <tbody>
                  {listaGuardias
                    .filter(
                      (guardia) =>
                      guardia.subscription_name
                          .toUpperCase()
                          .includes(inputFilterServicio.toUpperCase()) ||
                          inputFilterServicio === ""   

                    ).filter(
                      (guardia) =>
                      
                      guardia.medicoNombre
                      .toUpperCase()
                      .includes(inputFilterEmpleado.toUpperCase()) ||
                      inputFilterEmpleado === ""
                         
                    )
                    .filter(
                      (guardia) =>
                      
                      (guardia.date >= inputFilterFechaDesde &&  guardia.date <= inputFilterFechaHasta) ||
                      inputFilterFechaDesde === "" ||
                      inputFilterFechaHasta === ""
                         
                    )
                    .map((guardia) => (
                      <tr className="border-b" key={guardia.id}>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.subscription_name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.date}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.start_time}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.end_time}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            
                            {guardia.medicoNombre}
                               
                    
                          </p>
                        </td>
                      </tr>
                    ))} 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Calendario