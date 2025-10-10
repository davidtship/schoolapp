import React, { useState, useEffect } from "react";
import {
  Form,
  Toast,
  ToastContainer,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const FEE_TYPE_URL = API_BASE_URL+"/api/feetypes/";

const FeeTypesList = () => {
  const [feeTypes, setFeeTypes] = useState([]);
  const [filteredFeeTypes, setFilteredFeeTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFeeType, setSelectedFeeType] = useState(null);

  const [feeTypeForm, setFeeTypeForm] = useState({
    name: "",
    priority: "",
    description: "",
    is_tranchable: false,
    is_discountable: false,
  });

  // 🔹 Charger les types de frais
  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await fetch(FEE_TYPE_URL);
        const data = await response.json();
        setFeeTypes(data);
        setFilteredFeeTypes(data);
      } catch (error) {
        console.error("Erreur fetch types de frais:", error);
      }
    };
    fetchFeeTypes();
  }, []);

  // 🔹 Recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredFeeTypes(feeTypes);
    } else {
      const filtered = feeTypes.filter((ft) =>
        ft.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFeeTypes(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, feeTypes]);

  // 🔹 Pagination
  const recordsPerPage = 15;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredFeeTypes.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredFeeTypes.length / recordsPerPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  // 🔹 Toast helper
  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 🔹 Ajouter / Modifier
  const handleSaveFeeType = async () => {
    try {
      let url = FEE_TYPE_URL;
      let method = "POST";
      if (modalMode === "edit" && selectedFeeType) {
        url = `${FEE_TYPE_URL}${selectedFeeType.id}/`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeTypeForm),
      });
      if (!response.ok) throw new Error("Erreur lors de l'opération");

      const savedFeeType = await response.json();

      if (modalMode === "add") {
        setFeeTypes([savedFeeType, ...feeTypes]);
        setFilteredFeeTypes([savedFeeType, ...filteredFeeTypes]);
        showSuccessToast(`Type de frais "${savedFeeType.name}" ajouté avec succès !`);
      } else {
        const updatedList = feeTypes.map((ft) =>
          ft.id === savedFeeType.id ? savedFeeType : ft
        );
        setFeeTypes(updatedList);
        setFilteredFeeTypes(updatedList);
        showSuccessToast(`Type de frais "${savedFeeType.name}" modifié avec succès !`);
      }

      setShowModal(false);
      setFeeTypeForm({
        name: "",
        priority: "",
        description: "",
        is_tranchable: false,
        is_discountable: false,
      });
      setSelectedFeeType(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Supprimer avec SweetAlert2
  const handleDeleteFeeType = async (ft) => {
    const confirm = await Swal.fire({
      title: "Confirmation",
      text: `Voulez-vous vraiment supprimer "${ft.name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: "#1e1e2f",
      color: "#fff",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`${FEE_TYPE_URL}${ft.id}/`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression");

        const remaining = feeTypes.filter((f) => f.id !== ft.id);
        setFeeTypes(remaining);
        setFilteredFeeTypes(remaining);

        Swal.fire({
          title: "Supprimé !",
          text: `Le type de frais "${ft.name}" a été supprimé avec succès.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e1e2f",
          color: "#fff",
        });
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de supprimer ce type de frais.",
          icon: "error",
          background: "#1e1e2f",
          color: "#fff",
        });
      }
    }
  };

  // 🔹 Ouvrir modal
  const openAddModal = () => {
    setModalMode("add");
    setFeeTypeForm({
      name: "",
      priority: "",
      description: "",
      is_tranchable: false,
      is_discountable: false,
    });
    setSelectedFeeType(null);
    setShowModal(true);
  };

  const openEditModal = (ft) => {
    setModalMode("edit");
    setSelectedFeeType(ft);
    setFeeTypeForm({
      name: ft.name,
      priority: ft.priority,
      description: ft.description,
      is_tranchable: ft.is_tranchable,
      is_discountable: ft.is_discountable,
    });
    setShowModal(true);
  };

  return (
    <>
      {/* ✅ Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} bg="info" style={{ minWidth: "350px" }}>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-dark">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ✅ Barre de recherche + bouton Ajouter */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher un type de frais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Button variant="primary" onClick={openAddModal}>
            ➕ Ajouter un type
          </Button>
        </div>
      </div>

      {/* ✅ Tableau */}
      <div className="table-responsive shadow-sm rounded">
        <Table striped bordered hover>
          <thead
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              textAlign: "center",
            }}
          >
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Priorité</th>
              <th>Description</th>
              <th>Tranchable</th>
              <th>Réductible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((ft) => (
                <tr key={ft.id}>
                  <td>{ft.id}</td>
                  <td>{ft.name}</td>
                  <td>{ft.priority}</td>
                  <td>{ft.description}</td>
                  <td>{ft.is_tranchable ? "Oui" : "Non"}</td>
                  <td>{ft.is_discountable ? "Oui" : "Non"}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openEditModal(ft)}
                      >
                        ✏️ Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteFeeType(ft)}
                      >
                        🗑️ Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  Aucun type de frais trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ✅ Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Affiche {firstIndex + 1} à{" "}
          {filteredFeeTypes.length < lastIndex ? filteredFeeTypes.length : lastIndex} sur{" "}
          {filteredFeeTypes.length} types
        </div>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={prePage}>
                &laquo;
              </button>
            </li>
            {number.map((n) => (
              <li
                key={n}
                className={`page-item ${currentPage === n ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => changeCPage(n)}>
                  {n}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === npage ? "disabled" : ""}`}>
              <button className="page-link" onClick={nextPage}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* ✅ Modal Ajouter / Modifier */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "add"
              ? "Ajouter un type de frais"
              : "Modifier le type de frais"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={feeTypeForm.name}
                onChange={(e) =>
                  setFeeTypeForm({ ...feeTypeForm, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Priorité</Form.Label>
              <Form.Control
                type="number"
                value={feeTypeForm.priority}
                onChange={(e) =>
                  setFeeTypeForm({ ...feeTypeForm, priority: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={feeTypeForm.description}
                onChange={(e) =>
                  setFeeTypeForm({ ...feeTypeForm, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Tranchable"
              checked={feeTypeForm.is_tranchable}
              onChange={(e) =>
                setFeeTypeForm({ ...feeTypeForm, is_tranchable: e.target.checked })
              }
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Réductible"
              checked={feeTypeForm.is_discountable}
              onChange={(e) =>
                setFeeTypeForm({ ...feeTypeForm, is_discountable: e.target.checked })
              }
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveFeeType}>
            {modalMode === "add" ? "Ajouter" : "Enregistrer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FeeTypesList;
