import React, { useState, useEffect } from "react";
import { Form, Button, Toast, ToastContainer, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const API_URL = API_BASE_URL+"/api/custom-category-fees/";
const API_URL2 = API_BASE_URL+"/api/categoryfees/";
const FEE_TYPE_URL = API_BASE_URL+"/api/feetypes/";
const CURRENCY_URL = API_BASE_URL+"/api/currency/";

const CategoryFees = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [feeTypes, setFeeTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFee, setSelectedFee] = useState(null);

  const [feeForm, setFeeForm] = useState({
    code: "",
    designation: "",
    fee_type: null,
    currency: null,
  });

  // 🔹 Charger données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesRes, feeTypeRes, currencyRes] = await Promise.all([
          fetch(API_URL),
          fetch(FEE_TYPE_URL),
          fetch(CURRENCY_URL),
        ]);
        const [feesData, feeTypeData, currencyData] = await Promise.all([
          feesRes.json(),
          feeTypeRes.json(),
          currencyRes.json(),
        ]);
        setFees(feesData);
        setFilteredFees(feesData);
        setFeeTypes(feeTypeData);
        setCurrencies(currencyData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredFees(fees);
    } else {
      const filtered = fees.filter((f) =>
        f.designation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFees(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, fees]);

  // 🔹 Pagination
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredFees.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredFees.length / recordsPerPage);
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
  const handleSaveFee = async () => {
    try {
      let url = API_URL2;
      let method = "POST";
      if (modalMode === "edit" && selectedFee) {
        url = `${API_URL2}${selectedFee.id}/`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...feeForm,
          fee_type: feeForm.fee_type?.id,
          currency: feeForm.currency?.id,
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'opération");

      let savedFee = await response.json();
      savedFee = {
        ...savedFee,
        fee_type: feeTypes.find((ft) => ft.id === savedFee.fee_type),
        currency: currencies.find((c) => c.id === savedFee.currency),
      };

      if (modalMode === "add") {
        setFees([savedFee, ...fees]);
        setFilteredFees([savedFee, ...filteredFees]);
        showSuccessToast(`Frais "${savedFee.designation}" ajouté avec succès !`);
      } else {
        const updatedList = fees.map((f) =>
          f.id === savedFee.id ? savedFee : f
        );
        setFees(updatedList);
        setFilteredFees(updatedList);
        showSuccessToast(`Frais "${savedFee.designation}" modifié avec succès !`);
      }

      setShowModal(false);
      setFeeForm({ code: "", designation: "", fee_type: null, currency: null });
      setSelectedFee(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Supprimer avec SweetAlert2
  const handleDeleteFee = async (fee) => {
    const confirm = await Swal.fire({
      title: "⚠️ Confirmation",
      text: `Voulez-vous vraiment supprimer "${fee.designation}" ?`,
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
        const response = await fetch(`${API_URL}${fee.id}/`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression");

        const remaining = fees.filter((f) => f.id !== fee.id);
        setFees(remaining);
        setFilteredFees(remaining);

        Swal.fire({
          title: "Supprimé !",
          text: `Le frais "${fee.designation}" a été supprimé avec succès.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e1e2f",
          color: "#fff",
        });
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de supprimer ce frais.",
          icon: "error",
          background: "#1e1e2f",
          color: "#fff",
        });
      }
    }
  };

  // 🔹 Ouvrir modals Ajouter / Modifier
  const openAddModal = () => {
    setModalMode("add");
    setFeeForm({ code: "", designation: "", fee_type: null, currency: null });
    setSelectedFee(null);
    setShowModal(true);
  };

  const openEditModal = (fee) => {
    setModalMode("edit");
    setSelectedFee(fee);
    setFeeForm({
      code: fee.code,
      designation: fee.designation,
      fee_type: fee.fee_type,
      currency: fee.currency,
    });
    setShowModal(true);
  };

  return (
    <>
      {/* ✅ Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} bg="info" style={{ minWidth: "350px" }}>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-dark">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* 🔹 Barre recherche + bouton Ajouter */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher un frais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Button variant="primary" onClick={openAddModal}>
            ➕ Ajouter un frais
          </Button>
        </div>
      </div>

      {/* 🔹 Tableau */}
      <div className="table-responsive shadow-sm rounded">
        <Table striped bordered hover className="align-middle">
          <thead style={{ backgroundColor: "#0d6efd", color: "white", textAlign: "center" }}>
            <tr>
              <th>Code</th>
              <th>Désignation</th>
              <th>Type de frais</th>
              <th>Devise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.code}</td>
                  <td>{fee.designation}</td>
                  <td>{fee.fee_type?.name}</td>
                  <td>{fee.currency?.code}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openEditModal(fee)}
                      >
                        ✏️ Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteFee(fee)}
                      >
                        🗑️ Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  Aucun frais trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* 🔹 Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Affiche {firstIndex + 1} à{" "}
          {filteredFees.length < lastIndex ? filteredFees.length : lastIndex} sur{" "}
          {filteredFees.length} frais
        </div>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={prePage}>
                &laquo;
              </button>
            </li>
            {number.map((n) => (
              <li key={n} className={`page-item ${currentPage === n ? "active" : ""}`}>
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

      {/* 🔹 Modal Ajouter / Modifier */}
      <Modal show={showModal && modalMode !== "delete"} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "add" ? "Ajouter un frais" : "Modifier le frais"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={feeForm.code}
                onChange={(e) => setFeeForm({ ...feeForm, code: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Désignation</Form.Label>
              <Form.Control
                type="text"
                value={feeForm.designation}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, designation: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Type de frais</Form.Label>
              <Form.Select
                value={feeForm.fee_type?.id || ""}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    fee_type: feeTypes.find((ft) => ft.id == e.target.value),
                  })
                }
              >
                <option value="">Sélectionner un type</option>
                {feeTypes.map((ft) => (
                  <option key={ft.id} value={ft.id}>
                    {ft.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Devise</Form.Label>
              <Form.Select
                value={feeForm.currency?.id || ""}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    currency: currencies.find((c) => c.id == e.target.value),
                  })
                }
              >
                <option value="">Sélectionner une devise</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveFee}>
            {modalMode === "add" ? "Ajouter" : "Enregistrer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryFees;
