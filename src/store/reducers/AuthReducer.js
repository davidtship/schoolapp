import {
    LOADING_TOGGLE_ACTION,
    LOGIN_CONFIRMED_ACTION,
    LOGIN_FAILED_ACTION,
    LOGOUT_ACTION,
    SIGNUP_CONFIRMED_ACTION,
    SIGNUP_FAILED_ACTION,
} from '../actions/AuthActions';

const initialState = {
    auth: {
        access: '',
        refresh: '',
        first_name: '',
        last_name: '',
        rccm: '',
    },
    errorMessage: '',
    successMessage: '',
    showLoading: false,
};

export function AuthReducer(state = initialState, action) {
    switch (action.type) {

        // ✅ Inscription réussie
        case SIGNUP_CONFIRMED_ACTION:
            return {
                ...state,
                auth: action.payload,
                errorMessage: '',
                successMessage: 'Inscription réussie !',
                showLoading: false,
            };

        // ✅ Connexion réussie
        case LOGIN_CONFIRMED_ACTION:
            return {
                ...state,
                auth: action.payload,
                errorMessage: '',
                successMessage: 'Connexion réussie ! Bienvenue',
                showLoading: false,
            };

        // 🚪 Déconnexion
        case LOGOUT_ACTION:
            return {
                ...state,
                auth: { ...initialState.auth },
                errorMessage: '',
                successMessage: '',
                showLoading: false,
            };

        // ⚠️ Échec (login ou signup)
        case SIGNUP_FAILED_ACTION:
        case LOGIN_FAILED_ACTION:
            return {
                ...state,
                errorMessage: action.payload || 'Une erreur est survenue.',
                successMessage: '',
                showLoading: false,
            };

        // ⏳ Toggle loading
        case LOADING_TOGGLE_ACTION:
            return {
                ...state,
                showLoading: action.payload,
            };

        // 🔁 Par défaut
        default:
            return state;
    }
}
