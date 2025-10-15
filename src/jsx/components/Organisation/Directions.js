import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BasicModal from "../Dashboard/BasicModal";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const DIRECTIONS_URL = `${API_BASE_URL}/api/directions/`;

const Directions = () => {
  const navigate = useNavigate();
  const addRef = useRef();
  const editRef = useRef();

  const [directions, setDirections] = useState([]);
  const [filteredDirections, setFilteredDirections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const token = localStorage.getItem("access")?.replaceAll('"', "");

  // 🔹 Fetch directions
  const fetchDirections = async () => {
    try {
      const res = await fetch(DIRECTIONS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur fetch directions");
      const data = await res.json();
      setDirections(Array.isArray(data) ? data : []);
      setFilteredDirections(Array.isArray(data) ? data : []);
      setToastMessage("🔄 Liste des directions actualisée !");
      setShowToast(true);
    } catch (error) {
      console.error("Erreur fetch directions:", error);
      Swal.fire("❌ Erreur", "Impossible de charger les directions", "error");
    }
  };

  useEffect(() => { fetchDirections(); }, [token]);

  // 🔹 Filtrage recherche
  useEffect(() => {
    const dirs = Array.isArray(directions) ? directions : [];
    if (!searchTerm) setFilteredDirections(dirs);
    else {
      const filtered = dirs.filter((d) =>
        [d.name, d.manager?.full_name, d.email, d.phone_number, d.type]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredDirections(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, directions]);

  // 🔹 Pagination
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredDirections.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredDirections.length / recordsPerPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  // 🔹 Redirection vers sections filtrées
const goToSections = (direction) => {
  if (!direction) return;
  // 🔹 Navigation avec state (au lieu de query params)
  navigate("/sections", { state: { directionId: direction.id, directionName: direction.name } });
};


  return (
    <>
  

      {/* Liste directions */}
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        <div style={{backgroundColor:'#86bef7'}} className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🏢 Liste des directions</h5>
          <div className="d-flex gap-2">
            <Button variant="light" className="fw-bold text-dark" onClick={() => addRef.current.openModal()}>+ Ajouter</Button>
            <Button variant="light" className="fw-bold text-dark" onClick={fetchDirections}>🔄 Actualiser</Button>
          </div>
        </div>

        <div className="p-3 bg-light">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher une direction..."
            className="mb-3 shadow-sm border-0 rounded-pill px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-dark">
            <thead style={{ backgroundColor: "#dcddde" }}>
              <tr><th>Designation</th></tr>
            </thead>
            <tbody>
              {records.map((dir) => (
                <tr key={dir.id} style={{ cursor: "pointer" }} onClick={() => goToSections(dir)}>
                  <td>{dir.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center bg-light">
          <div className="text-muted small">
            Affiche {firstIndex + 1} à {filteredDirections.length < lastIndex ? filteredDirections.length : lastIndex} sur {filteredDirections.length} directions
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}><button className="page-link" onClick={prePage}>&laquo;</button></li>
              {number.map((n) => (
                <li key={n} className={`page-item ${currentPage === n ? "active" : ""}`}><button className="page-link" onClick={() => changeCPage(n)}>{n}</button></li>
              ))}
              <li className={`page-item ${currentPage === npage ? "disabled" : ""}`}><button className="page-link" onClick={nextPage}>&raquo;</button></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modals */}
      <BasicModal ref={addRef} title="Ajouter une direction">{/* Formulaire */}</BasicModal>
      <BasicModal ref={editRef} title="Modifier la direction">{/* Formulaire */}</BasicModal>
    </>
  );
};

export default Directions;
