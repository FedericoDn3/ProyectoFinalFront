import React, { useEffect, useState } from "react";

import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import $ from 'jquery';
import swal from 'sweetalert';

const Servicios = () => {

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);

  
  const [inputFilter, setInputFilter] = useState('');
  const [services, setServices] = useState([]);

  const token = sessionStorage.getItem('ftoken')
  const x =token.replace(/['"]+/g, '')

  

  const fetchServices = async () => {
      
    let settings = {
        'headers':{
          'Accept': 'application/json',
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization':'Bearer ' +  x
        }  
        
      }
    try {
      const response = await fetch("/services", settings);
      const json = await response.json();

      setServices(json.services);
      
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    
    fetchServices();
  },[]);

  const GuardarServicio = async () => {
    setShowModalAgregar(false);

    let servicio = {
      'name':  $("#nombre").val(),
      'code':  $("#code").val()  
    };

    let json = JSON.stringify(servicio)

    let settings = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type' : 'application/json; charset=UTF-8',
          'Authorization':'Bearer ' +  x
        },
        body: json 
      }



    const resp = await fetch('/service/1', settings)
      if (resp.status === 201) {
        swal({
          title: "Servicio creado.",
          icon: "success",
          button: "OK",
        });

        fetchServices();
    
      }else{
        swal({
          title: "No se pudo crear.",
          icon: "error",
          button: "OK",
        });
      }


      //limpio inputs
    $("#nombre").val('');
    $("#code").val('');

    
  }

  const eliminarRegistro = async (idservicio) => {
    

    swal({
      title: "Eliminar",
      text: "¿Estás seguro que deseas eliminar este registro?",
      icon: "warning",
      buttons: ["No", "Sí"]
    }).then( async (respuesta) => {
      if(respuesta){

        let settings = {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json; charset=UTF-8',
            'Authorization':'Bearer ' +  x
          }
        }

        await fetch('/service/'+ `${idservicio}`, settings)
        swal({
          title: "El registro se ha borrado con éxito",
          icon: "success",
          button: "OK",
        });
        fetchServices();

    
      }
    })
  }

  const editarServicio = (objetoservicio) => {

    //seteo inputs 
    $("#idedit").val(objetoservicio.id);
    $("#nombreedit").val(objetoservicio.name);
    $("#codeedit").val(objetoservicio.code);


    setShowModalEditar(true);
  }

  const SubmitEditarServicio = async () => {
    setShowModalEditar(false);

    let servicioid = $("#idedit").val();
    let servicio = {
        'name':  $("#nombreedit").val(),
        'code':  $("#codeedit").val()
    };

    let json = JSON.stringify(servicio)


    
    let settings = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json; charset=UTF-8',
        'Authorization':'Bearer ' +  x
      },
      body: json 
    }
    
    await fetch('/service/' + `${servicioid}`, settings)
    
      swal({
        title: "Servicio editado",
        icon: "success",
        button: "OK",
      });
      
    fetchServices();
    

      //limpio inputs
      $("#idedit").val('');
    $("#nombreedit").val('');
    $("#codeedit").val('');
    $("#coloredit").val('');  
    
  }

  return (
    <div>
      <div id="titleComponent" className="flex justify-center font-extrabold items-center text-center text-xl tracking-widest bg-gray-400 h-12 mb-6">
          <h1>SERVICIOS</h1> 
      </div>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          {/* FILTROS */}
          <div className="mb-8 flex items-center justify-between">
            <div className="bg-white flex items-center rounded-full shadow-xl w-64 h-3 ml-6">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 28 28"
                className="w-6 h-6"
                style={{
                  marginLeft: "14em",
                  position: "absolute",
                  color: "darkgray",
                  marginTop: "0.1em",
                }}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                className="rounded-full w-full py-2 px-3 text-gray-700 font-bold leading-tight focus:outline-none border-b-4 border-gray-300"
                id="search"
                type="text"
                value={inputFilter}
                placeholder="Buscar servicio, código"
                onChange={event => setInputFilter(event.target.value)}
              />
            </div>

            <div>
              <button
                onClick={(e) => setShowModalAgregar(true)}
                className="mr-6 mx-2 bg-blue-300 text-white text-sm font-extrabold hover:bg-blue-500 hover:border-transparent pt-1 border-b-4 border-blue-400 rounded-full h-8 inline-flex items-center w-28"
              >
                <i className="fas fa-plus-circle fa-lg mx-2"></i>
                <span>SERVICIO</span>
              </button>
            </div>
          </div>

          {/* TABLA */}
          <div className=" px-6 py-4 overflow-x-auto mt-7">
            <div className="inline-block shadow rounded overflow-hidden">
              <table
                className="table-fixed leading-normal"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr className="px-5 text-center text-xs bg-gray-300 font-bold text-black uppercase tracking-widest h-14 border">
                    <th>NOMBRE</th>
                    <th>CODIGO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>

                {services
                .filter((servicio) =>
                  servicio.name
                  .toUpperCase()
                  .includes(inputFilter.toUpperCase()) ||
                  
                  servicio.code
                  .toUpperCase()
                  .includes(inputFilter.toUpperCase()) ||

                  inputFilter === ""
                )
                  .map((servicio) => (
                

                  <tr className="border-b" key={servicio.id}>
                    <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                      <p  className="text-gray-900 whitespace-no-wrap text-center">
                        {servicio.name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap text-center">
                        {servicio.code}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                      <div className="flex justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-yellow-400 hover:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ marginRight: "0.5em" }}
                          onClick={() => editarServicio(servicio)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-500 hover:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ marginRight: "0.5em" }}
                          onClick={() => eliminarRegistro(servicio.id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

     {/* Modal agregar  */}
      <Modal
        size="regular"
        active={showModalAgregar}
        toggler={() => setShowModalAgregar(false)}
      >
        <ModalHeader toggler={() => setShowModalAgregar(false)}>
          Ingrese servicio
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div
                  className="relative"
                  style={{ marginBottom: "2em", marginTop: "2em" }}
                >
                  <input
                    autoComplete="off"
                    id="nombre"
                    name="nombre"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Nombre"
                  />
                  <label
                    htmlFor="nombre"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Nombre
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "2em" }}>
                  <input
                    autoComplete="off"
                    id="code"
                    name="code"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Código"
                  />
                  <label
                    htmlFor="code"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Código
                  </label>
                </div>
                
                
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModalAgregar(false)}
            ripple="dark"
          >
            CANCELAR
          </Button>

          <Button
            color="green"
            onClick={(e) => GuardarServicio()}
            ripple="light"
          >
            GUARDAR
          </Button>
        </ModalFooter>
      </Modal>
    
      {/* Modal editar */}
      <Modal
        size="regular"
        active={showModalEditar}
        toggler={() => setShowModalEditar(false)}
      >
        <ModalHeader toggler={() => setShowModalEditar(false)}>
          Editar servicio
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div
                  className="relative"
                  style={{ marginBottom: "2em", marginTop: "2em" }}
                >
                  <input
                    autoComplete="off"
                    id="idedit"
                    name="id"
                    type="hidden"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  />
                </div>
                <div
                  className="relative"
                  style={{ marginBottom: "2em", marginTop: "2em" }}
                >
                  <input
                    autoComplete="off"
                    id="nombreedit"
                    name="nombre"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Nombre"
                  />
                  <label
                    htmlFor="nombre"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Nombre
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "2em" }}>
                  <input
                    autoComplete="off"
                    id="codeedit"
                    name="code"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Código"
                  />
                  <label
                    htmlFor="code"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Código
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModalEditar(false)}
            ripple="dark"
          >
            CANCELAR
          </Button>

          <Button
            color="green"
            onClick={(e) => SubmitEditarServicio()}
            ripple="light"
          >
            GUARDAR
          </Button>
        </ModalFooter>
      </Modal>
    
    </div>
  );
}

export default Servicios