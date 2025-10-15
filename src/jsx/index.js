import React, { useContext } from "react";
import {  Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Nav2 from "./layouts/nav/index2";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
/// Dashboard
import Home from "./components/Dashboard/Home";
//Organisations

import Direction from "./components/Organisation/Directions";
import Section from "./components/Organisation/Section";
import Options from "./components/Organisation/Options";
import Classes from "./components/Organisation/Classes";
//Frais
import TypeFrais from "./components/Frais/TypeFrais";
import CategorieFrais from "./components/Frais/CategorieFrais";
import FraisParOption from "./components/Frais/frais_options";

//student
import Students from "./components/Student/Students";
import StudentDetails from "./components/Student/StudentDetails";
import AddNewStudent from "./components/Student/AddNewStudent";
import Affectations from "./components/Student/Affectations";

/// Pages

import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import { ThemeContext } from "../context/ThemeContext";

//Parametres

import ConfigSchool from "./components/Parametres/ConfigurationScolaire";
import Monaie from "./components/Parametres/Monaie";
import ConfigMonaie from "./components/Parametres/ConfigurationMonaie";

const Markup = () => {
  const routhPath = [
  {url: "affectations", component: <Affectations/>},
  {url: "configSchool", component: <ConfigSchool/>},
  {url: "classes", component: <Classes/>},
  {url: "options", component: <Options/>},
  {url: "sections", component: <Section/>},
  {url: "directions", component: <Direction/>},
   {url: "config-monaie", component: <ConfigMonaie/>},
    {url: "monaie", component: <Monaie/>},
    {url: "Frais-par-options", component: <FraisParOption/>},
    {url: "type-frais", component: <TypeFrais/>},
    {url: "categorie-frais", component: <CategorieFrais/>},
    {url: "student", component: <Students/>},
    {url: "student-detail", component: <StudentDetails/>},
    {url: "add-student", component: <AddNewStudent/>},


  ] 

  
  return (
    <>
      <Routes>                    
          <Route path='/page-error-400' element={<Error400 />} />
          <Route path='/page-error-403' element={<Error403 />} />
          <Route path='/page-error-404' element={<Error404 />} />
          <Route path='/page-error-500' element={<Error500 />} />
          <Route path='/page-error-503' element={<Error503 />} />     
    
            <Route element={<Layout1 />}>
              <Route path='/' exact element={<Home/>} />
              <Route path='/dashboard' exact element={<Home/>} />                                         
            </Route>           
            <Route element={<Layout2 />}>							        
                { routhPath.map((data, i) => (
                  <Route key={i} exact path={`/${data.url}`} element={data.component} />
                ))}  
            </Route>                              
            
             
				</Routes>        
	    <ScrollToTop />
    </>
  );
};

function Layout1(){
  const {  sidebariconHover } = useContext(ThemeContext);
  const sideMenu = useSelector(state => state.sideMenu);
  let windowsize = window.innerWidth;
  // console.log(windowsize, 'size')
  return(
    
      <div id="main-wrapper" className={` show  ${sidebariconHover ? "iconhover-toggle": ""} ${ sideMenu ? "menu-toggle" : ""}`}>                
          <div className={`wallet-open  ${windowsize > 1500 ? 'active' : ''}`}>
           <Nav2 />
            <div className="content-body" style={{ minHeight: window.screen.height + 20 }}>
              <div className="container-fluid"> 
                <Outlet />
              </div>  
            </div> 
            
                     
          </div>
      </div>            
    
  )
}

function Layout2(){
  const sideMenu = useSelector(state => state.sideMenu);
  const {  sidebariconHover } = useContext(ThemeContext);
  return(    
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle": ""} ${ sideMenu ? "menu-toggle" : ""}`}>           
        <Nav />
        <div className="content-body" style={{ minHeight: window.screen.height + 20 }}>
         							        
            <Outlet />							        
                               
        </div>  
                   
    </div>  
    
  )
}



function Layout5(){
  const sideMenu = useSelector(state => state.sideMenu);
  const {  sidebariconHover } = useContext(ThemeContext);
  return(
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle": ""} ${ sideMenu ? "menu-toggle" : ""}`}>  	      
          <Nav />
          <div className="content-body message-body mh-auto">
            <div className="container-fluid mh-auto p-0">   
              <Outlet />
            </div>
          </div>
    </div>
  )
}
function Layout6(){
  const sideMenu = useSelector(state => state.sideMenu);
  const {  sidebariconHover } = useContext(ThemeContext);
  return(
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle": ""} ${ sideMenu ? "menu-toggle" : ""}`}>  
        <Nav />
        <div className="content-body">
          <div className="container-fluid">       
            <Outlet />
          </div>
        </div>
        <Footer  changeFooter="out-footer style-1"/>
      </div>
  )
}

export default Markup;