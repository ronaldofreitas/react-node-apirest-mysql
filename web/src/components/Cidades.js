import React, {useState, useEffect} from 'react';
import  { Redirect } from 'react-router-dom'
import { logout } from '../services/auth';
import rest from '../services/rest';

function Cidades(){

    const [cidades, setCidades] = useState([])

    useEffect(() => {
        async function loadCities(){
            
            //const response = await rest.get('/cities').then(
            await rest.get('/cities')
            .then(
                (response) => { setCidades(response.data.result); },
                (error) => {
                    console.log('LOGOUT')
                    logout();
                    //return <Redirect to='/' />
                    return <Redirect to={{ pathname: "/" }} />
                }
            );
        }
        loadCities()
        //.then(() => logout())
        //
        //.finally(() => console.log('end') )
    },[]);

    return(
        <>
            <h3>Lista de cidade-s</h3>
            <ul>
                {cidades.map(cit => (
                    <li key={cit.id}>{cit.name}</li>
                ))}
            </ul>
        </>
    );
}
export default Cidades;