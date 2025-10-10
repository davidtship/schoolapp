import React, { useState, useEffect } from "react";
import { Form, Button, Toast, ToastContainer, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const CURRENCY_CONFIG_URL = API_BASE_URL+"/api/custom-currency-config/";

const CURRENCY_CONFIG = API_BASE_URL+"/api/currency-config/";
const CURRENCY_URL = API_BASE_URL+"/api/currency/";

const CurrencyConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedConfig, setSelectedConfig] = useState(null);

  const [form, setForm] = useState({
    principal_currency: null,
    auxiliary_currency: null,
    exchange_rate: "",
  });

  // 🔹 Charger données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, currencyRes] = await Promise.all([
          fetch(CURRENCY_CONFIG_URL),
          fetch(CURRENCY_URL),
        ]);
        const [configData, currencyData] = await Promise.all([
          configRes.json(),
          currencyRes.json(),
        ]);
        setConfigs(configData);
        setCurrencies(currencyData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Toast helper
  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 🔹 Ajouter / Modifier
  const handleSaveConfig = async () => {
    if (!form.principal_currency || !form.auxiliary_currency) {
      Swal.fire({
        title: "Erreur",
        text: "Veuillez sélectionner la monnaie principale et auxiliaire.",
        icon: "error",
        background: "#1e1e2f",
        color: "#fff",
      });
      return;
    }

    try {
      let url = CURRENCY_CONFIG;
      let method = "POST";
      if (modalMode === "edit" && selectedConfig) {
        url = `${CURRENCY_CONFIG}${selectedConfig.id}/`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principal_currency: form.principal_currency.id,
          auxiliary_currency: form.auxiliary_currency.id,
          exchange_rate: form.exchange_rate,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'opération");
      const saved = await response.json();

      const principalObj = currencies.find(c => c.id === saved.principal_currency);
      const auxiliaryObj = currencies.find(c => c.id === saved.auxiliary_currency);
      const configWithCurrencies = { ...saved, principal_currency: principalObj, auxiliary_currency: auxiliaryObj };

      if (modalMode === "add") {
        setConfigs([configWithCurrencies, ...configs]);
        showSuccessToast(`Configuration ajoutée avec succès !`);
      } else {
        const updatedList = configs.map(c => c.id === saved.id ? configWithCurrencies : c);
        setConfigs(updatedList);
        showSuccessToast(`Configuration modifiée avec succès !`);
      }

      setShowModal(false);
      setForm({ principal_currency: null, auxiliary_currency: null, exchange_rate: "" });
      setSelectedConfig(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Supprimer
  const handleDeleteConfig = async (config) => {
    const confirm = await Swal.fire({
      title: "⚠️ Confirmation",
      text: `Voulez-vous vraiment supprimer cette configuration ?`,
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
        const response = await fetch(`${CURRENCY_CONFIG_URL}${config.id}/`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        setConfigs(configs.filter(c => c.id !== config.id));
        Swal.fire({ title: "Supprimé !", icon: "success", timer: 2000, showConfirmButton: false, background: "#1e1e2f", color: "#fff" });
      } catch (error) {
        Swal.fire({ title: "Erreur", text: "Impossible de supprimer.", icon: "error", background: "#1e1e2f", color: "#fff" });
      }
    }
  };

  // 🔹 Activer / Désactiver
  const toggleActive = async (config) => {
    try {
      const response = await fetch(`${CURRENCY_CONFIG}${config.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !config.is_active }),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const updated = await response.json();
      setConfigs(configs.map(c => c.id === updated.id ? { ...c, is_active: updated.is_active } : c));
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Ouvrir modal
  const openAddModal = () => {
    setModalMode("add");
    setForm({ principal_currency: null, auxiliary_currency: null, exchange_rate: "" });
    setSelectedConfig(null);
    setShowModal(true);
  };

  const openEditModal = (config) => {
    setModalMode("edit");
    setSelectedConfig(config);
    setForm({
      principal_currency: config.principal_currency,
      auxiliary_currency: config.auxiliary_currency,
      exchange_rate: config.exchange_rate,
    });
    setShowModal(true);
  };

  return (
    <>
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} bg="info" style={{ minWidth: "350px" }}>
          <Toast.Header closeButton={false}><strong className="me-auto">Notification</strong></Toast.Header>
          <Toast.Body className="text-dark">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="row mb-3">
        <div className="col-md-12 d-flex justify-content-end">
          <Button variant="primary" onClick={openAddModal}>➕ Ajouter une configuration</Button>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <Table  style={{ fontSize: "1.2em" }} striped bordered hover className="align-middle">
          <thead style={{ backgroundColor: "#0d6efd", color: "white", textAlign: "center" }}>
            <tr>
              <th>Monnaie principale</th>
              <th>Monnaie auxiliaire</th>
              <th>Taux de change</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.length > 0 ? (
              configs.map(config => (
                <tr key={config.id}>
                  <td>{config.principal_currency?.name}</td>
                  <td>{config.auxiliary_currency?.name}</td>
                  <td>{config.exchange_rate}</td>
                  <td className="text-center">
                    <Button
                      variant={config.is_active ? "success" : "secondary"}
                      size="sm"
                      onClick={() => toggleActive(config)}
                    >
                      {config.is_active ? "Actif" : "Inactif"}
                    </Button>
                  </td>
                  <td className="text-center">
                    <Button variant="success" size="sm" onClick={() => openEditModal(config)}>✏️ Modifier</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteConfig(config)}>🗑️ Supprimer</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">Aucune configuration trouvée.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{modalMode === "add" ? "Ajouter une configuration" : "Modifier la configuration"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monnaie principale</Form.Label>
              <Form.Select
                value={form.principal_currency?.id || ""}
                onChange={(e) => setForm({ ...form, principal_currency: currencies.find(c => c.id == e.target.value) })}
              >
                <option value="">Sélectionner une monnaie</option>
                {currencies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Monnaie auxiliaire</Form.Label>
              <Form.Select
                value={form.auxiliary_currency?.id || ""}
                onChange={(e) => setForm({ ...form, auxiliary_currency: currencies.find(c => c.id == e.target.value) })}
              >
                <option value="">Sélectionner une monnaie</option>
                {currencies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Taux de change</Form.Label>
              <Form.Control
                type="number"
                value={form.exchange_rate}
                onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSaveConfig}>{modalMode === "add" ? "Ajouter" : "Enregistrer"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CurrencyConfig;
