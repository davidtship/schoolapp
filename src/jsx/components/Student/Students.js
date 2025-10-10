import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Dropdown, Toast, ToastContainer } from "react-bootstrap";
import BasicModal from "../Dashboard/BasicModal";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const API_URL = API_BASE_URL+"/api/custom-students/";
const STATUS_URL = API_BASE_URL+"/api/student-status/";
const CATEGORY_URL = API_BASE_URL+"/api/student-categorys/";

const Students = () => {
  const childRef = useRef();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [unchecked, setUnChecked] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch étudiants
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(API_URL,
           {
			headers: {
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${localStorage
				.getItem("access")
				?.replaceAll('"', '')}`,
			},
		  }
        );
        const data = await response.json();
        const withChecks = data.map((s) => ({ ...s, inputchecked: false }));
        setStudents(withChecks);
        setFilteredStudents(withChecks);
      } catch (error) {
        console.error("Erreur fetch étudiants:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch statuts
  useEffect(() => {
    fetch(STATUS_URL)
      .then((res) => res.json())
      .then(setStatuses)
      .catch(console.error);
  }, []);

  // Fetch catégories
  useEffect(() => {
    fetch(CATEGORY_URL)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Filtrage recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
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

  const handleChecked = (id) => {
    const temp = students.map((s) =>
      id === s.id ? { ...s, inputchecked: !s.inputchecked } : s
    );
    setStudents(temp);
  };

  const handleCheckedAll = (value) => {
    const temp = students.map((s) => ({ ...s, inputchecked: value }));
    setStudents(temp);
    setUnChecked(!unchecked);
  };

  // Pagination
  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = filteredStudents.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredStudents.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);

  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const changeCPage = (id) => setCurrentPage(id);

  // Changer le statut
  const handleChangeStatus = async (studentId, statusId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_status: statusId }),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const selectedStatus = statuses.find((st) => st.id === statusId);
      const updated = students.map((s) =>
        s.id === studentId ? { ...s, student_status: selectedStatus } : s
      );
      setStudents(updated);
      setFilteredStudents(updated);
      const student = students.find((s) => s.id === studentId);
      setToastMessage(
        `✅ Le statut de ${student.first_name} ${student.last_name} est passé à "${selectedStatus.label}".`
      );
      setShowToast(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Changer la catégorie
  const handleChangeCategory = async (studentId, categoryId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_category: categoryId }),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const updated = students.map((s) =>
        s.id === studentId ? { ...s, student_category: selectedCategory } : s
      );
      setStudents(updated);
      setFilteredStudents(updated);
      const student = students.find((s) => s.id === studentId);
      setToastMessage(
        `📘 La catégorie de ${student.first_name} ${student.last_name} est passée à "${selectedCategory.code}".`
      );
      setShowToast(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="light"
          className="border-0 shadow"
          delay={3000}
          autohide
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto text-primary">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-dark">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ✅ Carte principale */}
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">📚 Liste des étudiants</h5>
          <Button variant="light" size="sm" className="fw-bold text-primary" onClick={() => childRef.current.openModal()}>
            + Ajouter
          </Button>
        </div>

        <div className="p-3 bg-light">
          <Form.Control
            type="text"
            placeholder="🔍 Rechercher un étudiant..."
            className="mb-3 shadow-sm border-0 rounded-pill px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ✅ Tableau design */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead
              style={{
                background: "linear-gradient(90deg, #007bff, #0056b3)",
                color: "white",
              }}
            >
              <tr>
                <th>
                  <Form.Check type="checkbox" onClick={() => handleCheckedAll(unchecked)} />
                </th>
                <th>Photo</th>
                <th>ID Étudiant</th>
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
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={student.inputchecked}
                      onChange={() => handleChecked(student.id)}
                    />
                  </td>
                  <td>
                    <img
                      src={"http://127.0.0.1:8000"+student.photo}
                      alt="profil"
                      className="rounded-circle border"
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                      }}
                    />
                  </td>
                  <td className="fw-bold text-primary">{student.student_code}</td>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.birth_date}</td>
                  <td>
                    <span className={`badge ${student.gender === "M" ? "bg-info" : "bg-danger"}`}>
                      {student.gender}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {student.student_category?.code || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-success">
                      {student.student_status?.label || "—"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-pill">
                          Statut
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {statuses.map((status) => (
                            <Dropdown.Item
                              key={status.id}
                              onClick={() => handleChangeStatus(student.id, status.id)}
                            >
                              {status.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      <Dropdown>
                        <Dropdown.Toggle variant="outline-warning" size="sm" className="rounded-pill">
                          Catégorie
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {categories.map((category) => (
                            <Dropdown.Item
                              key={category.id}
                              onClick={() => handleChangeCategory(student.id, category.id)}
                            >
                              {category.code}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center bg-light">
          <div className="text-muted small">
            Affiche {firstIndex + 1} à{" "}
            {filteredStudents.length < lastIndex ? filteredStudents.length : lastIndex} sur{" "}
            {filteredStudents.length} étudiants
          </div>

          <nav>
            <ul className="pagination pagination-sm mb-0">
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
      </div>

      <BasicModal ref={childRef} />
    </>
  );
};

export default Students;
