import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import BasicModal from "../Dashboard/BasicModal";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SectionList = () => {
  const addRef = useRef();
  const editRef = useRef();

  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [allDirections, setAllDirections] = useState([]);
  const [directionsMap, setDirectionsMap] = useState({}); // map id -> direction object

  const token = localStorage.getItem("access")?.replaceAll('"', "");
  const location = useLocation();

  // 🔹 Lire les params de l'URL pour pré-remplir les filtres
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dir = params.get("direction") || "";
    const name = params.get("name") || "";
    setDirectionFilter(dir);
    setSearchTerm(name);
  }, [location.search]);

  // 🔹 Récupérer les sections
  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sections/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur fetch sections");
      const data = await res.json();
      setSections(data);

      // Construire map des directions et liste unique pour le select
      const dirMap = {};
      const dirsSet = new Map(); // id -> name
      data.forEach(s => {
        if (s.direction) {
          dirMap[s.id] = s.direction;
          dirsSet.set(s.direction.id, s.direction.name);
        }
      });
      setDirectionsMap(dirMap);
      setAllDirections([...dirsSet.entries()].map(([id, name]) => ({ id, name })));

      setToastMessage("🔄 Sections chargées !");
      setShowToast(true);
    } catch (error) {
      console.error(error);
      Swal.fire("❌ Erreur", "Impossible de charger les sections", "error");
    }
  };

  useEffect(() => { fetchSections(); }, [token]);

  // 🔹 Filtrage recherche et direction
  useEffect(() => {
    if (!Array.isArray(sections)) return;
    let filtered = [...sections];

    // Filtre par nom
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par direction (ID)
    if (directionFilter) {
      filtered = filtered.filter(s =>
        directionsMap[s.id]?.id.toString() === directionFilter
      );
    }

    setFilteredSections(filtered);
    setCurrentPage(1);
  }, [searchTerm, directionFilter, sections, directionsMap]);

  // 🔹 Pagination
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredSections.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredSections.length / recordsPerPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  return (
    <>
    
      {/* Liste sections */}
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        <div style={{ backgroundColor: "#86bef7" }} className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📚 Liste des sections</h5>
          <div className="d-flex gap-2">
            <Button variant="light" className="fw-bold text-dark" onClick={() => addRef.current.openModal()}>+ Ajouter</Button>
            <Button variant="light" className="fw-bold text-dark" onClick={fetchSections}>🔄 Actualiser</Button>
          </div>
        </div>

        <div className="p-3 bg-light d-flex flex-wrap gap-2">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher une section..."
            className="shadow-sm border-0 rounded-pill px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: "200px" }}
          />
          <Form.Select
            className="shadow-sm border-0 rounded-pill px-4 py-2"
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            style={{ minWidth: "200px" }}
          >
            <option value="">🌐 Filtrer par direction</option>
            {allDirections.map((dir) => (
              <option key={dir.id} value={dir.id}>{dir.name}</option>
            ))}
          </Form.Select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-dark">
            <thead style={{ backgroundColor: "#dcddde" }}>
              <tr>
                <th>#</th>
                <th>Nom de la Section</th>
                <th>Direction</th>
              </tr>
            </thead>
            <tbody>
              {records.map((section, idx) => (
                <tr key={section.id}>
                  <td>{firstIndex + idx + 1}</td>
                  <td>{section.name}</td>
                  <td>{directionsMap[section.id]?.name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center bg-light">
          <div className="text-muted small">
            Affiche {firstIndex + 1} à {filteredSections.length < lastIndex ? filteredSections.length : lastIndex} sur {filteredSections.length} sections
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={prePage}>&laquo;</button>
              </li>
              {number.map((n) => (
                <li key={n} className={`page-item ${currentPage === n ? "active" : ""}`}>
                  <button className="page-link" onClick={() => changeCPage(n)}>{n}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === npage ? "disabled" : ""}`}>
                <button className="page-link" onClick={nextPage}>&raquo;</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modals */}
      <BasicModal ref={addRef} title="Ajouter une section">{/* Formulaire */}</BasicModal>
      <BasicModal ref={editRef} title="Modifier la section">{/* Formulaire */}</BasicModal>
    </>
  );
};

export default SectionList;
