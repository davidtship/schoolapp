import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import BasicModal from "../components/Dashboard/BasicModal";

import pic1 from "./../../images/profile/small/pic1.jpg";
import pic2 from "./../../images/profile/small/pic2.jpg";
import pic3 from "./../../images/profile/small/pic3.jpg";
import pic4 from "./../../images/profile/small/pic4.jpg";
import pic5 from "./../../images/profile/small/pic5.jpg";
import foodpic1 from "./../../images/food/pic1.jpg";
import foodpic2 from "./../../images/food/pic2.jpg";
import foodpic3 from "./../../images/food/pic3.jpg";

const studentList = [
  { image: pic1, title: "Samantha William", subtitle: "Class VII A" },
  { image: pic2, title: "Tony Soap", subtitle: "Class VII B" },
  { image: pic3, title: "Karen Hope", subtitle: "Class XI C" },
  { image: pic4, title: "Jordan Nico", subtitle: "Class VI D" },
  { image: pic5, title: "Nadila Adja", subtitle: "Class XII A" },
];

const cardBlog = [
  { image: foodpic1, title: "Beef Steak with Fried Potato" },
  { image: foodpic2, title: "Pancake with Honey" },
  { image: foodpic3, title: "Japanese Beef Ramen" },
];

const WalletBar = () => {
  const childRef = useRef();
  const [addList, setAddList] = useState(studentList);
  const [load, setLoad] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // 👈 état d'ouverture

  const AddMoreData = () => {
    setLoad(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * addList.length);
      const randomItem = addList[randomIndex];
      setAddList((prevArray) => [...prevArray, randomItem]);
      setLoad(false);
    }, 1000);
  };

  // 👇 Fonction pour ouvrir/fermer la barre latérale
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Overlay (cliquable pour fermer) */}
      {isOpen && <div className="wallet-overlay" onClick={toggleSidebar}></div>}

      {/* Barre latérale */}
      <div className={`wallet-bar ${isOpen ? "open" : ""}`} id="wallet-bar">
        <div className="wallet-bar-header">
          <h2>Recent Students</h2>
          <button className="btn-close" onClick={toggleSidebar}>
            ✕
          </button>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card bg-transparent mb-1">
              <div className="card-header border-0 px-3">
                <div>
                  <h2 className="heading mb-0">Recent Students</h2>
                  <span>
                    You have <span className="font-w600">456</span> Students
                  </span>
                </div>
                <div>
                  <Link
                    to={"#"}
                    className="add icon-box bg-primary"
                    onClick={() => childRef.current.openModal()}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.188 13.412V8.512H0.428V5.348H5.188V0.531999H8.352V5.348H13.14V8.512H8.352V13.412H5.188Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="card-body height450 dlab-scroll loadmore-content recent-activity-wrapper p-3 pt-2">
                {addList.map((item, ind) => (
                  <div className="d-flex align-items-center student" key={ind}>
                    <span className="dz-media">
                      <img src={item.image} alt="" width="50" className="avatar" />
                    </span>
                    <div className="user-info">
                      <h6 className="name">
                        <Link to={"/app-profile"}>{item.title}</Link>
                      </h6>
                      <span className="fs-14 font-w400 text-wrap">{item.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-footer text-center border-0 pt-0 px-3 pb-0">
                <Link
                  to={"#"}
                  className="btn btn-block btn-primary light btn-rounded dlab-load-more"
                  onClick={AddMoreData}
                >
                  View More {load && <i className="fa fa-refresh"></i>}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton pour ouvrir la barre */}
      <button className="open-wallet-btn" onClick={toggleSidebar}>
        Ouvrir WalletBar
      </button>

      <BasicModal ref={childRef} />
    </>
  );
};

export default WalletBar;
