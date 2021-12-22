//rafce comando

import React, { useEffect, useState } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import $ from 'jquery';
import swal from 'sweetalert';

const Admins = () => {

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [inputFilter, setInputFilter] = useState('');
  const [admins, setAdmins] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
 
  const token = sessionStorage.getItem('ftoken')
  const x =token.replace(/['"]+/g, '')

  const fetchAdmins = async () => {
    let settings = {
      'headers':{
        'Accept': 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization':'Bearer ' +  x
      }  
    }

    try {
      const response = await fetch("/administrators", settings);
      const json = await response.json();
      setAdmins(json.administrators);
      
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    
    
    fetchAdmins();
  },[]);

  const Guardaradmin = async () => {
    setShowModalAgregar(false);

    let admin = {
      'id': $("#cedula").val(),
      'name': $("#nombre").val(),
      'password': $("#password").val()
      
    };


    let json = JSON.stringify(admin)

      let settings = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type' : 'application/json; charset=UTF-8',
          'Authorization':'Bearer ' +  x
        },
        body: json 
      }

      const resp = await fetch('/administrator/1', settings)
      if (resp.status === 201) {
        swal({
          title: "Administrador creado.",
          icon: "success",
          button: "OK",
        });
        fetchAdmins();
      }else{
        swal({
          title: "No se pudo crear.",
          icon: "error",
          button: "OK",
        });
      }

      //limpio inputs
      $("#cedula").val('');
      $("#nombre").val('');
      $("#password").val('');

  }

  const eliminarRegistro = async (idadmin) => {
    swal({
      title: "Eliminar",
      text: "¿Estás seguro que deseas eliminar este registro?",
      icon: "warning",
      buttons: ["No", "Sí"]
    }).then(async (respuesta) => {
      if(respuesta){
        let settings = {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json; charset=UTF-8',
            'Authorization':'Bearer ' +  x
          } 
        }

        await fetch('/administrator/'+ `${idadmin}`, settings)
        
        swal({
          title: "Administrador eliminado.",
          icon: "success",
          button: "OK",
        });
        fetchAdmins();
      
        
      }
    })
  }

  const editarAdmin = (objetoadmin) => {

    //seteo inputs en el form
    $("#cedulaedit").val(objetoadmin.id);
    $("#nombreedit").val(objetoadmin.name);
    $("#passwordedit").val(objetoadmin.password);

    setShowModalEditar(true);
  }

  const SubmitEditarAdmin = async () => {
    setShowModalEditar(false);

    let adminid = $("#cedulaedit").val();
    let admin = {
        'id': adminid,
        'name': $("#nombreedit").val(),
        'password':$("#passwordedit").val()
      
    };


    let json = JSON.stringify(admin)
    let settings = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json; charset=UTF-8',
        'Authorization':'Bearer ' +  x
      },
      body: json 
    }

    await fetch('/administrator/' + `${adminid}`, settings)
    
      swal({
        title: "Administrador editado",
        icon: "success",
        button: "OK",
      });

      fetchAdmins();
    
      //limpio inputs
      $("#cedulaedit").val('');
      $("#nombreedit").val('');
      $("#passwordedit").val('');
      
  }

  const changeVisibilityPass = () => {
    if(showPassword){
      setShowPassword(false)
    }else{
      setShowPassword(true)
    }
  }
  
  return (
    <div>
      <div id="titleComponent" className="flex justify-center font-extrabold items-center text-center text-xl tracking-widest bg-gray-400 h-12 mb-6">
          <h1>ADMINISTRADORES</h1> 
      </div>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          {/* FILTROS */}
          <div className="p-2 flex items-center justify-between">
            <div className="bg-white flex items-center rounded-full shadow-xl w-44 h-3">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 28 28"
                className="w-6 h-6"
                style={{
                  marginLeft: "9em",
                  position: "absolute",
                  color: "darkgray",
                  marginTop: "0.1em",
                }}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                className="rounded-full w-full py-2 px-3 text-gray-700 font-bold leading-tight focus:outline-none border-b-4"
                id="search"
                type="text"
                value={inputFilter}
                placeholder="Buscar admin"
                onChange={(event) => setInputFilter(event.target.value)}
              />
            </div>
            <div className="inline-flex">
              <button
                onClick={(e) => setShowModalAgregar(true)}
                className="bg-blue-300 text-white text-sm font-extrabold hover:bg-blue-500 hover:border-transparent pt-1 border-b-4 border-blue-400 rounded-full h-8 inline-flex items-center w-24"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 pl-2 pb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span className="px-1">ADMIN</span>
              </button>
              

              
            </div>
          </div>

          {/* TABLA */}
          <div className="-mx-4 px-6 py-4 overflow-x-auto mt-7">
            <div className="inline-block min-w-full shadow rounded overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="px-5 text-center text-xs bg-gray-300 font-bold text-black uppercase tracking-widest h-14 border">
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {admins
                    .filter(
                      (admin) =>
                        admin.name
                          .toUpperCase()
                          .includes(inputFilter.toUpperCase()) || 
                        inputFilter === ""
                    )
                    .map((admin) => (
                      <tr className="border-b" key={admin.id}>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm w-2/5">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {admin.id}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {admin.name}
                          </p>
                        </td>
                        
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm w-2/5">
                          <div className="flex justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-yellow-400 hover:text-gray-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{ marginRight: "0.5em" }}
                              onClick={() => editarAdmin(admin)}
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
                              onClick={() => eliminarRegistro(admin.id)}
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
          Ingrese admin
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-2 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div
                    className="relative"
                    style={{ marginBottom: "2em", marginTop: "2em" }}
                    >
                    <input
                        autoComplete="off"
                        id="cedula"
                        name="cedula"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="cedula"
                    />
                    <label
                        htmlFor="Cedula"
                        className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Cédula
                    </label>
                    </div>
                    <div
                    className="relative"
                    style={{ marginBottom: "2em"}}
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
                    <div className="relative inline-flex" style={{ marginBottom: "2em" }}>
                      <input
                        autoComplete="off"
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Contraseña"
                      />
                        <i className="fas fa-eye-slash" onClick={(e) => changeVisibilityPass()}></i>
                      <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Contraseña
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
            onClick={(e) => Guardaradmin()}
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
          Editar admin
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-base leading-6  text-gray-700 sm:text-lg sm:leading-7">
              <div
                    className="relative"
                    style={{ marginBottom: "2em", marginTop: "2em" }}
                    >
                    <input
                        autoComplete="off"
                        id="cedulaedit"
                        name="cedula"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="cedula"
                    />
                    <label
                        htmlFor="Cedula"
                        className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Cédula
                    </label>
                    </div>
                    <div
                    className="relative"
                    style={{ marginBottom: "2em"}}
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
                        id="passwordedit"
                        name="password"
                        type="password"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Contraseña"
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Contraseña
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
            onClick={(e) => SubmitEditarAdmin()}
            ripple="light"
          >
            GUARDAR
          </Button>
        </ModalFooter>
      </Modal>

      
    </div>
  );


};




export default Admins;
