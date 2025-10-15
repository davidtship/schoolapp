import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";
import BasicModal from "../Dashboard/BasicModal";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CLASSES_URL = `${API_BASE_URL}/api/classes/`;
const OPTIONS_URL = `${API_BASE_URL}/api/options/`;

const Classes = () => {
  const addRef = useRef();
  const editRef = useRef();

  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const token = localStorage.getItem("access")?.replaceAll('"', "");

  // 🔹 Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await fetch(CLASSES_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClasses(data);
      setFilteredClasses(data);
      setToastMessage("🔄 Liste des classes actualisée !");
      setShowToast(true);
    } catch (error) {
      console.error("Erreur fetch classes:", error);
    }
  };

  // 🔹 Fetch options pour le combo box
  const fetchOptions = async () => {
    try {
      const res = await fetch(OPTIONS_URL, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOptions(data);
    } catch (error) {
      console.error("Erreur fetch options:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchOptions();
  }, []);

  // 🔹 Filtrage recherche + option
  useEffect(() => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.option?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedOption) {
      filtered = filtered.filter((c) => c.option?.id === parseInt(selectedOption));
    }

    setFilteredClasses(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedOption, classes]);

  // 🔹 Pagination
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredClasses.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredClasses.length / recordsPerPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  // 🔹 Supprimer une classe
  const handleDelete = async (classId) => {
    const cls = classes.find((c) => c.id === classId);
    Swal.fire({
      title: `Supprimer ${cls.name} ?`,
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
          const res = await fetch(`${CLASSES_URL}${classId}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const updated = classes.filter((c) => c.id !== classId);
            setClasses(updated);
            setFilteredClasses(updated);
            Swal.fire("✅ Supprimé !", `${cls.name} a été supprimé.`, "success");
          } else Swal.fire("Erreur", "La suppression a échoué.", "error");
        } catch {
          Swal.fire("Erreur", "Une erreur est survenue.", "error");
        }
      }
    });
  };

  // 🔹 Edit
  const handleEditClick = (cls) => {
    setSelectedClass(cls);
    editRef.current.openModal();
  };

  const onClassUpdated = (updatedClass) => {
    const updatedList = classes.map((c) => (c.id === updatedClass.id ? { ...c, ...updatedClass } : c));
    setClasses(updatedList);
    setFilteredClasses(updatedList);
    setToastMessage(`✏️ ${updatedClass.name} mis à jour !`);
    setShowToast(true);
  };

  return (
    <>
      {/* Toast */}


      <div className="card shadow border-0 rounded-4 overflow-hidden">
        <div style={{ backgroundColor: "#86bef7" }} className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🏫 Liste des classes</h5>
          <div className="d-flex gap-2">
            <Button variant="light" className="fw-bold text-dark" onClick={() => addRef.current.openModal()}>+ Ajouter</Button>
            <Button variant="light" className="fw-bold text-dark" onClick={fetchClasses}>🔄 Actualiser</Button>
          </div>
        </div>

        <div className="p-3 bg-light d-flex gap-2 flex-wrap">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher une classe..."
            className="mb-2 shadow-sm border-0 rounded-pill px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Form.Select className="mb-2 shadow-sm rounded-pill" value={selectedOption || ""} onChange={(e) => setSelectedOption(e.target.value)}>
            <option value="">Filtrer par Option</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </Form.Select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-dark">
            <thead style={{ backgroundColor: "#dcddde" }}>
              <tr>
                <th>Classe</th>
                <th>Option</th>
                <th>Places</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.name}</td>
                  <td>{cls.option?.name || "--"}</td>
                  <td>{cls.seats}</td>
                  <td>
                    <Button size="sm" variant="warning" onClick={() => handleEditClick(cls)} className="me-2">✏️</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(cls.id)}>🗑️</Button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center bg-light">
          <div className="text-muted small">
            Affiche {firstIndex + 1} à {filteredClasses.length < lastIndex ? filteredClasses.length : lastIndex} sur {filteredClasses.length} classes
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
      <BasicModal ref={addRef} title="Ajouter une classe">{/* Formulaire à créer */}</BasicModal>
      <BasicModal ref={editRef} title="Modifier la classe">{/* Formulaire à créer */}</BasicModal>
    </>
  );
};

export default Classes;
