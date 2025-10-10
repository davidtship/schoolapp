import React, { useState, useEffect } from "react";
import { Form, Button, Table, Modal, Toast, ToastContainer } from "react-bootstrap";
import Swal from "sweetalert2";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const CURRENCY_URL = API_BASE_URL+"/api/currency/";

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [currencyForm, setCurrencyForm] = useState({
    code: "",
    name: "",
  });

  // 🔹 Charger les devises
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch(CURRENCY_URL);
        const data = await res.json();
        setCurrencies(data);
        setFilteredCurrencies(data);
      } catch (error) {
        console.error("Erreur chargement devises :", error);
      }
    };
    fetchCurrencies();
  }, []);

  // 🔹 Recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCurrencies(currencies);
    } else {
      const filtered = currencies.filter(
        (c) =>
          c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    }
  }, [searchTerm, currencies]);

  // 🔹 Toast helper
  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 🔹 Ajouter ou Modifier
  const handleSaveCurrency = async () => {
    try {
      let url = CURRENCY_URL;
      let method = "POST";
      if (modalMode === "edit" && selectedCurrency) {
        url = `${CURRENCY_URL}${selectedCurrency.id}/`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currencyForm),
      });

      if (!response.ok) throw new Error("Erreur lors de l'opération");

      const savedCurrency = await response.json();

      if (modalMode === "add") {
        setCurrencies([savedCurrency, ...currencies]);
        showSuccessToast(`Devise "${savedCurrency.name}" ajoutée avec succès !`);
      } else {
        const updatedList = currencies.map((c) =>
          c.id === savedCurrency.id ? savedCurrency : c
        );
        setCurrencies(updatedList);
        showSuccessToast(`Devise "${savedCurrency.name}" modifiée avec succès !`);
      }

      setShowModal(false);
      setCurrencyForm({ code: "", name: "" });
      setSelectedCurrency(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Supprimer une devise
  const handleDeleteCurrency = async (currency) => {
    const confirm = await Swal.fire({
      title: "⚠️ Confirmation",
      text: `Voulez-vous vraiment supprimer "${currency.name}" ?`,
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
        const response = await fetch(`${CURRENCY_URL}${currency.id}/`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erreur suppression");

        const remaining = currencies.filter((c) => c.id !== currency.id);
        setCurrencies(remaining);
        Swal.fire({
          title: "Supprimé !",
          text: `La devise "${currency.name}" a été supprimée.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e1e2f",
          color: "#fff",
        });
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de supprimer cette devise.",
          icon: "error",
          background: "#1e1e2f",
          color: "#fff",
        });
      }
    }
  };

  // 🔹 Ouvrir modals
  const openAddModal = () => {
    setModalMode("add");
    setCurrencyForm({ code: "", name: "" });
    setSelectedCurrency(null);
    setShowModal(true);
  };

  const openEditModal = (currency) => {
    setModalMode("edit");
    setSelectedCurrency(currency);
    setCurrencyForm({
      code: currency.code,
      name: currency.name,
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

      {/* Barre recherche + bouton */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher une devise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Button variant="primary" onClick={openAddModal}>
            ➕ Ajouter une devise
          </Button>
        </div>
      </div>

      {/* Tableau des devises */}
      <div className="table-responsive shadow-sm rounded">
        <Table  style={{ fontSize: "1.2em" }} striped bordered hover className="align-middle text-center">
          <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button variant="success" size="sm" onClick={() => openEditModal(c)}>
                        ✏️ Modifier
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteCurrency(c)}>
                        🗑️ Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-3">
                  Aucune devise trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "add" ? "Ajouter une devise" : "Modifier la devise"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Code (ex: USD, CDF)</Form.Label>
              <Form.Control
                type="text"
                value={currencyForm.code}
                onChange={(e) =>
                  setCurrencyForm({ ...currencyForm, code: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={currencyForm.name}
                onChange={(e) =>
                  setCurrencyForm({ ...currencyForm, name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveCurrency}>
            {modalMode === "add" ? "Ajouter" : "Enregistrer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CurrencyPage;
