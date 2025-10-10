import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';
import { IMAGES } from '../Dashboard/Content';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const AddNewStudent = () => {
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nick_name: '',
    birth_date: '',
    birth_place: '',
    email: '',
    address: '',
    phone_number: '',
    father_id: '',
    mother_id: '',
    tutor_id: '',
    student_category_id: '',
    province_id: '',
    religion_id: '',
    blood_group_id: '',
    student_status_id: '',
    gender: 'M',
  });

  const [parents, setParents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [religions, setReligions] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL+'/api/parents/').then(res => setParents(res.data));
    axios.get(API_BASE_URL+'/api/student-categorys/').then(res => setCategories(res.data));
    axios.get(API_BASE_URL+'/api/provinces/').then(res => setProvinces(res.data));
    axios.get(API_BASE_URL+'/api/religions/').then(res => setReligions(res.data));
    axios.get(API_BASE_URL+'/api/blood-groups/').then(res => setBloodGroups(res.data));
    axios.get(API_BASE_URL+'/api/student-status/').then(res => setStatuses(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fileHandler = (e) => setFile(e.target.files[0]);
  const removeFile = () => setFile(null);

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('photo', file);

    try {
      await axios.post('http://localhost:8000/api/students/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Élève ajouté avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout de l\'élève.');
    }
  };

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Photo */}
        <div className="col-xl-3 col-lg-4">
          <label className="form-label text-primary">Photo</label>
          <div className="avatar-upload">
            <div className="avatar-preview mb-2">
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  backgroundImage: file ? `url(${URL.createObjectURL(file)})` : `url(${IMAGES.noimage})`,
                }}
              />
            </div>
            <input type="file" className="d-none" onChange={fileHandler} id="imageUpload" accept=".png,.jpg,.jpeg" />
            <label htmlFor="imageUpload" className="btn btn-primary btn-sm me-2">Choisir le fichier</label>
            <button className="btn btn-danger btn-sm" onClick={removeFile}>Supprimer</button>
          </div>
        </div>

        {/* Formulaire principal */}
        <div className="col-xl-9 col-lg-8">
          <div className="row g-3">
            {/* Infos personnelles */}
            <div className="col-md-6">
              <label className="form-label text-primary">Prénom</label>
              <input type="text" name="first_name" className="form-control" onChange={handleChange} placeholder="Prénom" />

              <label className="form-label text-primary mt-2">Nom</label>
              <input type="text" name="last_name" className="form-control" onChange={handleChange} placeholder="Nom" />

              <label className="form-label text-primary mt-2">Surnom</label>
              <input type="text" name="nick_name" className="form-control" onChange={handleChange} placeholder="Surnom" />

              {/* Date et lieu de naissance */}
              <label className="form-label text-primary mt-3">Date et lieu de naissance</label>
              <div className="row g-2">
                <div className="col-6">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setFormData(prev => ({ ...prev, birth_date: date ? date.toISOString().split('T')[0] : '' }));
                    }}
                    placeholderText="AAAA-MM-JJ"
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                  />
                </div>
                <div className="col-6">
                  <input type="text" name="birth_place" className="form-control" onChange={handleChange} placeholder="Lieu de naissance" />
                </div>
              </div>

              <label className="form-label text-primary mt-2">Genre</label>
              <select name="gender" className="form-select" onChange={handleChange}>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>

              <label className="form-label text-primary mt-2">Email</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="email@example.com" />

              <label className="form-label text-primary mt-2">Numéro de téléphone</label>
              <input type="text" name="phone_number" className="form-control" onChange={handleChange} placeholder="+243xxxxxxx" />

              <label className="form-label text-primary mt-2">Adresse</label>
              <textarea name="address" className="form-control" onChange={handleChange} rows={3}></textarea>
            </div>

            {/* Parents et catégories */}
            <div className="col-md-6">
              <label className="form-label text-primary">Père</label>
              <select name="father_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner le père</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Mère</label>
              <select name="mother_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner la mère</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Tuteur</label>
              <select name="tutor_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner le tuteur</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Catégorie</label>
              <select name="student_category_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner la catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Province</label>
              <select name="province_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner la province</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Religion</label>
              <select name="religion_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner la religion</option>
                {religions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Groupe sanguin</label>
              <select name="blood_group_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner le groupe sanguin</option>
                {bloodGroups.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>

              <label className="form-label text-primary mt-2">Statut</label>
              <select name="student_status_id" className="form-select" onChange={handleChange}>
                <option value="">Sélectionner le statut</option>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-outline-primary me-2" type="button">Enregistrer comme brouillon</button>
            <button className="btn btn-primary" type="button" onClick={handleSubmit}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStudent;
