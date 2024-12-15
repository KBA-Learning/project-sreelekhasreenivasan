import React from 'react'
import { Outlet } from 'react-router-dom';

const authLayout = () => {

 let userType=localStorage.getItem('userType');
 console.log(userType);
 

 if (userType === null) {

    return <p>Loading...</p>;
}

return userType === 'ADMIN' ? (
    <>
        <Outlet />
    </>
) : (
    <div>
        <p>Page not found</p>
    </div>
);

}

export default authLayout