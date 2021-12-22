import React from 'react'
import {
    NavLink
  } from "react-router-dom";

export default function Aside(){


    return (
      // Sidebar
      <aside className="bg-white w-56 min-h-screen flex flex-col">
        {/* Logo */}
        <div className="bg-white border-r border-b px-1 h-10 flex items-center">
          <img src="simboloMedicina.png" alt="Simbolo medicina" width="35" height="25" style={{float:"left"}} />
          <span className="py-2 px-2 text-blue-900 font-bold"> Guardias Médicas</span>
        </div>

        {/* Left menu */}
        
          <div className="border-r flex-grow mt-4">
            <nav>
              <ul>
                <li className="p-3">
                  <NavLink to="/calendario" activeStyle={{ fontWeight: "bolder", color: "DodgerBlue" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ float: "left", marginRight: "0.5em" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Calendario
                  </NavLink>
                </li>
                <li className="p-3">
                  <NavLink to="/servicios" activeStyle={{ fontWeight: "bolder", color: "DodgerBlue" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ float: "left", marginRight: "0.5em" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    Servicios
                  </NavLink>
                </li>
                <li className="p-3">
                  <NavLink to="/guardias" activeStyle={{ fontWeight: "bolder", color: "DodgerBlue" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ float: "left", marginRight: "0.5em" }}

                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Guardias
                  </NavLink>
                </li>
                <li className="p-3">
                  <NavLink to="/empleados" activeStyle={{ fontWeight: "bolder", color: "DodgerBlue" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      style={{ float: "left", marginRight: "0.5em" }}
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Empleados
                  </NavLink>
                </li>
                
                <li className="p-3">
                  <NavLink to="/reportes" activeStyle={{ fontWeight: "bolder", color: "DodgerBlue" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ float: "left", marginRight: "0.5em" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                    Reportes
                  </NavLink>
                </li>

                <li className="p-3">
                  <NavLink to="/admins" activeStyle={{ fontWeight: "bolder", color: "DodgerBlue" }}>
                  <i className="fas fa-user-shield fa-lg mr-1"></i>
                    Administradores
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        
      </aside>
    );
}

