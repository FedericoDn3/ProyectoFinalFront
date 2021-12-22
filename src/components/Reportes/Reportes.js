import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Bar } from "react-chartjs-2";

const Reportes = () => {


  const [selectedValueMes, setSelectedValueMes] = useState();
  const [selectedValueAnio, setSelectedValueAnio] = useState(2021);

  const token = sessionStorage.getItem("ftoken");
  const x = token.replace(/['"]+/g, "");

  const [datosGraficas, setDatosGraficas] = useState ({
  
  cantidadMedicos: 0,
  cantidadServicios: 0,

  nombresServicios: [],
  cantMedicosServicios: [],
  coloresMedicosServicio:[],

  nombresMedicos: [],
  cantTiempoDemorado: [],
  coloresTiempoAceptacion: [],

  cantGuardiasAsignadas:[],
  coloresCantAceptadas: []

})

  // Meses filtro
  const [mesesList] = useState([
    {
      value: 1,
      label: "Enero",
    },
    {
      value: 2,
      label: "Febrero",
    },
    {
      value: 3,
      label: "Marzo",
    },
    {
      value: 4,
      label: "Abril",
    },
    {
      value: 5,
      label: "Mayo",
    },
    {
      value: 6,
      label: "Junio",
    },
    {
      value: 7,
      label: "Julio",
    },
    {
      value: 8,
      label: "Agosto",
    },
    {
      value: 9,
      label: "Setiembre",
    },
    {
      value: 10,
      label: "Octubre",
    },
    {
      value: 11,
      label: "Noviembre",
    },
    {
      value: 12,
      label: "Diciembre",
    },
  ]);

  useEffect(() => {
    const d = new Date();
    let month = d.getMonth() + 1;
    setSelectedValueMes(month)

    let year = d.getFullYear();
    setSelectedValueAnio(year);
  }, []);

  useEffect(() => {

    const fetchReportes = async () => {

      let filtro = {
        'year': selectedValueAnio,
        'month': selectedValueMes
      };
  
      let json = JSON.stringify(filtro);
  
      let settings = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + x
        },
        body: json
      }
  
      try {
        const response = await fetch("/reports", settings);
        const json = await response.json();
  
        // para la grafica medicos con cant guardias aceptadas/asignadas) y tiempo de resp medicos en las guardias
        
        let cantTiempoDemorado = [];
        let nombresMedicos = [];
        let cantGuarAsig = [];
        let cantMed = 0;
        json.average_assignment.forEach((med) => {
         
          cantGuarAsig.push(med.count);
          cantMed++;
          nombresMedicos.push(med.name);
          cantTiempoDemorado.push(med.avg)
        });
        
  
        //datos para Cantidad Medicos por Servicios
        let nombresServicios = [];
        let cantMedicosServicios = [];
        let cantServicios = 0;
        let cantMedicos = 0;
        json.services.forEach((servicio) => {
          cantMedicos = 0;
          nombresServicios.push(servicio.name);
          cantServicios++;
          servicio.medical_doctors.forEach((medico) => {
            cantMedicos++;
          });
          cantMedicosServicios.push(cantMedicos);
        });
  
        let coloresTiempoAceptacion = [],
        coloresCantAceptadas = [],
        coloresMedicosServicio = [];
        for (let i = 0; i < cantMed; i++) {
          coloresTiempoAceptacion.push(colorHEX());
        }
        // --------------
        for (let i = 0; i < cantMed; i++) {
          coloresCantAceptadas.push(colorHEX());
        }
        // --------------
        for (let i = 0; i < cantServicios; i++) {
          coloresMedicosServicio.push(colorHEX());
        }
  
  
  
        let nuevosDatosGraficas = {
          ...datosGraficas,
  
          cantidadMedicos: cantMed,
          cantidadServicios: cantServicios,
          nombresServicios: nombresServicios,
          cantMedicosServicios: cantMedicosServicios,
        
          nombresMedicos: nombresMedicos,
          cantTiempoDemorado: cantTiempoDemorado,
        
          cantGuardiasAsignadas: cantGuarAsig,
  
          coloresMedicosServicio: coloresMedicosServicio,
        coloresTiempoAceptacion: coloresTiempoAceptacion,
        coloresCantAceptadas: coloresCantAceptadas
        }
        setDatosGraficas(nuevosDatosGraficas)
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchReportes();
    
  }, [selectedValueMes, selectedValueAnio]);

  const generarCaracter = () => {
    let caracter = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ];
    let numero = (Math.random() * 15).toFixed(0);
    return caracter[numero];
  };

  const colorHEX = () => {
    let color = "";
    for (let i = 0; i < 6; i++) {
      color = color + generarCaracter();
    }
    return "#" + color;
  };

  

  // data grafico Cantidad guardias que tomaron los medicos
    
  const dataCantAceptadas = {
      labels: datosGraficas.nombresMedicos,
      datasets: [
        {
          label: "",
          backgroundColor: datosGraficas.coloresCantAceptadas,
          data: datosGraficas.cantGuardiasAsignadas,
          fill: false,
          borderColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 1,
        },
      ]
    };
    const opcionesCantAceptadas = {
      responsive: true,
      maintainAspectRatio: false,
    };

  //  data grafico  cant Medicos en cada servicio
  const dataMedicosServicios = {
    labels: datosGraficas.nombresServicios, //['puerta emerge', 'policli', 'domicilio'],
    datasets: [
      {
        label: "",
        data: datosGraficas.cantMedicosServicios,
        fill: false,
        backgroundColor: datosGraficas.coloresMedicosServicio,
        borderColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
      },
    ],
  };
  const opcionesMedicosServicios = {
    responsive: true,
    maintainAspectRatio: false,
  };

  

  // data grafico Tiempo que demoran en aceptar las guardias por cada medico
  const dataTiempoAceptacion = {
    labels: datosGraficas.nombresMedicos,
    datasets: [
      {
        label: "Tiempo demora médicos en aceptar guardia",
        backgroundColor: datosGraficas.coloresTiempoAceptacion,
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        data: datosGraficas.cantTiempoDemorado,
      },
    ],
  };
  const opcionesTiempoAceptacion = {
    responsive: true,
    // scales: {
    //     yAxes: [
    //       {
    //         ticks: {
    //           beginAtZero: true,
    //         },
    //       },
    //     ],
    // }
  };

  // handle onChange event of the dropdown meses
  const handleChangeMes = (e) => {
    setSelectedValueMes(e.value);
  };

  // handle onChange event of the dropdown anios
  const handleChangeAnio = (e) => {
    setSelectedValueAnio(e.target.value >= 2021 && e.target.value < 2100 ? e.target.value : 2021);
  };

  return (
    <div>
      <div
        id="titleComponent"
        className="flex justify-center font-extrabold items-center text-center text-xl tracking-widest bg-gray-400 h-12"
      >
        <h1>REPORTES</h1>
      </div>
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="py-4">
          {/* FILTRO FECHAS */}
          <div className="mb-8 flex items-center justify-start">
            
            <h1 className="font-extrabold m-3">FILTROS</h1>
            <div className="bg-white flex items-center rounded-full shadow-xl h-3 ml-10">
              <Select
                id="selectMeses"
                className="w-44"
                value={mesesList.find((obj) => obj.value === selectedValueMes)}
                options={mesesList}
                placeholder="Meses"
                onChange={handleChangeMes}
              />
            </div>
            <div className="bg-white flex items-center rounded-full shadow-xl h-3 ml-10 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600">{/* "peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" */}
              <input
                id="selectAnio"
                className="text-gray-700 select-none font-medium"
                value={selectedValueAnio}
                placeholder="Años"
                type="number"
                min="2021"
                max="2099"
                minLength="4"
                maxLength="4"
                onChange={handleChangeAnio}
              />
            </div>
          </div>
                
          {/* GRAFICAS */}

          {/* <ReporteTiempoAceptacion dataTiempoAceptacion={ dataTiempoAceptacion } opcionesTiempoAceptacion={opcionesTiempoAceptacion} /> */}


          <div id="divTiempoAceptacion" className="m-3 ml-20 mt-20 w-5/6">
            <h3 className=" text-lg mb-5 mt-3" style={{ marginBottom: "30px" }}>
              Tiempo de respuesta médicos
            </h3>
            <hr className="border-black mb-10"></hr>
            <Bar
              data={dataTiempoAceptacion}
              options={opcionesTiempoAceptacion}
            />
          </div>

          <div
            id="divCantAceptadas"
            className=" m-3 ml-20 mt-20 w-5/6"
            style={{ height: "400px", marginBottom: "30px" }}
          >
            <h3 className=" text-lg mb-5 mt-3">
              Cantidad guardias aceptadas por médico
            </h3>
            <hr className="border-black mb-10"></hr>
            <Bar
              data={dataCantAceptadas}
              options={opcionesCantAceptadas}
              style={{ marginBottom: "30px" }}
            />
          </div>
        
          <div
            id="divMediServ"
            className="m-3 ml-20 mt-24 w-5/6"
            style={{ height: "400px", marginBottom: "15em" }}
          >
            <h3 className=" text-lg mb-5 mt-3">
              Cantidad de médicos por servicio
            </h3>
            <hr className="border-black mb-10"></hr>
            <Bar
              data={dataMedicosServicios}
              options={opcionesMedicosServicios}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Reportes;