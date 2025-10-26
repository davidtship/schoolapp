import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function StudentAssignment() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userId = 1;
  const token = localStorage.getItem('access');
  const rccm = localStorage.getItem('rccm');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  };

  // 🔹 Style commun pour tous les Select
  const customSelectStyles = {
    control: (provided) => ({ ...provided, color: '#000000' }),
    singleValue: (provided) => ({ ...provided, color: '#000000' }),
    option: (provided, state) => ({
      ...provided,
      color: '#000000',
      backgroundColor: state.isFocused ? '#e6f0ff' : '#fff',
    }),
    placeholder: (provided) => ({ ...provided, color: '#000000' }),
  };

  // 🔹 Fetch data au chargement
  useEffect(() => {
    axios.get(API_BASE_URL+'/api/students/', axiosConfig)
      .then(res => setStudents(res.data))
      .catch(err => console.log(err));

    axios.get(API_BASE_URL+'/api/classes/', axiosConfig)
      .then(res => setClasses(res.data))
      .catch(err => console.log(err));

    axios.get(API_BASE_URL+'/api/schoolyears/', axiosConfig)
      .then(res => setSchoolYears(res.data))
      .catch(err => console.log(err));

    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    axios.get(API_BASE_URL+'/api/custom-student-assignements/', axiosConfig)
      .then(res => {
        setAssignments(res.data);
        setFilteredAssignments(res.data);
      })
      .catch(err => console.log(err));
  };

  // 🔹 Soumission formulaire (corrigée avec gestion d’erreurs du backend)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass || !selectedYear || !rccm) {
      setError('Veuillez remplir tous les champs et vérifier le RCCM');
      return;
    }

    const data = {
      rccm,
      assignment_date: new Date().toISOString().split('T')[0],
      student: selectedStudent.value,
      classe: selectedClass.value,
      school_year: parseInt(selectedYear),
      user: userId,
    };

    setLoading(true);
    setError('');
    setSuccess('');

    axios.post(API_BASE_URL+'/api/student-assignements/', data, axiosConfig)
      .then(res => {
        setSuccess('Élève affecté avec succès !');
        setSelectedStudent(null);
        setSelectedClass(null);
        setSelectedYear('');
        fetchAssignments();
      })
      .catch(err => {
        console.log("Erreur backend :", err.response?.data);

        // 🔹 Gestion intelligente des messages d’erreur renvoyés par Django
        if (err.response && err.response.data) {
          const backendError = err.response.data;
          if (backendError.classe) {
            setError(backendError.classe[0]);
          } else if (backendError.student) {
            setError(backendError.student[0]);
          } else if (backendError.detail) {
            setError(backendError.detail);
          } else if (typeof backendError === 'string') {
            setError(backendError);
          } else {
            setError("Erreur lors de l’affectation. Vérifiez les informations saisies.");
          }
        } else {
          setError("Erreur de connexion au serveur.");
        }
      })
      .finally(() => setLoading(false));
  };

  // 🔹 Options react-select
const studentOptions = students.map(s => ({
  value: s.id,
  label: `${s.first_name} ${s.last_name} ${s.nick_name} - ${s.student_code} ${s.current_affectation?.classe?.option?.name || "Aucune affectation"}`
}));

  const classOptions = classes.map(c => ({ value: c.id, label: `${c.name} (${c.option.name})` }));

  // 🔹 Options uniques Direction / Section / Option / Classe
  const directionOptions = [...new Map(assignments.map(a => [a.classe.option.section.direction.id, a.classe.option.section.direction])).values()]
    .map(d => ({ value: d.id, label: d.name }));

  const sectionOptions = selectedDirection
    ? [...new Map(
        assignments
          .filter(a => a.classe.option.section.direction.id === selectedDirection.value)
          .map(a => [a.classe.option.section.id, a.classe.option.section])
      ).values()].map(s => ({ value: s.id, label: s.name }))
    : [];

  const optionOptions = selectedSection
    ? [...new Map(
        assignments
          .filter(a => a.classe.option.section.id === selectedSection.value)
          .map(a => [a.classe.option.id, a.classe.option])
      ).values()].map(o => ({ value: o.id, label: o.name }))
    : [];

  const classFilterOptions = selectedOption
    ? [...new Map(
        assignments
          .filter(a => a.classe.option.id === selectedOption.value)
          .map(a => [a.classe.id, a.classe])
      ).values()].map(c => ({ value: c.id, label: c.name }))
    : [];

  // 🔹 Appliquer filtres + recherche
  useEffect(() => {
    let filtered = assignments;

    if (selectedDirection) filtered = filtered.filter(a => a.classe.option.section.direction.id === selectedDirection.value);
    if (selectedSection) filtered = filtered.filter(a => a.classe.option.section.id === selectedSection.value);
    if (selectedOption) filtered = filtered.filter(a => a.classe.option.id === selectedOption.value);
    if (selectedClass) filtered = filtered.filter(a => a.classe.id === selectedClass.value);

    if (searchTerm) {
      filtered = filtered.filter(a =>
        `${a.student.first_name} ${a.student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.student.student_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
    setCurrentPage(1);
  }, [selectedDirection, selectedSection, selectedOption, selectedClass, searchTerm, assignments]);

  // 🔹 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Payement des frais </h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Code eleve ou nom de l'eleve</label>
          <Select 
            options={studentOptions} 
            value={selectedStudent} 
            onChange={setSelectedStudent} 
            isSearchable 
            styles={customSelectStyles} 
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Enregistrement...' : "Affecter l'élève"}
        </button>
      </form>

      <hr className="my-4" />

      <h3>Filtres</h3>
      <div className="row mb-3">
        <div className="col-md-3">
          <Select 
            options={directionOptions} 
            value={selectedDirection} 
            onChange={setSelectedDirection} 
            placeholder="Direction" 
            isClearable 
            styles={customSelectStyles} 
          />
        </div>
        <div className="col-md-3">
          <Select 
            options={sectionOptions} 
            value={selectedSection} 
            onChange={setSelectedSection} 
            placeholder="Section" 
            isClearable 
            styles={customSelectStyles} 
          />
        </div>
        <div className="col-md-3">
          <Select 
            options={optionOptions} 
            value={selectedOption} 
            onChange={setSelectedOption} 
            placeholder="Option" 
            isClearable 
            styles={customSelectStyles} 
          />
        </div>
        <div className="col-md-3">
          <Select 
            options={classFilterOptions} 
            value={selectedClass} 
            onChange={setSelectedClass} 
            placeholder="Classe" 
            isClearable 
            styles={customSelectStyles} 
          />
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un élève par nom ou code..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>Code élève</th>
              <th>Élève</th>
              <th>Direction</th>
              <th>Section</th>
              <th>Option</th>
              <th>Classe</th>
              <th>Année scolaire</th>
              <th>Date affectation</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">Aucune affectation</td>
              </tr>
            ) : currentItems.map(a => (
              <tr key={a.id}>
                <td>{a.student.student_code}</td>
                <td>{a.student.first_name} {a.student.last_name}</td>
                <td>{a.classe.option.section.direction.name}</td>
                <td>{a.classe.option.section.name}</td>
                <td>{a.classe.option.name}</td>
                <td>{a.classe.name}</td>
                <td>{a.school_year.name}</td>
                <td>{a.assignment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination simple */}
      <nav aria-label="Pagination">
        <ul className="pagination justify-content-center flex-wrap gap-2">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link rounded-pill px-3"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              &#8592;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <li key={n} className={`page-item ${currentPage === n ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(n)}>{n}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link rounded-pill px-3"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
               &#8594;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default StudentAssignment;
