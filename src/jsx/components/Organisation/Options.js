import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Dropdown, Toast, ToastContainer } from "react-bootstrap";
import BasicModal from "../Dashboard/BasicModal";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const DIRECTIONS_URL = API_BASE_URL + "/api/options/";
const STATUS_URL = API_BASE_URL + "/api/direction-status/";

const Directions = () => {
  const addRef = useRef();
  const editRef = useRef();
  const [directions, setDirections] = useState([]);
  const [filteredDirections, setFilteredDirections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [unchecked, setUnChecked] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedDirection, setSelectedDirection] = useState(null);

  const token = localStorage.getItem("access")?.replaceAll('"', '');

  // 🔹 Récupérer les directions
  const fetchDirections = async () => {
    try {
      const response = await fetch(DIRECTIONS_URL, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const withChecks = data.map((d) => ({ ...d, inputchecked: false }));
      setDirections(withChecks);
      setFilteredDirections(withChecks);
      setToastMessage("🔄 Liste des directions actualisée !");
      setShowToast(true);
    } catch (error) {
      console.error("Erreur fetch directions:", error);
    }
  };

  useEffect(() => { fetchDirections(); }, []);

  // 🔹 Statuts
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch(STATUS_URL, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setStatuses(data);
      } catch (error) { console.error("Erreur récupération statuts:", error); }
    };
    fetchStatuses();
  }, []);

  // 🔹 Filtrage recherche
  useEffect(() => {
    if (!searchTerm) setFilteredDirections(directions);
    else {
      const filtered = directions.filter((d) =>
        [d.name, d.manager?.full_name, d.email, d.phone_number, d.type]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredDirections(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, directions]);

  const handleChecked = (id) => setDirections(directions.map((d) => (d.id === id ? { ...d, inputchecked: !d.inputchecked } : d)));
  const handleCheckedAll = (value) => { setDirections(directions.map((d) => ({ ...d, inputchecked: value }))); setUnChecked(!unchecked); };

  // 🔹 Pagination
  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = filteredDirections.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredDirections.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  // 🔹 Changer le statut
  const handleChangeStatus = async (directionId, statusId) => {
    try {
      const response = await fetch(`${DIRECTIONS_URL}${directionId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: statusId }),
      });
      if (!response.ok) throw new Error("Erreur mise à jour");
      const selectedStatus = statuses.find((s) => s.id === statusId);
      const updated = directions.map((d) => (d.id === directionId ? { ...d, status: selectedStatus } : d));
      setDirections(updated);
      setFilteredDirections(updated);
      const dir = directions.find((d) => d.id === directionId);
      setToastMessage(`✅ Statut de ${dir.name} mis à jour à "${selectedStatus.label}"`);
      setShowToast(true);
    } catch (error) { console.error(error); }
  };

  // 🔥 Supprimer une direction
  const handleDeleteDirection = async (directionId) => {
    const dir = directions.find((d) => d.id === directionId);
    Swal.fire({
      title: `Supprimer ${dir.name} ?`,
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${DIRECTIONS_URL}${directionId}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          if (response.ok) {
            const updated = directions.filter((d) => d.id !== directionId);
            setDirections(updated);
            setFilteredDirections(updated);
            Swal.fire("✅ Supprimé !", `${dir.name} a été supprimé.`, "success");
          } else Swal.fire("Erreur", "La suppression a échoué.", "error");
        } catch { Swal.fire("Erreur", "Une erreur est survenue.", "error"); }
      }
    });
  };

  // 🔹 Modifier une direction
  const handleEditClick = (dir) => { setSelectedDirection(dir); editRef.current.openModal(); };
  const onDirectionUpdated = (updatedDirection) => {
    const updatedList = directions.map((d) => (d.id === updatedDirection.id ? { ...d, ...updatedDirection } : d));
    setDirections(updatedList);
    setFilteredDirections(updatedList);
    setToastMessage(`✏️ ${updatedDirection.name} a été mis à jour !`);
    setShowToast(true);
  };

  return (
    <>
     

      {/* Liste directions */}
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        <div style={{backgroundColor:'#86bef7'}} className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🏢 Liste des options</h5>
          <div className="d-flex gap-2">
            <Button variant="light" className="fw-bold text-dark" onClick={() => addRef.current.openModal()}>+ Ajouter</Button>
            <Button variant="light" className="fw-bold text-dark" onClick={fetchDirections}>🔄 Actualiser</Button>
          </div>
        </div>

        <div className="p-3 bg-light">
          <Form.Control type="text" placeholder="🔍 Rechercher une direction..." className="mb-3 shadow-sm border-0 rounded-pill px-4 py-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-dark">
            <thead style={{ backgroundColor: "#dcddde" }}>
              <tr>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {records.map((dir) => (
                <tr key={dir.id}>
                  <td>{dir.name}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center bg-light">
          <div className="text-muted small">Affiche {firstIndex + 1} à {filteredDirections.length < lastIndex ? filteredDirections.length : lastIndex} sur {filteredDirections.length} directions</div>
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

      {/* Modal ajout */}
      <BasicModal ref={addRef} title="Ajouter une direction">
        {/* Contenu formulaire à créer */}
      </BasicModal>

      {/* Modal édition */}
      <BasicModal ref={editRef} title="Modifier la direction">
        {/* Contenu formulaire à créer */}
      </BasicModal>
    </>
  );
};

export default Directions;
