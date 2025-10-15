import axios from 'axios';
import swal from 'sweetalert';
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';

// ✅ Base URL configurable via .env
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const AUTH_URL = `${API_URL}/auth`;

// 🔐 Inscription
export async function signUp(email, password) {
    try {
        const response = await axios.post(`${AUTH_URL}/users/`, { email, password });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

// 🔐 Connexion
export async function login(email, password) {
    try {
        const response = await axios.post(`${AUTH_URL}/jwt/create/`, { email, password });

        // Vérifie si c'est une erreur renvoyée par le backend
        if (response.data.detail && !response.data.access) {
            throw { response: { data: { detail: response.data.detail } } };
        }

        const tokenDetails = {
            access: response.data.access,
            refresh: response.data.refresh,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            rccm: response.data.rccm,
        };

        return tokenDetails;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

// ⚠️ Gestion des erreurs
export function formatError(errorResponse) {
    if (!errorResponse || !errorResponse.data) return 'Erreur inconnue';
    const error = errorResponse.data;

    if (typeof error === 'string') return error;
    if (error.email) return error.email[0];
    if (error.password) return error.password[0];
    if (error.detail) return error.detail;

    const firstKey = Object.keys(error)[0];
    return Array.isArray(error[firstKey]) ? error[firstKey][0] : String(error[firstKey]);
}

function handleError(error) {
    const message = formatError(error.response);
    swal('Erreur', message, 'error');
}

// 💾 Sauvegarde du token
export function saveTokenInLocalStorage(tokenDetails) {
    if (!tokenDetails || typeof tokenDetails !== 'object') return;
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
    localStorage.setItem('access', tokenDetails.access);
    localStorage.setItem('rccm', tokenDetails.rccm);
}

// 🔁 Vérification automatique de session
export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');

    if (!tokenDetailsString || tokenDetailsString === 'undefined') {
        dispatch(Logout(navigate));
        return;
    }

    try {
        JSON.parse(tokenDetailsString);
    } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        dispatch(Logout(navigate));
    }
}

// ✅ Vérifie si l'utilisateur est connecté
export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');
    return !!tokenDetailsString && tokenDetailsString !== 'undefined';
}
