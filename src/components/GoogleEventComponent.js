import React, { useState, useEffect } from 'react';
import moment from 'moment'
import G from '../images/G.png'
import GC from '../images/GC.png'
import { signInToGoogle, initClient,getSignedInUserEmail, signOutFromGoogle , publishTheCalenderEvent } from './GoogleApiService';

export default function GoogleEventComponent({misguardias}) {
    const [signedin,setSignedIn] = useState(false);

    const [googleAuthedEmail,setgoogleAuthedEmail] = useState(null);

    useEffect(()=>{
        initClient((success)=>{
            if (success){
                getGoogleAuthorizedEmail();
            }
        });
    },[]);
    
    const getGoogleAuthorizedEmail =async ()=>{
        let email = await getSignedInUserEmail();
        if (email){
            setSignedIn(true)
            setgoogleAuthedEmail(email)
        }
    };
    const getAuthToGoogle =async ()=>{
        let successfull =await signInToGoogle();
        if (successfull){
            getGoogleAuthorizedEmail();
        }
      };
    const _signOutFromGoogle = () => {
        let status = signOutFromGoogle();
        if (status){
            setSignedIn(false);
            setgoogleAuthedEmail(null);
        }
    };
    const submit = (e) =>{
        e.preventDefault();
        var event = null
        misguardias.map(
            (g) => {
                event = {
                    'description': 'Guardia.',
                    'summary':g.subscription_name,
                    'start': {
                        'dateTime':moment(g.start),
                        'timeZone': 'America/Montevideo'
                    },
                    'end': {
                        'dateTime': moment(g.end),
                        'timeZone': 'America/Montevideo'
                    }
                }
               return publishTheCalenderEvent(event)  
           }          
        )
    }



    return (
         <div className='calenderEvent-wrapper'>
            <div className='header'>
            </div>
            {!signedin? <div className='google-login'>
            <button className = 'relative bg-blue-300 p-1 m-1 text-white rounded overflow-visible' onClick={()=>getAuthToGoogle()}> Sincronizar Guardias con Google&nbsp;&nbsp;<img alt="..." src={G} width="20" height="20" className="float-right"/></button>
            </div>:
            <div className='body'>
                <div className='signout'>
                    
                    <button className = 'relative bg-red-200 p-1 m-1 text-white rounded overflow-visible' onClick={()=>_signOutFromGoogle()}>Desconectar</button>
                </div>
                <form>
                    <button className = 'relative bg-blue-500 p-1 m-1 text-white rounded overflow-visible' type='submit' onClick={(e)=>submit(e)}>Sincronizar Guardias&nbsp;&nbsp;<img alt="..." src={GC} width="20" height="20" className="float-right"/></button>
                    
                    
                </form>
            </div>}
        </div>
    )
}