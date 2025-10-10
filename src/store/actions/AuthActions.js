import {
    formatError,
    login,
    saveTokenInLocalStorage,
    signUp,
} from '../../services/AuthService';
import swal from 'sweetalert'; // pour afficher les erreurs proprement

export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';
export const NAVTOGGLE = 'NAVTOGGLE';

// 🧾 INSCRIPTION
export function signupAction(email, password, navigate) {
    return async (dispatch) => {
        dispatch(loadingToggleAction(true));
        try {
            const response = await signUp(email, password);
            dispatch(confirmedSignupAction(response.data));
            swal('Succès', 'Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');
            navigate('/login');
        } catch (error) {
            const errorMessage = formatError(error.response);
            swal('Erreur', errorMessage, 'error');
            dispatch(signupFailedAction(errorMessage));
        } finally {
            dispatch(loadingToggleAction(false));
        }
    };
}

// 🔐 CONNEXION
export function loginAction(email, password, navigate) {
    return async (dispatch) => {
        dispatch(loadingToggleAction(true)); // 🌀 Active le loader

        try {
            // ⏱️ Attente de la réponse du serveur
            const tokenDetails = await login(email, password);

            // 🔹 Vérifie si le backend renvoie un message d'erreur
            if (tokenDetails.detail) {
                swal('Erreur', tokenDetails.detail, 'error');
                dispatch(loginFailedAction(tokenDetails.detail));
                dispatch(loadingToggleAction(false)); // ❌ Stop le loader
                return;
            }

            // ✅ Connexion réussie
            saveTokenInLocalStorage(tokenDetails);
            dispatch(loginConfirmedAction(tokenDetails));

            // 🔹 Stop le loader immédiatement après la réponse et redirige
            dispatch(loadingToggleAction(false));
            navigate('/dashboard'); // 🚀 Redirection

        } catch (error) {
            const errorMessage = formatError(error.response);
            swal('Erreur', errorMessage, 'error');
            dispatch(loginFailedAction(errorMessage));
            dispatch(loadingToggleAction(false)); // ❌ Stop le loader en cas d’erreur
        }
    };
}


// 🚪 DÉCONNEXION
export function Logout(navigate) {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('access');
    navigate('/login');
    return {
        type: LOGOUT_ACTION,
    };
}

// ✅ ACTIONS REDUX
export function loginConfirmedAction(data) {
    return { type: LOGIN_CONFIRMED_ACTION, payload: data };
}

export function loginFailedAction(message) {
    return { type: LOGIN_FAILED_ACTION, payload: message };
}

export function confirmedSignupAction(payload) {
    return { type: SIGNUP_CONFIRMED_ACTION, payload };
}

export function signupFailedAction(message) {
    return { type: SIGNUP_FAILED_ACTION, payload: message };
}

export function loadingToggleAction(status) {
    return { type: LOADING_TOGGLE_ACTION, payload: status };
}

export const navtoggle = () => ({ type: NAVTOGGLE });
