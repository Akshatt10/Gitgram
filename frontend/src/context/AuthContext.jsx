import { createContext, useContext, useEffect, useState } from "react";
import {toast} from 'react-hot-toast';

export const AuthContext = createContext();


export const useAuthContext = ()=>{
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {

    const [authUser, setAuthUser] = useState(null);
    const [loading, setloading] = useState(true);


    useEffect(() =>{
        const checkUserLoggedIn = async ()=>{
            setloading(true);
            try {
                const res = await fetch("/api/auth/check", {credentials:"include"});
                const data = await res.json();

                setAuthUser(data.user); //null or autheticated user object

            } catch (error) {
                toast.error(error.message);
            }finally{
                setloading(false);
            }
        };
        checkUserLoggedIn();
    }, [])




    return (
        <AuthContext.Provider value={{authUser, setAuthUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
}