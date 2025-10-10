import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import LogoutPage from "./Logout";
import { ThemeContext } from "../../../context/ThemeContext";

// Avatar par défaut
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { background } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [headerFix, setHeaderFix] = useState(false);

  // Récupérer le user connecté
  useEffect(() => {
	const fetchUser = async () => {
	  try {
		const response = await fetch(
		  `${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`,
		  {
			headers: {
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${localStorage
				.getItem("access")
				?.replaceAll('"', '')}`,
			},
		  }
		);
		if (response.ok) {
		  const data = await response.json();
		  setUser(data);
		} else {
		  console.error("Erreur lors de la récupération du profil utilisateur");
		}
	  } catch (error) {
		console.error("Erreur réseau:", error);
	  }
	};
	fetchUser();
  }, []);

  // Header sticky
  useEffect(() => {
	const handleScroll = () => setHeaderFix(window.scrollY > 50);
	window.addEventListener("scroll", handleScroll);
	return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fullscreenRef = useRef(null);
  const EnterFullScreen = () => {
	const doc = document;
	if (
	  doc.fullscreenElement ||
	  doc.webkitFullscreenElement ||
	  doc.mozFullScreenElement ||
	  doc.msFullscreenElement
	) {
	  doc.exitFullscreen?.();
	  doc.msExitFullscreen?.();
	  doc.mozCancelFullScreen?.();
	  doc.webkitExitFullscreen?.();
	} else {
	  doc.documentElement.requestFullscreen?.();
	  doc.documentElement.webkitRequestFullscreen?.();
	  doc.documentElement.mozRequestFullScreen?.();
	  doc.documentElement.msRequestFullscreen?.();
	}
  };

  const path = window.location.pathname.split("/");
  const name = path[path.length - 1].split("-");
  const finalName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;

  return (
	<div
	  className={`header ${headerFix ? "sticky shadow-sm bg-white" : ""}`}
	  style={{ transition: "all 0.3s ease", borderBottom: "1px solid #e5e5e5" }}
	>
	  <div className="header-content px-3 py-2">
		<nav className="navbar navbar-expand justify-content-between">
		  {/* === Gauche === */}
		  <div className="header-left">
			<div
			  className="dashboard_bar"
			  style={{ textTransform: "capitalize", fontWeight: 600, fontSize: "20px" }}
			>
			  {finalName.join(" ").length === 0
				? "Dashboard"
				: finalName.join(" ") === "dashboard dark"
				? "Dashboard"
				: finalName.join(" ")}
			</div>
		  </div>

		  {/* === Droite === */}
		  <ul className="navbar-nav align-items-center gap-3">
			{/* Nom utilisateur */}
			<li className="nav-item d-none d-md-block">
			  <span
				style={{ fontSize: "16px", fontWeight: "500", color: "#333", textTransform: "capitalize" }}
			  >
				{user ? `${user.first_name || ""} ${user.last_name || ""}` : "Chargement..."}
			  </span>
			</li>

			{/* Plein écran */}
			<li className="nav-item">
			  <Link
				to="#"
				className="nav-link bell dz-fullscreen"
				ref={fullscreenRef}
				onClick={EnterFullScreen}
			  >
				<svg
				  id="icon-full-1"
				  viewBox="0 0 24 24"
				  width="20"
				  height="20"
				  stroke="currentColor"
				  strokeWidth="2"
				  fill="none"
				  strokeLinecap="round"
				  strokeLinejoin="round"
				>
				  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
				</svg>
			  </Link>
			</li>

			{/* Profil utilisateur */}
			<li className="nav-item">
			  <Dropdown className="dropdown header-profile2">
				<Dropdown.Toggle
				  variant=""
				  as="a"
				  className="nav-link i-false c-pointer ms-0"
				>
				  <div className="header-info2 d-flex align-items-center">
					{/* Avatar */}
					<FaUserCircle size={42} color="#555" />
				  </div>
				</Dropdown.Toggle>

				<Dropdown.Menu
				  align="end"
				  className="mt-1 dropdown-menu-end shadow"
				  style={{ width: "300px", minWidth: "300px", padding: "10px" }}
				>
				  <div className="card mb-0 border-0">
					<div className="card-header bg-light p-3">
					  <div className="d-flex align-items-center mb-0">
						{/* Avatar */}
						<FaUserCircle size={60} color="#555" />
						<div className="ms-2">
						  <h5 className="mb-0" style={{ fontSize: "18px" }}>
							{user ? `${user.first_name || ""} ${user.last_name || ""}` : "Chargement..."}
						  </h5>
						  <small className="text-muted" style={{ fontSize: "14px" }}>
							{user?.role?.name || "Utilisateur"}
						  </small>
						</div>
					  </div>
					</div>

					<div className="card-body p-3">
					  {/* Seul paramètre reste */}
					  <Link to="#" className="dropdown-item ai-icon">
						<i className="fa fa-cog me-2"></i> Paramètres
					  </Link>
					</div>

					<div className="card-footer text-center p-3 border-top">
					  <LogoutPage />
					</div>
				  </div>
				</Dropdown.Menu>
			  </Dropdown>
			</li>
		  </ul>
		</nav>
	  </div>
	</div>
  );
};

export default Header;
