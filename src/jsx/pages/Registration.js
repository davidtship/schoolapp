import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { connect, useDispatch } from "react-redux";
import axios from "axios";
import {
  loadingToggleAction,
  signupAction,
} from "../../store/actions/AuthActions";

// Image
import logoschool from "../../images/school.png"; // logo scolaire stylisé

function Register(props) {
  const [rccm, setRccm] = useState("");
  const [nom, setNom] = useState("");
  const [postnom, setPostnom] = useState("");
  const [role, setRole] = useState(""); // rôle sélectionné
  const [roles, setRoles] = useState([]); // liste des rôles depuis l’API
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Charger les rôles depuis l’API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/auths/roles/")
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des rôles:", err);
        swal("Erreur", "Impossible de charger les rôles", "error");
      });
  }, []);

  function onSignUp(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { email: "", password: "" };

    if (email === "") {
      errorObj.email = "Email requis";
      error = true;
      swal("Oops", errorObj.email, "error");
    }
    if (password === "") {
      errorObj.password = "Mot de passe requis";
      error = true;
      swal("Oops", errorObj.password, "error");
    }
    if (password !== repassword) {
      errorObj.password = "Les mots de passe ne correspondent pas";
      error = true;
      swal("Oops", errorObj.password, "error");
    }

    setErrors(errorObj);
    if (error) return;

    // Tu peux maintenant passer tous les champs à signupAction
    dispatch(loadingToggleAction(true));
    dispatch(
      signupAction(
        {
          email,
          password,

          rccm,
          first_name: nom,
          last_name: postnom,
          role_id:role,
        },
        navigate
      )
    );
  }

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#F9FAFB",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "600px", width: "100%", borderRadius: "16px" }}
      >
        <div className="p-5 bg-white" style={{ borderRadius: "16px" }}>
          <div className="text-center mb-4">
            <img src={logoschool} alt="Logo École" style={{ width: "120px" }} />
            <h3 className="mt-3" style={{ color: "#2E3A59", fontWeight: "600" }}>
              Créer un compte
            </h3>
            <p className="text-muted">
              Rejoignez notre plateforme de gestion scolaire
            </p>
          </div>

      
         

          <form onSubmit={onSignUp}>
            <div className="mb-3">
              <label className="form-label">Rccm</label>
              <input
                type="text"
                className="form-control"
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                placeholder="Entrez votre Rccm"
              />

              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez votre nom"
              />

              <label className="form-label">Postnom</label>
              <input
                type="text"
                className="form-control"
                value={postnom}
                onChange={(e) => setPostnom(e.target.value)}
                placeholder="Entrez votre postnom"
              />

              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
              />

              <label className="form-label">Rôle</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">-- Sélectionnez un rôle --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
              />

              <label className="form-label">Retapez le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                placeholder="Retapez votre mot de passe"
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ backgroundColor: "#2E3A59", borderRadius: "8px" }}
              >
                S'inscrire
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted">
              Vous avez déjà un compte ?{" "}
              <Link className="text-primary" to="/login">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Register);
