import React, { useEffect, useState } from "react";
//import { Link } from "react-router-dom";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import $ from "jquery";
import Select from "react-select";
import swal from "sweetalert";

const Guardias = () => {
  const [showModal, setShowModal] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);

  const [medicosSelect, setMedicosSelect] = useState([]);
  const [listaGuardias, setListaGuardias] = useState([]);
  const [listaGuardiasGrupo, setListaGuardiasGrupo] = useState([]);
  const [idGrupo, setIdGrupo] = useState('');


  const [inputFilterServicio, setInputFilterServicio] = useState("");

  const [selectedValue, setSelectedValue] = useState("");
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [newValueServicioEditar, setNewValueServicioEditar] = useState("");
  const [showModalAsignar, setShowModalAsignar] = useState(false);
  const [showModalLista, setShowModalLista] = useState(false);

  const [selectedValueMedico, setSelectedValueMedico] = useState("");
  const [repetirChecked, setRepetirChecked] = useState(false);

  const token = sessionStorage.getItem("ftoken");
  const x = token.replace(/['"]+/g, "");

  const [checkboxList, setCheckboxList] = useState([
    {
      id: "1",
      name: "D",
      isChecked: false,
    },
    {
      id: "2",
      name: "L",
      isChecked: false,
    },
    {
      id: "3",
      name: "M",
      isChecked: false,
    },
    {
      id: "4",
      name: "M",
      isChecked: false,
    },
    {
      id: "5",
      name: "J",
      isChecked: false,
    },
    {
      id: "6",
      name: "V",
      isChecked: false,
    },
    {
      id: "7",
      name: "S",
      isChecked: false,
    },
  ]);

  const onChangeCheckBox = (event, optionId) => {
    

    checkboxList.forEach((chkItem) => {
      if (chkItem.id === optionId) {
        chkItem.isChecked = event.target.checked;
      }
    });

    setCheckboxList(checkboxList);
  };

  const fetchGuards = async () => {
    let settings = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: "Bearer " + x,
      },
    };

    try {
      
      const respMedicos = await fetch("/medical_doctors", settings);
      const jsonMedicos = await respMedicos.json();


      let guardiaEstructura = [];
      let medicoSelectEstructura = [];

      const arrayListaGuardia = [];
      const arrayMedicosSelect = [];

      let medicos = jsonMedicos.medical_doctors;
      let nombreMedico = "";

      medicos.forEach((medico) => {
        medicoSelectEstructura = {
          value: medico.id,
          label: medico.name,
        };
        arrayMedicosSelect.push(medicoSelectEstructura);
      });
      setMedicosSelect(arrayMedicosSelect);

      const re = await fetch("/groups", settings);
      const jsonre = await re.json();
      let grupos = jsonre.guards;

      grupos.forEach((g) => {
        medicos.forEach((medico) => {
          if (g.medical_doctor_id !== null) {
            if (g.medical_doctor_id === medico.id) nombreMedico = medico.name;
          } else {
            nombreMedico = "Sin asignar";
          }
        });

        guardiaEstructura = {
          id: g.id,
          subscription_name: g.subscription_name,
          date: g.date,
          start_time: g.start_time,
          end_time: g.end_time,
          medicoNombre: nombreMedico,
        };
        arrayListaGuardia.push(guardiaEstructura);
      });
      setListaGuardias(arrayListaGuardia);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    
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

    fetchGuards();
    fetchSubscriptions();
  }, []);

  // handle onChange event of the dropdown servicio alta guardia
  const handleChange = (e) => {
    setSelectedValue(e.value);
  };

  const cambiarRepetirChecked = (e) => {
    if (repetirChecked) {
      setRepetirChecked(false);
    } else {
      setRepetirChecked(true);
    }
  };

  const GuardarGuardia = async () => {
    setShowModal(false);
    let guardia = {};

    // si quiere insertar muchas guardias
    if (repetirChecked) {
      let daysChecked = [];
      checkboxList.forEach((chkItem) => {
        let day = "";
        if (chkItem.isChecked) {
          switch (chkItem.id) {
            case "1":
              day = "Sunday";
              break;
            case "2":
              day = "Monday";
              break;
            case "3":
              day = "Tuesday";
              break;
            case "4":
              day = "Wednesday";
              break;
            case "5":
              day = "Thursday";
              break;
            case "6":
              day = "Friday";
              break;
            case "7":
              day = "Saturday";
              break;
            default:
              break;
          }
          daysChecked.push(day);
        }
      })

      guardia = {
        subscription_id: selectedValue,
        zone_id: 1,
        date: $("#date").val(),
        start_time: $("#horainicio").val(),
        end_time: $("#horafin").val(),
        quantity: $("#cantMedicos").val(),
        repeat: daysChecked,
      };



      let json = JSON.stringify(guardia);

      let settings = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + x,
        },
        body: json,
      };

      const resp = await fetch("/guards", settings);
      if (resp.status === 201) {
        swal({
          title: "Guardias creadas.",
          icon: "success",
          button: "OK",
        });
        await fetchGuards();
      
      } else {
        swal({
          title: "No se pudo crear.",
          icon: "error",
          button: "OK",
        });
      }
    } else { // inserta una sola guardia

      guardia = {
        subscription_id: selectedValue,
        zone_id: 1,
        date: $("#date").val(),
        start_time: $("#horainicio").val(),
        end_time: $("#horafin").val(),
        quantity: $("#cantMedicos").val(),
      };



      let json = JSON.stringify(guardia);

      let settings = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + x,
        },
        body: json,
      };

      const resp = await fetch("/guard/1", settings);
      if (resp.status === 201) {
        swal({
          title: "Guardia creada.",
          icon: "success",
          button: "OK",
        });
        await fetchGuards();
      } else {
        swal({
          title: "No se pudo crear.",
          icon: "error",
          button: "OK",
        });
      }
    }

    //limpio inputs
    $("#selectServicio").val("");
    $("#date").val("");
    $("#horainicio").val("");
    $("#horafin").val("");
    $("#cantMedicos").val("");
    $("#boolRepetir").val(false);
    // $("#divDias").hide();
  };

  const eliminarRegistro = async (idguardia) => {
    let settings = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + x,
      },
    };

    swal({
      title: "Eliminar",
      text: "¿Estás seguro que deseas eliminar este registro?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then(async (respuesta) => {
      if (respuesta) {
        setShowModalLista(false)
        const resp = await fetch("/guard/" + `${idguardia}`, settings);
        
        
        swal({
          title: "Guardia eliminada.",
          icon: "success",
          button: "OK",
        });
        
        await fetchGuards();
        
        await handleClickRow(idGrupo)

      }
    });
  };

  const editarRegistro = (objetoguardia) => {
    //seteo inputs en el form

    $("#idedit").val(objetoguardia.id);
    setNewValueServicioEditar(objetoguardia.subscription_name);
    $("#dateedit").val(objetoguardia.date);
    $("#horainicioedit").val(objetoguardia.start_time);
    $("#horafinedit").val(objetoguardia.end_time);

    setShowModalLista(false);
    setShowModalEditar(true);
  };

  const SubmitEditarGuardia = async () => {
    setShowModalEditar(false);

    let idSusc = "";
    suscripciones.forEach((s) => {
      if (
        s.name === newValueServicioEditar ||
        s.id === newValueServicioEditar
      ) {
        idSusc = s.id;
      }
    });

    let guardiaid = $("#idedit").val();
    let guardia = {
      subscription_id: idSusc,
      zone_id: 1,
      date: $("#dateedit").val(),
      start_time: $("#horainicioedit").val(),
      end_time: $("#horafinedit").val(),
    };

    let json = JSON.stringify(guardia);
    let settings = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + x,
      },
      body: json,
    };
    await fetch("/guard/" + `${guardiaid}`, settings);

    swal({
      title: "Guardia editada",
      icon: "success",
      button: "OK",
    });

    await fetchGuards();
    setShowModalEditar(false)
    await handleClickRow(idGrupo)

    $("#selectServicioedit").val("");
    $("#dateedit").val("");
    $("#horainicioedit").val("");
    $("#horafinedit").val("");
  };

  // handle onChange event of the dropdown servicio editar guardia
  const handleChangeServicioEditar = (e) => {

    setNewValueServicioEditar(e.value);
  };

  // handle onChange event of the dropdown medico asignar guardia
  const handleChangeMedico = (e) => {
    setSelectedValueMedico(e.value);
  };

  //muestra modal para asignar medico a la guardia
  const asignarMedico = (idguardia) => {
    $("#idguardia").val(idguardia);
    setShowModalLista(false);
    setShowModalAsignar(true);
  };

  const GuardarAsignacion = async () => {
    setShowModalAsignar(false);
    let idmedico = selectedValueMedico;
    let idguardia = $("#idguardia").val();


    let settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + x,
      },
    };

    await fetch(`/assignment/${idmedico}/${idguardia}`, settings);

    swal({
      title: "Guardia asignada.",
      icon: "success",
      button: "OK",
    });
    await fetchGuards();
    setShowModalLista(false)

  };

  // para ver la lista de guardias de un grupo
  const handleClickRow = async (idguardia) => {
    let settings = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: "Bearer " + x,
      },
    };
    setIdGrupo(idguardia)
    const respMedicos = await fetch("/medical_doctors", settings);
      const jsonMedicos = await respMedicos.json();


    const resLista = await fetch(`/group/${idguardia}`, settings);
    const jsonRes = await resLista.json();

    

    
    let medicos = jsonMedicos.medical_doctors;
    let nombreMedico = "";
    let groupsList = jsonRes.guards
    let guardiaEstructura = [];
    const arrayListaGuardiaGrupo = [];


    groupsList.forEach((gua) => {
      
      medicos.forEach((medico) => {
        if (gua.medical_doctor_id !== null) {
          if (gua.medical_doctor_id === medico.id) nombreMedico = medico.name;
        } else {
          nombreMedico = "Sin asignar";
        }
      });

      guardiaEstructura = {
        id: gua.id,
        subscription_name: gua.subscription_name,
        date: gua.date,
        start_time: gua.start_time,
        end_time: gua.end_time,
        medicoNombre: nombreMedico,
      };
      arrayListaGuardiaGrupo.push(guardiaEstructura);
    });
    setListaGuardiasGrupo(arrayListaGuardiaGrupo);

    setShowModalLista(true);
  };

  return (
    <div>
      <div
        id="titleComponent"
        className="flex justify-center font-extrabold items-center text-center text-xl tracking-widest bg-gray-400 h-12 mb-6"
      >
        <h1>GUARDIAS</h1>
      </div>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          {/* FILTROS */}
          <div className="p-2 flex items-center justify-between">
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
            <div className="inline-flex">
              <button
                onClick={(e) => setShowModal(true)}
                className="mx-2 bg-blue-300 text-white text-sm font-extrabold hover:bg-blue-500 hover:border-transparent pt-1 border-b-4 border-blue-400 rounded-full h-8 inline-flex items-center w-28"
              >
                <i className="fas fa-plus-circle fa-lg mx-2"></i>
                <span>GUARDIA</span>
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
                    <th>SERVICIO</th>
                    <th>FECHA</th>
                    <th>HORA INICIO</th>
                    <th>HORA FIN</th>
                    <th>ACCIONES</th>
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
                    )
                    .map((guardia) => (
                      <tr
                        className="border-b bg-white hover:bg-gray-100"
                        key={guardia.id}
                      >
                        <td className="px-5 py-5 border-gray-200  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.subscription_name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.date}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.start_time}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-gray-200  text-sm">
                          <p className="text-gray-900 whitespace-no-wrap text-center">
                            {guardia.end_time}
                          </p>
                        </td>

                        <td className="px-5 py-5 border-gray-200  text-sm">
                          <div className="flex justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-purple-900 hover:text-gray-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              onClick={() => handleClickRow(guardia.id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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

        {/* Modal agregar */}
        <Modal
          size="regular"
          active={showModal}
          toggler={() => setShowModal(false)}
        >
          <ModalHeader toggler={() => setShowModal(false)}>
            Ingrese guardia
          </ModalHeader>
          <ModalBody>
            <div className=" mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <Select
                      id="selectServicio"
                      className="w-58"
                      value={servicios.find(
                        (obj) => obj.value === selectedValue
                      )}
                      options={servicios}
                      placeholder="Servicio"
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="relative"
                    style={{ marginBottom: "2em", marginTop: "2em" }}
                  >
                    <input
                      autoComplete="off"
                      id="date"
                      name="date"
                      type="date"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Fecha"
                    />
                    <label
                      htmlFor="date"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Fecha
                    </label>
                  </div>
                  <div className="relative" style={{ marginBottom: "2em" }}>
                    <input
                      autoComplete="off"
                      id="horainicio"
                      name="horainicio"
                      type="time"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Hora inicio"
                    />
                    <label
                      htmlFor="horainicio"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Hora inicio
                    </label>
                  </div>
                  <div className="relative" style={{ marginBottom: "2em" }}>
                    <input
                      autoComplete="off"
                      id="horafin"
                      name="horafin"
                      type="time"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Hora fin"
                    />
                    <label
                      htmlFor="horafin"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Hora fin
                    </label>
                  </div>
                  <div className="relative" style={{ marginBottom: "2em" }}>
                    <input
                      autoComplete="off"
                      id="cantMedicos"
                      name="cantMedicos"
                      type="number"
                      min="1" max="50"
                      onKeyPress={function(event){event.preventDefault()}}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    />
                    <label
                      htmlFor="cantMedicos"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Cantidad Médicos
                    </label>
                  </div>
                  <div className="relative flex justify-center items-center">
                    <label
                      htmlFor="repetir"
                      className="form-check-label text-black font-extrabold text-sm block"
                    >
                      Repetir
                    </label>
                    <input
                      autoComplete="off"
                      id="boolRepetir"
                      name="boolRepetir"
                      type="checkbox"
                      onClick={(e) => cambiarRepetirChecked()}
                      className="form-check-input h-4 relative flex w-full mr-36"
                    />
                  </div>

                  {repetirChecked ? (
                    <div className="relative flex">
                      {checkboxList.map((option) => (
                        <div className="form-check mr-3" key={option.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="daysOfWeek"
                            id={option.id}
                            //value={option.id}
                            //checked={option.isChecked}
                            onChange={(e) => onChangeCheckBox(e, option.id)}
                          />
                          <label
                            className="form-check-label  block"
                            htmlFor={option.id}
                          >
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => setShowModal(false)}
              ripple="dark"
            >
              CANCELAR
            </Button>

            <Button
              color="green"
              onClick={(e) => GuardarGuardia()}
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
            Editar guardia
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
                  <div className="relative">
                    <Select
                      id="selectServicioedit"
                      className="w-58"
                      value={servicios.find(
                        (obj) => obj.label === newValueServicioEditar
                      )}
                      options={servicios}
                      placeholder="Servicio"
                      onChange={handleChangeServicioEditar}
                    />
                  </div>
                  <div
                    className="relative"
                    style={{ marginBottom: "2em", marginTop: "2em" }}
                  >
                    <input
                      autoComplete="off"
                      id="dateedit"
                      name="date"
                      type="date"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Fecha"
                    />
                    <label
                      htmlFor="date"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Fecha
                    </label>
                  </div>
                  <div className="relative" style={{ marginBottom: "2em" }}>
                    <input
                      autoComplete="off"
                      id="horainicioedit"
                      name="horainicio"
                      type="time"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Hora inicio"
                    />
                    <label
                      htmlFor="horainicio"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Hora inicio
                    </label>
                  </div>
                  <div className="relative" style={{ marginBottom: "2em" }}>
                    <input
                      autoComplete="off"
                      id="horafinedit"
                      name="horafin"
                      type="time"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Hora fin"
                    />
                    <label
                      htmlFor="horafin"
                      className="absolute left-0 -top-3.5 text-black font-extrabold text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Hora fin
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
              onClick={(e) => SubmitEditarGuardia()}
              ripple="light"
            >
              GUARDAR
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal asignar */}
        <Modal
          size="regular"
          active={showModalAsignar}
          toggler={() => setShowModalAsignar(false)}
        >
          <ModalHeader
            toggler={() => setShowModalAsignar(false)}
            className="mt-4"
          >
            Asignar guardia a un médico
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
                      id="idguardia"
                      name="id"
                      type="hidden"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    />
                  </div>
                  <div className="relative">
                    <Select
                      id="selectMedico"
                      className="w-58"
                      value={medicosSelect.find(
                        (obj) => obj.value === selectedValueMedico
                      )}
                      options={medicosSelect}
                      placeholder="Médicos"
                      onChange={handleChangeMedico}
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
              onClick={(e) => setShowModalAsignar(false)}
              ripple="dark"
            >
              CANCELAR
            </Button>

            <Button
              color="green"
              onClick={(e) => GuardarAsignacion()}
              ripple="light"
            >
              GUARDAR
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal lista guardias de un grupo */}
        <Modal
          size="regular"
          active={showModalLista}
          toggler={() => setShowModalLista(false)}
        >
          <ModalHeader
            toggler={() => setShowModalLista(false)}
            className="mt-4"
          >
            Lista guardias de un grupo
          </ModalHeader>
          <ModalBody>
            <div className=" mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className=" px-6 py-4 overflow-x-auto mt-7">
                    <div className="inline-block shadow rounded overflow-hidden">
                      <table
                        className="table-fixed leading-normal"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr className="px-5 text-center text-xs bg-gray-300 font-bold text-black uppercase tracking-widest h-14 border">
                            <th>SERVICIO</th>
                            <th>FECHA</th>
                            <th>HORA INICIO</th>
                            <th>HORA FIN</th>
                            <th>EMPLEADO</th>
                            <th>ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listaGuardiasGrupo.map((guardiaGrupo) => (
                            <tr className="border-b" key={guardiaGrupo.id}>
                              <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap text-center">
                                  {guardiaGrupo.subscription_name}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap text-center">
                                  {guardiaGrupo.date}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap text-center">
                                  {guardiaGrupo.start_time}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap text-center">
                                  {guardiaGrupo.end_time}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap text-center">
                                  {guardiaGrupo.medicoNombre}
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
                                    onClick={() => editarRegistro(guardiaGrupo)}
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
                                    onClick={() =>
                                      eliminarRegistro(guardiaGrupo.id)
                                    }
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-purple-900 hover:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() =>
                                      asignarMedico(guardiaGrupo.id)
                                    }
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => setShowModalLista(false)}
              ripple="dark"
            >
              CERRAR
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default Guardias;
