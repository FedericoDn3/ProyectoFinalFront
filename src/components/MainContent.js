import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from './HeaderAdmin'
import Empleados from './Empleados/Empleados';
import Zonas from './Zonas/Zonas';
import Reportes from './Reportes/Reportes';
import Guardias from './GuardiasAdmin/GuardiasAdmin';
import Servicios from './Servicios/Servicios';
import Calendario from './CalendarioAdmin/CalendarioAdmin';
import Admins from './Admins/Admins';

const MainContent = ( {isStatic, isClosed, setClosed, user} ) => {
    

    return (
        
        <main className="flex-grow flex flex-col min-h-screen">
            
            <Header isStatic = {isStatic} isClosed = {isClosed} setClosed = {setClosed} user ={user }/>

            {/* Contenido dinámico */}
            
                <Switch>
                    
                    {/* <Route exact path="/">
                        <img src="imgBackground.png" alt="Background img" width="100%" height="100%"/>
                    </Route>  */}

                    <Route path="/calendario">
                        <Calendario  />
                    </Route>

                    {/* Rutas Servicios */}
                    <Route path="/servicios">
                        <Servicios/>
                    </Route>

                    <Route path="/guardias">
                        <Guardias />
                    </Route>

                    {/* Rutas Empleados */}
                    <Route path="/empleados">
                        <Empleados/>
                    </Route>
                    <Route path="/zonas">
                        <Zonas />
                    </Route>
                    <Route path="/reportes">
                        <Reportes/>
                    </Route>
                    <Route path="/admins">
                        <Admins/>
                    </Route>
                </Switch>
            
            

        </main>
        
    );
}

export default MainContent
