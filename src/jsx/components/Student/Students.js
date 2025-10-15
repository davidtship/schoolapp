import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Dropdown, Toast, ToastContainer } from "react-bootstrap";
import BasicModal from "../Dashboard/BasicModal";
import AddNewStudent from "./AddNewStudent";
import EditStudent from "./EditStudent";
import Swal from "sweetalert2";
import Avatar from "react-avatar"; // <-- Import react-avatar

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = API_BASE_URL + "/api/custom-students/";
const STUDENT_URL = API_BASE_URL + "/api/students/";
const STATUS_URL = API_BASE_URL + "/api/student-status/";
const CATEGORY_URL = API_BASE_URL + "/api/student-categorys/";

const Students = () => {
  const childRef = useRef(); // modal ajout
  const editRef = useRef(); // modal édition
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [unchecked, setUnChecked] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const token = localStorage.getItem("access")?.replaceAll('"', '');

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const withChecks = data.map((s) => ({ ...s, inputchecked: false }));
      setStudents(withChecks);
      setFilteredStudents(withChecks);
      setToastMessage("🔄 Liste des étudiants actualisée !");
      setShowToast(true);
    } catch (error) {
      console.error("Erreur fetch étudiants:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [statusRes, categoryRes] = await Promise.all([
          fetch(STATUS_URL, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(CATEGORY_URL, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [statusData, categoryData] = await Promise.all([statusRes.json(), categoryRes.json()]);
        setStatuses(statusData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Erreur récupération statuts/catégories:", error);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    if (!searchTerm) setFilteredStudents(students);
    else {
      const filtered = students.filter((s) =>
        [
          `${s.first_name} ${s.last_name}`,
          s.student_code,
          s.father?.full_name,
          s.phone_number,
          s.address,
          s.gender,
          s.student_category?.code,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, students]);

  const handleChecked = (id) =>
    setStudents(students.map((s) => (s.id === id ? { ...s, inputchecked: !s.inputchecked } : s)));
  const handleCheckedAll = (value) => {
    setStudents(students.map((s) => ({ ...s, inputchecked: value })));
    setUnChecked(!unchecked);
  };

  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = filteredStudents.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredStudents.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  const handleChangeStatus = async (studentId, statusId) => {
    try {
      const response = await fetch(`${STUDENT_URL}${studentId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_status: statusId }),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const selectedStatus = statuses.find((st) => st.id === statusId);
      const updated = students.map((s) => (s.id === studentId ? { ...s, student_status: selectedStatus } : s));
      setStudents(updated);
      setFilteredStudents(updated);
      const student = students.find((s) => s.id === studentId);
      setToastMessage(`✅ Le statut de ${student.first_name} ${student.last_name} est passé à "${selectedStatus.label}".`);
      setShowToast(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeCategory = async (studentId, categoryId) => {
    try {
      const response = await fetch(`${STUDENT_URL}${studentId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_category: categoryId }),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const updated = students.map((s) => (s.id === studentId ? { ...s, student_category: selectedCategory } : s));
      setStudents(updated);
      setFilteredStudents(updated);
      const student = students.find((s) => s.id === studentId);
      setToastMessage(`📘 La catégorie de ${student.first_name} ${student.last_name} est passée à "${selectedCategory.code}".`);
      setShowToast(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    Swal.fire({
      title: `Supprimer ${student.first_name} ${student.last_name} ?`,
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
          const response = await fetch(`${STUDENT_URL}${studentId}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          if (response.ok) {
            const updated = students.filter((s) => s.id !== studentId);
            setStudents(updated);
            setFilteredStudents(updated);
            Swal.fire({ title: "✅ Supprimé !", text: `${student.first_name} ${student.last_name} a été supprimé avec succès.`, icon: "success", confirmButtonColor: "#3085d6" });
          } else Swal.fire("Erreur", "La suppression a échoué.", "error");
        } catch (error) {
          Swal.fire("Erreur", "Une erreur est survenue.", "error");
        }
      }
    });
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    editRef.current.openModal();
  };

  const onStudentUpdated = (updatedStudent) => {
    const updatedList = students.map((s) => (s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s));
    setStudents(updatedList);
    setFilteredStudents(updatedList);
    setToastMessage(`✏️ ${updatedStudent.first_name} ${updatedStudent.last_name} a été mis à jour !`);
    setShowToast(true);
  };

  return (
    <>
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg="light" className="border-0 shadow" delay={1500} autohide>
          <Toast.Header closeButton>
            <strong className="me-auto ">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-dark">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div style={{ fontFamily: 'monospace', fontSize: '1em' }} className="card shadow border-0 rounded-4 overflow-hidden">
        <div style={{ backgroundColor: '#86bef7' }} className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-dark">📚 Liste des éleves</h5>
          <div className="d-flex gap-2">
            <Button variant="light" className="fw-bold text-dark" onClick={() => childRef.current.openModal()}>+ Ajouter</Button>
            <Button variant="light" className="fw-bold text-dark" onClick={fetchStudents}>🔄 Actualiser</Button>
          </div>
        </div>

        <div className="p-3 bg-light">
          <Form.Control type="text" placeholder="🔍 Rechercher un éleve..." className="mb-3 shadow-sm border-0 rounded-pill px-4 py-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-dark">
            <thead style={{ backgroundColor: "#dcddde" }}>
              <tr>
                <th><Form.Check type="checkbox" onClick={() => handleCheckedAll(unchecked)} /></th>
                <th>Matricule</th>
                <th>Avatar</th>
                <th>Nom complet</th>
                <th>Date de naissance</th>
                <th>Sexe</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((student) => (
                <tr key={student.id}>
                  <td><Form.Check type="checkbox" checked={student.inputchecked} onChange={() => handleChecked(student.id)} /></td>
                  <td className="fw-bold text-primary">{student.student_code}</td>
                  <td>
                    {student.photo ? (
                      <img src={`${API_BASE_URL}${student.photo}`} alt="profil" className="rounded-circle border" style={{ width: "45px", height: "45px", objectFit: "cover", boxShadow: "0 0 5px rgba(0,0,0,0.2)" }} />
                    ) : (
                      <Avatar name={`${student.first_name} ${student.last_name}`} size="45" round={true} />
                    )}
                  </td>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.birth_date}</td>
                  <td><span className={`badge ${student.gender === "M" ? "bg-info" : "bg-danger"}`}>{student.gender}</span></td>
                  <td><span className="badge bg-warning text-dark">{student.student_category?.code || "—"}</span></td>
                  <td><span className="badge bg-success">{student.student_status?.label || "—"}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-pill">Statut</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {statuses.map((status) => (
                            <Dropdown.Item key={status.id} onClick={() => handleChangeStatus(student.id, status.id)}>{status.label}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-warning" size="sm" className="rounded-pill">Catégorie</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {categories.map((category) => (
                            <Dropdown.Item key={category.id} onClick={() => handleChangeCategory(student.id, category.id)}>{category.code}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      <Button variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => handleEditClick(student)}>✏️ Modifier</Button>
                      <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handleDeleteStudent(student.id)}>🗑️ Supprimer</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center bg-light">
          <div className="text-muted small">Affiche {firstIndex + 1} à {filteredStudents.length < lastIndex ? filteredStudents.length : lastIndex} sur {filteredStudents.length} étudiants</div>
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

      <BasicModal ref={childRef} title="Ajouter un nouvel élève">
        <AddNewStudent onStudentAdded={(newStudent) => {
          const withCheck = { ...newStudent, inputchecked: false };
          setStudents((prev) => [withCheck, ...prev]);
          setFilteredStudents((prev) => [withCheck, ...prev]);
          setToastMessage(`✅ Élève ${newStudent.first_name} ${newStudent.last_name} ajouté avec succès !`);
          setShowToast(true);
        }} />
      </BasicModal>

      <BasicModal ref={editRef} title="Modifier l'élève">
        {selectedStudent && <EditStudent student={selectedStudent} onStudentUpdated={onStudentUpdated} />}
      </BasicModal>
    </>
  );
};

export default Students;
