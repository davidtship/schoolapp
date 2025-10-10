import React, { useState, useEffect } from "react";
import { Form, Table, Spinner } from "react-bootstrap";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const FEES_URL = API_BASE_URL+"/api/custom-fees/";
const CATEGORY_URL = API_BASE_URL+"/api/student-categorys/";
const CURRENCY_URL = API_BASE_URL+"/api/custom-currency-config/";

const FeesByOption = () => {
  const [fees, setFees] = useState([]);
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredFees, setFilteredFees] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Charger les frais
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch(FEES_URL);
        const data = await res.json();
        setFees(data);

        // Extraire les options uniques
        const allOptions = {};
        data.forEach((fee) => {
          fee.option.forEach((opt) => {
            allOptions[opt.id] = opt;
          });
        });
        setOptions(Object.values(allOptions));
      } catch (err) {
        console.error("Erreur chargement frais :", err);
      }
    };
    fetchFees();
  }, []);

  // 🔹 Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_URL);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Charger la devise par défaut (CDF)
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await fetch(CURRENCY_URL);
        const data = await res.json();
        const defaultCurrency = data.find(
          (c) => c.is_default === true && c.is_active === true
        );
        if (defaultCurrency) {
          setExchangeRate(parseFloat(defaultCurrency.exchange_rate));
        }
      } catch (err) {
        console.error("Erreur chargement devise :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrency();
  }, []);

  // 🔹 Filtrer les frais selon l’option
  useEffect(() => {
    if (selectedOptionId) {
      const filtered = fees.filter((fee) =>
        fee.option.some((opt) => opt.id === selectedOptionId)
      );
      setFilteredFees(filtered);
    } else {
      setFilteredFees([]);
    }
  }, [selectedOptionId, fees]);

  // 🔹 Appliquer la réduction selon la catégorie
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId);
      setSelectedDiscount(category?.discount || 0);
    } else {
      setSelectedDiscount(0);
    }
  }, [selectedCategoryId, categories]);

  // 🔹 Calculs
  const getDiscountAmount = (fee) => {
    if (fee.category_fee.fee_type.is_discountable) {
      return (parseFloat(fee.amount) * selectedDiscount) / 100;
    }
    return 0;
  };

  const getNetAmount = (fee) => parseFloat(fee.amount) - getDiscountAmount(fee);

  const getAmountInCDF = (amount) => {
    if (!exchangeRate) return "…";
    return (parseFloat(amount) * exchangeRate).toFixed(0);
  };

  const totalBrut = filteredFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const totalDiscount = filteredFees.reduce((sum, f) => sum + getDiscountAmount(f), 0);
  const totalNet = filteredFees.reduce((sum, f) => sum + getNetAmount(f), 0);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Chargement...
      </div>
    );
  }

  return (
    <>
      {/* Sélection option */}
      <Form.Group className="mb-3">
        <div style={{ color: "#1b1c1c", fontWeight: "bold", fontSize: "1.5em" }}>
          <Form.Label>Sélectionner une option</Form.Label>
          <Form.Select
            value={selectedOptionId || ""}
            onChange={(e) =>
              setSelectedOptionId(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">-- Choisir une option --</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} ({opt.children_age})
              </option>
            ))}
          </Form.Select>
        </div>
      </Form.Group>

      {/* Sélection catégorie */}
      <Form.Group className="mb-3">
        <div style={{ color: "#1b1c1c", fontWeight: "bold", fontSize: "1.5em" }}>
          <Form.Label>Sélectionner une catégorie d’élève</Form.Label>
          <Form.Select
            value={selectedCategoryId || ""}
            onChange={(e) =>
              setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.designation} ({cat.code}) - Réduction: {cat.discount}%
              </option>
            ))}
          </Form.Select>
        </div>
      </Form.Group>

      {/* Tableau */}
      {selectedOptionId && (
        <Table
          striped
          bordered
          hover
          responsive
          className="mt-4 shadow-sm"
          style={{ fontSize: "1.2em" }}
        >
          <thead
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              textAlign: "center",
            }}
          >
            <tr>
              <th>Catégorie Frais</th>
              <th>Détail</th>
              <th>Montant (USD)</th>
              <th>Montant (CDF)</th>
              <th>Réduction</th>
              <th>Net à payer (USD)</th>
              <th>Net à payer (CDF)</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((f) => {
              const discount = getDiscountAmount(f);
              const net = getNetAmount(f);
              return (
                <tr key={f.id}>
                  <td>{f.category_fee.designation}</td>
                  <td>{f.category_fee.fee_type.name}</td>
                  <td className="text-end">{parseFloat(f.amount).toFixed(2)} $</td>
                  <td className="text-end">
                    {getAmountInCDF(f.amount)} FC
                  </td>
                  <td className="text-end">
                    {discount > 0
                      ? `-${discount.toFixed(2)} $ (${selectedDiscount}%)`
                      : "-"}
                  </td>
                  <td className="text-end">{net.toFixed(2)} $</td>
                  <td className="text-end">
                    {getAmountInCDF(net)} FC
                  </td>
                </tr>
              );
            })}

            {/* 🔹 Ligne TOTAL */}
            <tr
              style={{
                backgroundColor: "#dce9ff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <td colSpan={2}>TOTAL</td>
              <td className="text-end">{totalBrut.toFixed(2)} $</td>
              <td className="text-end">{getAmountInCDF(totalBrut)} FC</td>
              <td className="text-end">-{totalDiscount.toFixed(2)} $</td>
              <td className="text-end">{totalNet.toFixed(2)} $</td>
              <td className="text-end">{getAmountInCDF(totalNet)} FC</td>
            </tr>
          </tbody>
        </Table>
      )}
    </>
  );
};

export default FeesByOption;
