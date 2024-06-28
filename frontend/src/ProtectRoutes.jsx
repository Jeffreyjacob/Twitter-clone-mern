/* eslint-disable react/prop-types */

import { Navigate, Outlet } from "react-router-dom"


const ProtectRoutes = ({authUser}) => {
 if(authUser){
    return <Outlet/>
 }
 return <Navigate to="/login"/>
}

export default ProtectRoutes