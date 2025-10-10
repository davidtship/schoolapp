import React, { useState, useContext, useEffect } from "react";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeContext";
import { SVGICON } from "./Content";

// 🔹 Composants dynamiques
const SchoolPerformance = loadable(() =>
  pMinDelay(import("./Elements/SchoolPerformance"), 500)
);
const SchoolOverView = loadable(() =>
  pMinDelay(import("./Elements/SchoolOverView"), 1000)
);

// ✅ URL de base configurée via .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const Home = () => {
  const { changeBackground } = useContext(ThemeContext);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(130);
  const [parentsCount, setParentsCount] = useState(700);
  const [classesCount, setClassesCount] = useState(300);

  // 🎨 Thème clair
  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
  }, [changeBackground]);

  // 🔹 Récupération du nombre d’élèves depuis l’API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access")?.replaceAll('"', "");
        const response = await axios.get(`${API_BASE_URL}/api/students/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ Si la réponse contient une liste
        if (Array.isArray(response.data)) {
          setStudentsCount(response.data.length);
        } else if (response.data.count) {
          setStudentsCount(response.data.count);
        } else {
          setStudentsCount(0);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des élèves :", error);
        setStudentsCount(0);
      }
    };

    fetchStudents();
  }, []);

  // 📊 Données des cartes
  const cardBlog = [
    { title: "Élèves", svg: SVGICON.user, number: studentsCount, color: "#539bff" },
    { title: "Enseignants", svg: SVGICON.user2, number: teachersCount, color: "#2E3A59" },
    { title: "Parents", svg: SVGICON.event, number: parentsCount, color: "#539bff" },
    { title: "Classes", svg: SVGICON.food, number: classesCount, color: "#2E3A59" },
  ];

  return (
    <>
      {/* 📋 Statistiques rapides */}
      <div className="row">
        {cardBlog.map((item, ind) => (
          <div className="col-xl-3 col-6 mb-3" key={ind}>
            <div
              className="card shadow-sm"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
            >
              <div
                className="d-flex align-items-center p-3"
                style={{
                  backgroundColor: item.color,
                  color: "#fff",
                  minHeight: "100px",
                }}
              >
                <div className="me-3" style={{ fontSize: "28px" }}>
                  {item.svg}
                </div>
                <div>
                  <p
                    className="mb-1"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#ffffff",
                    }}
                  >
                    {item.title}
                  </p>
                  <h3
                    className="mb-0"
                    style={{
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {item.number}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📈 Section graphique */}
      <div className="row">
        <div className="col-xl-6 mb-3">
          <div className="card h-100 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-header d-flex justify-content-between align-items-center pb-0 border-0">
              <h4 style={{ color: "#2E3A59", fontWeight: 600 }}>Performance Scolaire</h4>
            </div>
            <div className="card-body p-3">
              <SchoolPerformance />
            </div>
          </div>
        </div>

        <div className="col-xl-6 mb-3">
          <div className="card h-100 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-3">
              <SchoolOverView />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
