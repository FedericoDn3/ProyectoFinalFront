import React, { useEffect, useState, useRef } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import $ from 'jquery';
import swal from 'sweetalert';
import CSVReader from "react-csv-reader";
import Select from 'react-select'


const Empleados = () => {

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalImportar, setShowModalImportar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [inputFilter, setInputFilter] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [fileCSV, setFileCSV] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);


  const [errorEmail, setErrorEmail] = useState(true);
  const [colorBoton, setColorBoton] = useState('green');
  const [zonas, setZonas] = useState([]);
  const [zonesSelect, setZonasSelect] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [selectedValueSus, setSelectedValueSus] = useState([]);
  const [selectedValueSusEdit, setSelectedValueSusEdit] = useState([]);


  const [selectedValueZona, setSelectedValueZona] = useState('');
  const [labelZonaEditar, setLabelZonaEditar] = useState('');

  const token = sessionStorage.getItem('ftoken')
  const x =token.replace(/['"]+/g, '')



  const fetchEmpleado = async () => {
    let settings = {
      'headers':{
        'Accept': 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization':'Bearer ' +  x
      }  
    }

    try {
      const response = await fetch("/medical_doctors", settings);
      const json = await response.json();
      setEmpleados(json.medical_doctors);
      
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchZones = async () => {

    let settings = {
      'headers':{
        'Accept': 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization':'Bearer ' +  x
      }  
    }

    try {
      const response = await fetch("/zones", settings);
      const json = await response.json();
      setZonas(json.zones)
      let zonaEstructura = [];
      const arrayZonas = [];
      let zo= json.zones
      zo.forEach((z) => {

        zonaEstructura = {
          value: z.id,
          label: z.name  
        }

        arrayZonas.push(zonaEstructura);
      });
      setZonasSelect(arrayZonas);

    
      
    } catch (error) {
      console.log("error", error);
    }
    
  };

  const fetchSubscriptions = async () => {
    let settings = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: "Bearer " + x,
      },
    };

    try {
      const response = await fetch("/subscriptions", settings);
      const json = await response.json();
      setSuscripciones(json.subscriptions);
      let servicioEstructura = [];
      const arrayServicios = [];
      let sus = json.subscriptions;
      sus.forEach((s) => {
        servicioEstructura = {
          value: s.id,
          label: s.name,
        };

        arrayServicios.push(servicioEstructura);
      });
      
    

      setServicios(arrayServicios);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    
    fetchEmpleado();
    fetchZones();
    fetchSubscriptions();

  },[]);

  // handle onChange event of the dropdown servicio alta empleado
  const handleChangeSuscrip = (e) => {
    setSelectedValueSus(e);
  };

  // handle onChange event of the dropdown servicio editar empleado
  const handleChangeSuscripEdit = (e) => {
    setSelectedValueSusEdit(e);
  };

  // handle onChange event of the dropdown zona alta empleado
  const handleChangeZona = e => {
    setSelectedValueZona(e.value);
  }  

  // handle onChange event of the dropdown zona editar empleado
  const handleChangeZonaEdit = e => {
    setLabelZonaEditar(e.value);
  }
  
  const GuardarEmpleado = async () => {
    setShowModalAgregar(false);

    let empleado = {}

   if(selectedValueSus.length > 0){
     let arrayIdSuscripciones = []
     selectedValueSus.forEach((suscripcion) => {
      arrayIdSuscripciones.push(suscripcion.value)
     })

     
     empleado = {
      'id': $("#cedula").val(),
      'name': $("#nombre").val(),
      'password': $("#password").val(),
      'speciality': $("#speciality").val(),
      'phone': $("#phone").val(),
      'email': $("#email").val(),
      'zone_id': selectedValueZona,
      'subscriptions': arrayIdSuscripciones
    };

   }else{

    empleado = {
      'id': $("#cedula").val(),
      'name': $("#nombre").val(),
      'password': $("#password").val(),
      'speciality': $("#speciality").val(),
      'phone': $("#phone").val(),
      'email': $("#email").val(),
      'zone_id': selectedValueZona
    };
   }

    let json = JSON.stringify(empleado)

      let settings = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type' : 'application/json; charset=UTF-8',
          'Authorization':'Bearer ' +  x
        },
        body: json 
      }

      const resp = await fetch('/medical_doctor/1', settings)
      if (resp.status === 201) {
        swal({
          title: "Médico creado.",
          icon: "success",
          button: "OK",
        });
      
        setSelectedValueSus(null)
        await fetchEmpleado();
        
        
        
        
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
      $("#speciality").val('');
      $("#phone").val('');
      $("#email").val('');

      let defaultValueServicio = {
        value: 'default',
        label: 'Servicios',
      };

      setSelectedValueSus(defaultValueServicio)

      // selectZonaRef.current.select.clearValue();
      // selectedValueSus.current.select.clearValue();


      
      

  }

  const eliminarRegistro = async (idempleado) => {
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

        await fetch('/medical_doctor/'+ `${idempleado}`, settings)
        
        swal({
          title: "Médico eliminado.",
          icon: "success",
          button: "OK",
        });
        fetchEmpleado();
      
        
      }
    })
  }

  const editarEmpleado = (objetoempleado) => {

    //seteo inputs en el form
    $("#idedit").val(objetoempleado.id);
    $("#nombreedit").val(objetoempleado.name);
    $("#passwordedit").val(objetoempleado.password);
    $("#specialityedit").val(objetoempleado.speciality);
    $("#phoneedit").val(objetoempleado.phone);
    $("#emailedit").val(objetoempleado.email);
    setLabelZonaEditar(objetoempleado.zone.name);

    let arraySuscr = []
    let suscrEstructura = []

    objetoempleado.subscriptions.forEach((idSusc)=>{

      servicios.forEach((serv) => {
        if(serv.value === idSusc){
          
          suscrEstructura = {
            value: idSusc,
            label: serv.label
          }
          arraySuscr.push(suscrEstructura)
        }
      })
    })
    setSelectedValueSusEdit(arraySuscr)

    setShowModalEditar(true);
  }

  const SubmitEditarempleado = async () => {
    setShowModalEditar(false);

    let idZona = ''
    zonas.forEach((z) => {
      if(z.name ===  labelZonaEditar|| z.id === labelZonaEditar){
        idZona = z.id
      }
    })

    let empleadoid = $("#idedit").val();

    let empleado = {}

   if(selectedValueSusEdit.length > 0){

     let arrayIdSuscripciones = []
     selectedValueSusEdit.forEach((suscripcion) => {
      arrayIdSuscripciones.push(suscripcion.value)
     })

     empleado = {
      'id': empleadoid,
      'name': $("#nombreedit").val(),
      'password':$("#passwordedit").val(),
      'speciality': $("#specialityedit").val(),
      'phone': $("#phoneedit").val(),
      'email': $("#emailedit").val(),
      'zone_id': idZona,
      'subscriptions': arrayIdSuscripciones
    };

   }else{

     empleado = {
      'id': empleadoid,
      'name': $("#nombreedit").val(),
      'password':$("#passwordedit").val(),
      'speciality': $("#specialityedit").val(),
      'phone': $("#phoneedit").val(),
      'email': $("#emailedit").val(),
      'zone_id': idZona
      
    };
  }


    let json = JSON.stringify(empleado)
    let settings = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json; charset=UTF-8',
        'Authorization':'Bearer ' +  x
      },
      body: json 
    }

    await fetch('/medical_doctor/' + `${empleadoid}`, settings)
    
    swal({
      title: "Empleado editado",
      icon: "success",
      button: "OK",
    });

    fetchEmpleado();
    
    //limpio inputs
    $("#nombreedit").val('');
    $("#passwordedit").val('');
    $("#specialityedit").val('');
    $("#phoneedit").val('');
    $("#emailedit").val(''); 
      
    
  }

  const GuardarArchivoCSV = async () =>{
    setShowModalImportar(false)
    // eslint-disable-next-line array-callback-return
    let arrayMedicosNuevos = []
    fileCSV.forEach( (empleado) => {
      
      let subscripciones = []

      let empleadoNuevo = {
        'id': empleado.id.toString(),
        'name': empleado.name,
        'password': empleado.name,
        'speciality': empleado.speciality,
        'phone': empleado.phone.toString(),
        'email': empleado.email,
        'zone_id': empleado.zone_id,
        'subscriptions': subscripciones
      }

      arrayMedicosNuevos.push(empleadoNuevo);
    })

    let settings = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json',
        'Authorization':'Bearer ' +  x
      },
      body: JSON.stringify({"MDs": arrayMedicosNuevos }) 
    }
    

    const resp = await fetch("/medical_doctors", settings);
    resp.json().then(function(result) {
      let respServidor = result.MDs
      let cantEmplAgregar = result.MDs.length
      let cantEmpRepetidos = 0
      let habianRepetidos = false
      respServidor.forEach((res) =>{
        if(res[1] === 400){
          habianRepetidos = true
          cantEmpRepetidos = cantEmpRepetidos + 1
        }
      })

      if(cantEmpRepetidos === cantEmplAgregar){
        swal({
          title: "Los empleados ya están ingresados.",
          icon: "error",
          button: "OK",
        });
      }
      else if (habianRepetidos){
        swal({
          title: "Empleados guardados correctamente.",
          text: "Se descartaron los empleados repetidos.",
          icon: "success",
          button: "OK",
        });
      }else{
        swal({
        title: "Empleados guardados correctamente.",
        icon: "success",
        button: "OK",
      });
      }

   })
      
      fetchEmpleado();

  }

  const handleForce = (data, fileInfo) => {
    setFileCSV(data);
  }
  
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
  };

  const changeVisibilityPass = () => {
    if(showPassword){
      setShowPassword(false)
    }else{
      setShowPassword(true)
    }
  }

  const changeVisibilityPassEdit = () => {
    if(showPasswordEdit){
      setShowPasswordEdit(false)
    }else{
      setShowPasswordEdit(true)
    }
  }

  const checkEmail = () =>{

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let resultado = re.test(String($("#email").val()).toLowerCase());
    // si es falso, no es valido
    if(!resultado){
      setErrorEmail(false)
      $(':input[id="botonGuardarEmpleado"]').prop('disabled', true)
      setColorBoton('gray')
    }else{
      setErrorEmail(true)
      $(':input[id="botonGuardarEmpleado"]').prop('disabled', false)
      setColorBoton('green')
    }
    
  }
  
  
  return (
    <div>
      <div
        id="titleComponent"
        className="flex justify-center font-extrabold items-center text-center text-xl tracking-widest bg-gray-400 h-12 mb-6"
      >
        <h1>EMPLEADOS</h1>
      </div>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          {/* FILTROS */}
          <div className="p-2 flex items-center justify-between">
            <div className="bg-white flex items-center rounded-full shadow-xl w-80 h-3">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 28 28"
                className="w-6 h-6"
                style={{
                  marginLeft: "18em",
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
                placeholder="Buscar empleado, especialidad"
                onChange={(event) => setInputFilter(event.target.value)}
              />
            </div>
            <div className="inline-flex">
              <button
                onClick={(e) => setShowModalAgregar(true)}
                className="bg-blue-300 text-white text-sm font-extrabold hover:bg-blue-500 hover:border-transparent pt-1 border-b-4 border-blue-400 rounded-full h-8 inline-flex items-center w-32"
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
                <span className="px-1">EMPLEADO</span>
              </button>
              <div
                className="bg-yellow-300 text-white text-sm font-bold hover:bg-yellow-500 hover:border-transparent border-b-4 border-yellow-500 rounded-full h-8 inline-flex items-center w-28 ml-1 pt-1"
                onClick={(e) => setShowModalImportar(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 pl-1 pb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="px-1">IMPORTAR</span>
              </div>
              <a
                className="bg-gray-600 text-white text-sm font-bold hover:bg-gray-800 hover:border-transparent border-b-4 border-gray-800 rounded-full h-8 inline-flex items-center w-24 ml-1 pt-1"
                href="/zonas"
              >
                <i className="fas fa-globe-americas ml-2"></i>
                <span className="px-1">ZONAS</span>
              </a>
            </div>
          </div>

          {/* TABLA */}
          <div className="-mx-4 px-6 py-4 overflow-x-auto mt-7">
            <div className="inline-block min-w-full shadow rounded overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="px-5 text-center text-xs bg-gray-300 font-bold text-black uppercase tracking-widest h-14 border">
                    <th>NOMBRE</th>
                    <th>ESPECIALIDAD</th>
                    <th>TELEFONO</th>
                    <th>EMAIL</th>
                    <th>ZONA</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados
                    .filter(
                      (empleado) =>
                        empleado.name
                          .toUpperCase()
                          .includes(inputFilter.toUpperCase()) ||
                        empleado.speciality
                          .toUpperCase()
                          .includes(inputFilter.toUpperCase()) ||
                        inputFilter === ""
                    )
                    .map((empleado) => (
                      <tr className="border-b" key={empleado.id}>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm w-2/5">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {empleado.name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {empleado.speciality}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {empleado.phone}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {empleado.email}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {empleado.zone.name}
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
                              onClick={() => editarEmpleado(empleado)}
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
                              onClick={() => eliminarRegistro(empleado.id)}
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
          Ingrese empleado
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-2 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div
                  className="relative"
                  style={{ marginBottom: "2em", marginTop: "1em" }}
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
                <div
                  className="relative inline-flex"
                  style={{ marginBottom: "2em" }}
                >
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Contraseña"
                  />
                  <i
                    className="fas fa-eye-slash"
                    onClick={(e) => changeVisibilityPass()}
                  ></i>
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Contraseña
                  </label>
                </div>
                <div className="relative" >
                  <input
                    autoComplete="off"
                    id="cedula"
                    name="cedula"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Cédula"
                  />
                  <label
                    htmlFor="cedula"
                    className="absolute left-0 -top-6 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Cédula
                  </label>
                </div>
                <div className="relative" >
                  <Select
                    id="selectZona"

                    className="w-58"
                    value={zonesSelect.find((obj) => obj.value === selectedValueZona)}
                    options={zonesSelect}
                    placeholder="Zona"
                    onChange={handleChangeZona}
                  />
                </div>
                <div className="relative" style={{ marginBottom: "2em"}}>
                    <Select
                    isMulti
                      id="selectServicio"
                      
                      className="w-58"
                      value={servicios.find(
                        (obj) => obj.value === selectedValueSus
                      )}
                      options={servicios}
                      placeholder="Servicio"
                      onChange={handleChangeSuscrip}
                    />
                  </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Email"
                    onBlur={() => checkEmail()}
                  />
                  <span
                    id="errorEmail"
                    hidden={errorEmail}
                    className="text-red-700 mb-2"
                  >
                    Email inválido
                  </span>
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "2em" }}>
                  <input
                    autoComplete="off"
                    id="speciality"
                    name="speciality"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Speciality"
                  />
                  <label
                    htmlFor="speciality"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Especialidad
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="phone"
                    name="phone"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Telefono"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Teléfono
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
            id="botonGuardarEmpleado"
            color={colorBoton}
            onClick={(e) => GuardarEmpleado()}
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
          Editar empleado
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
                <div className="relative inline-flex" style={{ marginBottom: "2em" }}>
                <input
                    autoComplete="off"
                    id="passwordedit"
                    name="passwordedit"
                    type={showPasswordEdit ? "text" : "password"}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Contraseña"
                  />
                  <i
                    className="fas fa-eye-slash"
                    onClick={(e) => changeVisibilityPassEdit()}
                  ></i>
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Contraseña
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "2em" }}>
                  <input
                    autoComplete="off"
                    id="specialityedit"
                    name="speciality"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Speciality"
                  />
                  <label
                    htmlFor="speciality"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Especialidad
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "2em" }}>
                  <input
                    autoComplete="off"
                    id="phoneedit"
                    name="phone"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Telefono"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Teléfono
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "0.8em" }}>
                  <input
                    autoComplete="off"
                    id="emailedit"
                    name="email"
                    type="email"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>
                <div className="relative" style={{ marginBottom: "1em" }}>
                  <Select
                    id="selectZonaEdit"
                    className="w-58"
                    value={zonesSelect.find((obj) => obj.label === labelZonaEditar)}
                    options={zonesSelect}
                    placeholder="Zona"
                    onChange={handleChangeZonaEdit}
                  />
                </div>
                <div className="relative" >
                    <Select
                      isMulti
                      id="selectServicioEdit"
                      className="w-58"
                      value={selectedValueSusEdit}
                      options={servicios}
                      placeholder="Servicio"
                      onChange={handleChangeSuscripEdit}
                    />
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
            onClick={(e) => SubmitEditarempleado()}
            ripple="light"
          >
            GUARDAR
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal importar csv  */}
      <Modal
        size="regular"
        active={showModalImportar}
        toggler={() => setShowModalImportar(false)}
      >
        <ModalHeader
          toggler={() => setShowModalImportar(false)}
          className="relative"
        >
          Importar empleados (.csv)
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <CSVReader
                    cssClass="react-csv-input"
                    onFileLoaded={handleForce}
                    parserOptions={papaparseOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModalImportar(false)}
            ripple="dark"
          >
            CANCELAR
          </Button>

          <Button
            color="green"
            onClick={(e) => GuardarArchivoCSV()}
            ripple="light"
          >
            GUARDAR
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );


};




export default Empleados;
