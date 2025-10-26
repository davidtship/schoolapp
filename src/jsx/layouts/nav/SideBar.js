import React, { useReducer, useContext, useEffect, useState } from "react";
import { Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { MenuList } from './Menu';
import { ThemeContext } from "../../../context/ThemeContext";

const SchoolLogoPro = () => (
  <svg width="200" height="50" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="220" height="60" rx="12" fill="#539bff" />
    <g transform="translate(15,10)">
      <rect x="0" y="0" width="30" height="40" rx="4" fill="#ffffff" />
      <line x1="6" y1="6" x2="24" y2="6" stroke="#539bff" strokeWidth="2" />
      <line x1="6" y1="12" x2="24" y2="12" stroke="#539bff" strokeWidth="2" />
      <line x1="6" y1="18" x2="24" y2="18" stroke="#539bff" strokeWidth="2" />
    </g>
    <text x="60" y="35" fill="#ffffff" fontSize="26" fontWeight="700" fontFamily="Arial, sans-serif">
      AcaPay
    </text>
  </svg>
);

const reducer = (prev, next) => ({ ...prev, ...next });
const initialState = { active: "", activeSubmenu: "" };

const SideBar = () => {
  const { iconHover, sidebarposition, ChangeIconSidebar } = useContext(ThemeContext);
  const [state, setState] = useReducer(reducer, initialState);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const btn = document.querySelector(".nav-control");
    const wrapper = document.querySelector("#main-wrapper");
    btn?.addEventListener("click", () => wrapper?.classList.toggle("menu-toggle"));
  }, []);

  const handleMenuActive = (title) => setState({ active: state.active === title ? "" : title });
  const handleSubmenuActive = (title) => setState({ activeSubmenu: state.activeSubmenu === title ? "" : title });

  let path = window.location.pathname.split("/").pop();

  useEffect(() => {
    MenuList.forEach(menu => {
      menu.content?.forEach(item => {
        if (path === item.to) setState({ active: menu.title });
        item.content?.forEach(sub => { 
          if (path === sub.to) setState({ active: menu.title, activeSubmenu: item.title }) 
        });
      });
    });
  }, [path]);

  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`dlabnav ${iconHover} ${minimized ? 'sidebar-minimized' : ''}`}
      style={{
        position: sidebarposition.value === 'fixed' ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        width: minimized ? '70px' : '200px',
        height: '100vh',
        fontFamily: 'monospace',
        backgroundColor: '#539bff',
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
        transition: 'width 0.4s ease',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      <div className="dlabnav-scroll px-2 py-4 d-flex flex-column align-items-center">
        <div className="d-flex justify-content-center w-100 align-items-center mb-4">
          {!minimized && <Link to="/dashboard"><SchoolLogoPro /></Link>}
        </div>

        <ul className="metismenu w-100" id="menu" style={{ padding: '0' }}>
          {MenuList.map((menu, i) => {
            const isTitle = menu.classsChange === "menu-title";
            if (isTitle) return !minimized && (
              <li className="text-uppercase text-muted fw-bold mt-3 mb-3" key={i}>
                <span style={{ fontSize: '12px', letterSpacing: '1px' }}>{menu.title}</span>
              </li>
            );

            return (
              <li key={i} className={`${state.active === menu.title ? 'mm-active' : ''}`} style={{ marginBottom: '4px' }}>
                {menu.content?.length > 0 ? (
                  <>
                    <Link
                      to="#"
                      className="has-arrow d-flex align-items-center sidebar-link"
                      onClick={() => handleMenuActive(menu.title)}
                      style={{ padding: '10px 8px', borderRadius: '8px', display:'flex', alignItems:'center', transition:'background 0.3s ease' }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="sidebar-icon">{menu.iconStyle}</span>
                        {!minimized && <span className="nav-text ms-2 sidebar-text">{menu.title}</span>}
                      </div>
                    </Link>

                    {!minimized && (
                      <Collapse in={state.active === menu.title}>
                        <ul style={{ listStyle: 'none', paddingLeft: '12px', marginTop: '4px' }}>
                          {menu.content.map((item, j) => (
                            <li key={j} className={`${state.activeSubmenu === item.title ? "mm-active" : ""}`}>
                              <Link to={item.to} className="d-flex align-items-center sidebar-sub-link" style={{ padding: '8px 0', paddingLeft: '20px' }}>
                                {item.iconStyle && <span className="me-2">{item.iconStyle}</span>}
                                <span>{item.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    )}
                  </>
                ) : (
                  <Link
                    to={menu.to}
                    className="d-flex align-items-center sidebar-link"
                    style={{ padding: '10px 8px', borderRadius:'8px' }}
                  >
                    {menu.iconStyle}
                    {!minimized && <span className="nav-text ms-2 sidebar-text">{menu.title}</span>}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Styles modernes */}
      <style>{`
        .sidebar-link:hover {
          background: rgba(255,255,255,0.15);
          cursor: pointer;
        }
        .sidebar-icon {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .sidebar-link:hover .sidebar-icon {
          transform: translateX(5px);
          color: #fff;
        }
        .sidebar-text {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .sidebar-link:hover .sidebar-text {
          transform: translateX(3px);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SideBar;
