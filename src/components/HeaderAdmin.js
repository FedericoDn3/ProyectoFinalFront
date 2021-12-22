import React from "react";

const Header = ({ isStatic, isClosed, setClosed, user }) => {

  const nombre = sessionStorage.getItem('name').replace(/['"]+/g, '')

  const Logout = () => {
    alert("Hasta la Proxima");
    sessionStorage.clear()
    window.location.reload(false);
  }
  
    return (
      // Toolbar
      <header className="bg-white border-b h-10 flex items-center justify-center">
        {!isStatic &&
          (isClosed ? (
            <button
              tabIndex="1"
              aria-label="Abrir menú"
              title="Abrir menú"
              className="w-10 p-1"
              onClick={() => setClosed(false)}
            >
              <svg
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          ) : (
            <button
              tabIndex="1"
              aria-label="Cerrar menú"
              title="Cerrar menú"
              className="w-10 p-1"
              onClick={() => setClosed(true)}
            >
              <svg
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          ))}

        <div className="flex flex-grow items-center justify-end px-3">
          <h2 className="text-blue-700 px-2">{nombre}</h2>
          <button onClick={() => Logout()} className="items-center bg-transparent h-8 text-blue-700 b-1 border border-blue-400 text-sm font-bold ml-2 px-4 rounded-full flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>
    );
}

export default Header;

