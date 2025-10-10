import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadingToggleAction, loginAction } from '../../store/actions/AuthActions';
import { Modal, Spinner } from 'react-bootstrap';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();

    let error = false;
    const errorObj = { email: '', password: '' };

    if (!email) {
      errorObj.email = 'Email requis';
      error = true;
    }
    if (!password) {
      errorObj.password = 'Mot de passe requis';
      error = true;
    }

    setErrors(errorObj);
    if (error) return;

    // 🔹 Active le loader
    dispatch(loadingToggleAction(true));

    try {
      await dispatch(loginAction(email, password, navigate));
    } finally {
      // 🔹 Le loader se ferme automatiquement dans le reducer
      dispatch(loadingToggleAction(false));
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#F9FAFB' }}>
      <div className="card shadow-lg border-0" style={{ maxWidth: '900px', width: '100%', borderRadius: '16px' }}>
        <div className="row g-0">
          {/* Côté gauche */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center text-white"
               style={{ backgroundColor: '#539bff', borderRadius: '16px 0 0 16px', padding: '40px 20px' }}>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '42px', fontWeight: '600', color: '#0d6efd', letterSpacing: '1px', marginBottom: '20px' }}>
              <span style={{ color: '#0d6efd', backgroundColor: '#e9f1ff', padding: '6px 14px', borderRadius: '12px', fontWeight: '700', marginRight: '8px' }}>School</span>
              <span style={{ color: '#212529', fontWeight: '500' }}>App</span>
            </h1>
            <h2 style={{ fontWeight: '600', color: '#fff', marginTop: '15px' }}>Bienvenue</h2>
            <p className="px-3" style={{ color: '#e0e7ff', fontSize: '14px' }}>
              Gérez vos élèves, enseignants et cours en toute simplicité.
            </p>
          </div>

          {/* Côté droit */}
          <div className="col-md-6 p-5 bg-white" style={{ borderRadius: '0 16px 16px 0' }}>
            <h3 className="mb-3" style={{ color: '#2E3A59', fontWeight: '600' }}>Connexion</h3>
            <p className="mb-4 text-muted">Bienvenue dans l'application de gestion scolaire</p>

            {props.errorMessage && <div className="alert alert-danger">{props.errorMessage}</div>}
            {props.successMessage && <div className="alert alert-success">{props.successMessage}</div>}

            <form onSubmit={onLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Entrez votre email" />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez votre mot de passe" />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Se souvenir de moi</label>
                </div>
                <Link to="/page-register" className="text-primary">Créer un compte</Link>
              </div>

              <button type="submit" className="btn w-100" style={{ backgroundColor: '#539bff', color: '#fff', borderRadius: '8px' }} disabled={props.showLoading}>
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 🔹 Modal loader */}
      <Modal show={props.showLoading} centered backdrop="static" keyboard={false}>
        <Modal.Body className="d-flex flex-column align-items-center">
          <Spinner animation="border" role="status" />
          <span className="mt-3">Connexion en cours...</span>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Login);
