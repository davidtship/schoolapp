import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = API_BASE_URL + "/api/schools/";

const SchoolConfig = () => {
  const [school, setSchool] = useState({
    name: "",
    address: "",
    phone: "",
    creation_date: "",
    business_name: "",
    id_nat: "",
    rccm: "",
    email: "",
    website: "",
    logo: null,
    school_code: "",
    is_active: false,
    admin_ecole: 1,
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("access")?.replaceAll('"', "");
  const userRCCM = localStorage.getItem("rccm") || "";

  // 🔹 Charger la config existante si elle existe
  useEffect(() => {
    const fetchSchoolConfig = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const existing = data.find((s) => s.rccm === userRCCM);
        if (existing) {
          setSchool(existing);
          setLogoPreview(existing.logo || "");
        }
      } catch (error) {
        console.error("Erreur fetch config école:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolConfig();
  }, [token, userRCCM]);

  // 🔹 Aperçu du logo (gère File ou string)
  useEffect(() => {
    if (!school.logo) {
      setLogoPreview("");
      return;
    }

    if (school.logo instanceof File) {
      const objectUrl = URL.createObjectURL(school.logo);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    // si c’est une URL existante (string)
    setLogoPreview(school.logo);
  }, [school.logo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchool({ ...school, [name]: type === "checkbox" ? checked : value });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSchool({ ...school, logo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      Object.entries(school).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "logo" && typeof value === "string") return; // ignorer l’URL string
          formData.append(key, value);
        }
      });

      let response;
      if (school.id) {
        response = await fetch(`${API_URL}${school.id}/`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      const saved = await response.json();
      setSchool(saved);
      Swal.fire("✅ Succès", "Configuration enregistrée !", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("❌ Erreur", "Impossible d'enregistrer la configuration", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container my-4">
      <h2
        className="mb-4 text-center text-gradient"
        style={{
          background: "linear-gradient(90deg, #539bff, #73c2ff)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontWeight: "700",
        }}
      >
        ⚙️ Configuration Scolaire
      </h2>

      <Card className="shadow-lg rounded-4 p-4 mb-4" style={{ border: "none" }}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row g-4">
            {[
              { label: "Nom de l'école", name: "name", type: "text" },
              { label: "Adresse", name: "address", type: "text" },
              { label: "Téléphone", name: "phone", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Site Web", name: "website", type: "url" },
              { label: "RCCM", name: "rccm", type: "text" },
              { label: "Business Name", name: "business_name", type: "text" },
              { label: "ID Nat", name: "id_nat", type: "text" },
              { label: "Code École", name: "school_code", type: "text" },
            ].map((field, i) => (
              <div key={i} className="col-md-6">
                <Form.Group>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type={field.type}
                    name={field.name}
                    value={school[field.name] || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            ))}

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Logo</Form.Label>
                <Form.Control type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="mt-2 rounded shadow-lg animate__animated animate__fadeIn"
                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "16px" }}
                  />
                )}
              </Form.Group>
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Activer l'école"
                name="is_active"
                checked={school.is_active}
                onChange={handleChange}
                className="form-check-input-lg"
              />
            </div>

            <div className="col-12 mt-3">
              <Button
                type="submit"
                className="w-100 text-white fw-bold shadow"
                style={{
                  background: "linear-gradient(90deg, #539bff, #73c2ff)",
                  border: "none",
                  padding: "12px",
                  fontSize: "1.1em",
                  borderRadius: "12px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                disabled={updating}
              >
                {updating ? "⏳ Enregistrement..." : school.id ? "💾 Mettre à jour" : "💾 Enregistrer"}
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}; 

export default SchoolConfig;
