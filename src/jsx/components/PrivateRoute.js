import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const tokenDetailsString = localStorage.getItem('userDetails');
    const isAuthenticated = !!tokenDetailsString && tokenDetailsString !== 'undefined';

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
