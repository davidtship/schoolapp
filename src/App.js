import { lazy, Suspense, useEffect, useState } from 'react';
import Index from './jsx/index';
import { Route, Routes, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { isLogin, checkAutoLogin } from './services/AuthService';
import { useDispatch } from 'react-redux';

import './other/swiper/css/swiper-bundle.min.css';
import "./other/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";

const SignUp = lazy(() => import('./jsx/pages/Registration'));
const Login = lazy(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
    });
});

// 🔐 Route privée
const PrivateRoute = ({ children }) => {
    const isAuthenticated = isLogin();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAutoLogin(dispatch, navigate);
        setLoading(false);
    }, [dispatch, navigate]);

    if (loading) {
        return (
            <div id="preloader">
                <div className="sk-three-bounce">
                    <div className="sk-child sk-bounce1"></div>
                    <div className="sk-child sk-bounce2"></div>
                    <div className="sk-child sk-bounce3"></div>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div id="preloader">
                <div className="sk-three-bounce">
                    <div className="sk-child sk-bounce1"></div>
                    <div className="sk-child sk-bounce2"></div>
                    <div className="sk-child sk-bounce3"></div>
                </div>
            </div>
        }>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/page-register' element={<SignUp />} />
                <Route path='/*' element={
                    <PrivateRoute>
                        <Index />
                    </PrivateRoute>
                } />
            </Routes>
        </Suspense>
    );
}

export default withRouter(App);
