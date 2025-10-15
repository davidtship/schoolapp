import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import { IMAGES } from "../Dashboard/Content";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AddNewStudent = () => {
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nick_name: "",
    birth_date: "",
    birth_place: "",
    email: "",
    address: "",
    phone_number: "",
    father: "",
    mother: "",
    tutor: "",
    student_category: "",
    province: "",
    religion: "",
    blood_group: "",
    student_status: "",
    gender: "M",
    student_code: "",
  });

  const [fathers, setFathers] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [religions, setReligions] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          parentsRes,
          catRes,
          provRes,
          relRes,
          bgRes,
          statusRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/parents/`),
          axios.get(`${API_BASE_URL}/api/student-categorys/`),
          axios.get(`${API_BASE_URL}/api/provinces/`),
          axios.get(`${API_BASE_URL}/api/religions/`),
          axios.get(`${API_BASE_URL}/api/blood-groups/`),
          axios.get(`${API_BASE_URL}/api/student-status/`),
        ]);

        const allParents = parentsRes.data;
        setFathers(allParents.filter((p) => p.parent_type === "P"));
        setMothers(allParents.filter((p) => p.parent_type === "M"));
        setTutors(allParents);
        setCategories(catRes.data);
        setProvinces(provRes.data);
        setReligions(relRes.data);
        setBloodGroups(bgRes.data);
        setStatuses(statusRes.data);
      } catch (error) {
        console.error("Erreur chargement:", error);
      }
    };

    fetchData();
  }, []);

  const generateUniqueCode = async () => {
    let unique = false;
    let code = "";
    while (!unique) {
      code = "ST" + Math.floor(1000 + Math.random() * 9000);
      const res = await axios.get(`${API_BASE_URL}/api/students/check_code/?code=${code}`);
      if (!res.data.exists) unique = true;
    }
    return code;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({ ...prev, [name]: option ? option.value : "" }));
  };

  const fileHandler = (e) => setFile(e.target.files[0]);
  const removeFile = () => setFile(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const rccm = localStorage.getItem("rccm");

      if (!token || !rccm) {
        alert("RCCM ou token d'accès manquant !");
        setLoading(false);
        return;
      }

      const uniqueCode = await generateUniqueCode();

      const data = new FormData();
      Object.entries({ ...formData, student_code: uniqueCode, rccm }).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (file) data.append("photo", file);

      await axios.post(`${API_BASE_URL}/api/students/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Élève ajouté avec succès !");
      setFormData({
        first_name: "",
        last_name: "",
        nick_name: "",
        birth_date: "",
        birth_place: "",
        email: "",
        address: "",
        phone_number: "",
        father: "",
        mother: "",
        tutor: "",
        student_category: "",
        province: "",
        religion: "",
        blood_group: "",
        student_status: "",
        gender: "M",
        student_code: "",
      });
      setFile(null);
      setStartDate(null);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’ajout de l’élève !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
          <h2 style={{color: '#539bff'}} className="text-center mb-4"> Ajouter un nouvel élève</h2>

      <div className="row g-4">
        {/* Photo */}
        <div className="col-xl-3 col-lg-4 text-center">
          <div className="card shadow-sm p-3">
            <div
              style={{
                width: "150px",
                height: "150px",
                margin: "0 auto 10px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "12px",
                backgroundImage: file
                  ? `url(${URL.createObjectURL(file)})`
                  : `url(${IMAGES.noimage})`,
              }}
            />
            <input
              type="file"
              className="d-none"
              onChange={fileHandler}
              id="imageUpload"
              accept=".png,.jpg,.jpeg"
            />
            <label htmlFor="imageUpload" className="btn btn-primary btn-sm me-2 mb-2">
              Choisir la photo
            </label>
            <button className="btn btn-danger btn-sm mb-2" onClick={removeFile}>
              Supprimer
            </button>
          </div>
        </div>

        {/* Formulaire principal */}
        <div className="col-xl-9 col-lg-8">
          <div className="card shadow-sm p-4">
            <h5 className="text-primary mb-3">Informations personnelles</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postnom</label>
                <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom</label>
                <input type="text" name="nick_name" className="form-control" value={formData.nick_name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date de naissance</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setFormData((prev) => ({ ...prev, birth_date: date ? date.toISOString().split("T")[0] : "" }));
                  }}
                  placeholderText="AAAA-MM-JJ"
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Lieu de naissance</label>
                <input type="text" name="birth_place" className="form-control" value={formData.birth_place} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Genre</label>
                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Téléphone</label>
                <input type="text" name="phone_number" className="form-control" value={formData.phone_number} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Adresse</label>
                <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} rows={3}></textarea>
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="text-primary mb-3">Parents / Tuteur</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Père</label>
                <Select
                  options={fathers.map((f) => ({ value: f.id, label: f.full_name }))}
                  value={fathers.find((f) => f.id === formData.father) ? { value: formData.father, label: fathers.find((f) => f.id === formData.father).full_name } : null}
                  onChange={(option) => handleSelectChange("father", option)}
                  placeholder="Sélectionner un père..."
                  isClearable
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Mère</label>
                <Select
                  options={mothers.map((m) => ({ value: m.id, label: m.full_name }))}
                  value={mothers.find((m) => m.id === formData.mother) ? { value: formData.mother, label: mothers.find((m) => m.id === formData.mother).full_name } : null}
                  onChange={(option) => handleSelectChange("mother", option)}
                  placeholder="Sélectionner une mère..."
                  isClearable
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tuteur</label>
                <Select
                  options={tutors.map((t) => ({ value: t.id, label: t.full_name }))}
                  value={tutors.find((t) => t.id === formData.tutor) ? { value: formData.tutor, label: tutors.find((t) => t.id === formData.tutor).full_name } : null}
                  onChange={(option) => handleSelectChange("tutor", option)}
                  placeholder="Sélectionner un tuteur..."
                  isClearable
                />
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="text-primary mb-3">Catégorie / Province / Religion</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Catégorie</label>
                <select name="student_category" className="form-select" value={formData.student_category} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.designation}</option>))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Province</label>
                <select name="province" className="form-select" value={formData.province} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {provinces.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Religion</label>
                <select name="religion" className="form-select" value={formData.religion} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {religions.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                </select>
              </div>
              <div className="col-md-4 mt-2">
                <label className="form-label">Groupe sanguin</label>
                <select name="blood_group" className="form-select" value={formData.blood_group} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {bloodGroups.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                </select>
              </div>
              <div className="col-md-4 mt-2">
                <label className="form-label">Statut</label>
                <select name="student_status" className="form-select" value={formData.student_status} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {statuses.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                </select>
              </div>
            </div>

            <div className="text-center mt-4">
              <button style={{backgroundColor:'#539bff',color:'white'}} className="btn btn-light btn-lg" type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStudent;
