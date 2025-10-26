import React, { useReducer, useContext, useEffect, useState } from "react";
import { Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { MenuList } from './Menu';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
const SchoolLogoPro = () => (
  <svg width="200" height="50" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fond simple arrondi */}
    <rect x="0" y="0" width="220" height="60" rx="12" fill="#539bff" />

    {/* Icône livre stylisé */}
    <g transform="translate(15,10)">
      <rect x="0" y="0" width="30" height="40" rx="4" fill="#ffffff" />
      <line x1="6" y1="6" x2="24" y2="6" stroke="#539bff" strokeWidth="2" />
      <line x1="6" y1="12" x2="24" y2="12" stroke="#539bff" strokeWidth="2" />
      <line x1="6" y1="18" x2="24" y2="18" stroke="#539bff" strokeWidth="2" />
    </g>

    {/* Texte simple AcaPay */}
    <text
      x="60"
      y="35"
      fill="#ffffff"
      fontSize="26"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
    >
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
        width: minimized ? '70px' : '240px',
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
      {/* Logo + toggle */}
      <div className="dlabnav-scroll px-3 py-4 d-flex flex-column align-items-center">
        <div className="d-flex justify-content-center w-100 align-items-center mb-4">
          {!minimized && <Link to="/dashboard"><SchoolLogoPro /></Link>}
        </div>

        {/* Menu */}
        <ul className="metismenu w-100" id="menu">
          {MenuList.map((menu, i) => {
            const isTitle = menu.classsChange === "menu-title";
            if (isTitle) return !minimized && (
              <li className="text-uppercase text-muted fw-bold mt-3 mb-2" key={i}>
                <span style={{ fontSize: '12px', letterSpacing: '1px' }}>{menu.title}</span>
              </li>
            );

            return (
              <li key={i} className={`${state.active === menu.title ? 'mm-active' : ''}`} style={{ position: 'relative' }}>
                {menu.content?.length > 0 ? (
                  <>
                    <Link
                      to="#"
                      className="has-arrow d-flex justify-content-between align-items-center"
                      onClick={() => handleMenuActive(menu.title)}
                      style={{ padding: '10px', borderRadius: '8px', display:'flex', alignItems:'center', transition:'background 0.3s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <div className="d-flex align-items-center">
                        {menu.iconStyle}
                        {!minimized && <span className="nav-text ms-2">{menu.title}</span>}
                      </div>
                    </Link>
                    {!minimized && (
                      <Collapse in={state.active === menu.title}>
                        <ul style={{ listStyle: 'none', paddingLeft: '10px', transition: 'all 0.3s ease' }}>
                          {menu.content.map((item, j) => (
                            <li key={j} className={`${state.activeSubmenu === item.title ? "mm-active" : ""}`}>
                              {item.content?.length > 0 ? (
                                <>
                                  <Link 
                                    to={item.to} 
                                    className="has-arrow d-flex align-items-center"
                                    onClick={() => handleSubmenuActive(item.title)}
                                    style={{ paddingLeft: '20px', transition: 'background 0.3s ease' }}
                                  >
                                    {item.iconStyle && <span className="me-2">{item.iconStyle}</span>}
                                    <span>{item.title}</span>
                                  </Link>
                                  <Collapse in={state.activeSubmenu === item.title}>
                                    <ul style={{ listStyle: 'none', paddingLeft: '30px', transition: 'all 0.3s ease' }}>
                                      {item.content.map((sub, k) => (
                                        <li key={k}>
                                          <Link 
                                            to={sub.to} 
                                            className={`${path === sub.to ? "mm-active" : ""}`} 
                                            style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px', transition: 'background 0.3s ease' }}
                                          >
                                            {sub.iconStyle && <span className="me-2">{sub.iconStyle}</span>}
                                            <span>{sub.title}</span>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </Collapse>
                                </>
                              ) : (
                                <Link 
                                  to={item.to} 
                                  className={`${item.to === path ? 'mm-active' : ''}`} 
                                  style={{ display:'flex', alignItems:'center', padding:'10px', paddingLeft: '20px', transition:'background 0.3s ease' }}
                                >
                                  {item.iconStyle && <span className="me-2">{item.iconStyle}</span>}
                                  <span>{item.title}</span>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    )}
                  </>
                ) : (
                  <Link to={menu.to} style={{ display:'flex', alignItems:'center', padding:'10px', borderRadius:'8px', transition:'background 0.3s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    {menu.iconStyle}
                    {!minimized && <span className="nav-text ms-2">{menu.title}</span>}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
