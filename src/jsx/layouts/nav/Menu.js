import React from "react";

// Importation des icônes depuis MUI
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessIcon from "@mui/icons-material/Business";
import LayersIcon from "@mui/icons-material/Layers";
import TuneIcon from "@mui/icons-material/Tune";
import ClassIcon from "@mui/icons-material/Class";
import PaymentIcon from "@mui/icons-material/Payment";
import CategoryIcon from "@mui/icons-material/Category";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import HistoryIcon from "@mui/icons-material/History";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SettingsIcon from "@mui/icons-material/Settings";
import BackupIcon from "@mui/icons-material/Backup";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

// ✅ fonction helper pour rendre toutes les icônes blanches (style forcé)
const whiteIcon = (IconComponent) => (
  <IconComponent style={{ color: "white", fill: "white", opacity: 0.9 }} />
);

export const MenuList = [
  {
    title: "Dashboard",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(DashboardIcon),
    to: "dashboard",
  },
  {
    title: "Élèves",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(SchoolIcon),
    content: [
      { title: "Liste", to: "student", iconStyle: whiteIcon(ListAltIcon) },
      { title: "Détails", to: "#", iconStyle: whiteIcon(InfoIcon) },
      { title: "Affectations", to: "affectations", iconStyle: whiteIcon(AssignmentIndIcon) },
    ],
  },
  {
    title: "Structure",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(ApartmentIcon),
    content: [
      { title: "Directions", to: "directions", iconStyle: whiteIcon(BusinessIcon) },
      { title: "Sections", to: "sections", iconStyle: whiteIcon(LayersIcon) },
      { title: "Options", to: "options", iconStyle: whiteIcon(TuneIcon) },
      { title: "Classes", to: "classes", iconStyle: whiteIcon(ClassIcon) },
    ],
  },
  {
    title: "Payement",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(PaymentIcon),
    to: "payement",
  },
  {
    title: "Frais",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(CategoryIcon),
    content: [
      { title: "Type de frais", to: "type-frais", iconStyle: whiteIcon(CategoryIcon) },
      { title: "Catégorie frais", to: "categorie-frais", iconStyle: whiteIcon(LayersIcon) },
      { title: "Frais par option", to: "frais-par-options", iconStyle: whiteIcon(TuneIcon) },
      { title: "Terms", to: "terms", iconStyle: whiteIcon(PriceChangeIcon) },
    ],
  },
  {
    title: "Recouvrement",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(MonetizationOnIcon),
    to: "chart-chartjs",
  },
  {
    title: "Rapports",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(BarChartIcon),
    content: [
      { title: "RechartJs", to: "chart-rechart", iconStyle: whiteIcon(ShowChartIcon) },
      { title: "Chartjs", to: "chart-chartjs", iconStyle: whiteIcon(InsertChartIcon) },
      { title: "Sparkline", to: "chart-sparkline", iconStyle: whiteIcon(TimelineIcon) },
      { title: "Apexchart", to: "chart-apexchart", iconStyle: whiteIcon(StackedLineChartIcon) },
    ],
  },
  {
    title: "Transfert élèves",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(CompareArrowsIcon),
    content: [
      { title: "Historique transferts", to: "#", iconStyle: whiteIcon(HistoryIcon) },
      { title: "Nouveau transfert", to: "#", iconStyle: whiteIcon(PersonAddAlt1Icon) },
    ],
  },
  {
    title: "Paramètres",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(SettingsIcon),
    content: [
      { title: "Backup", to: "uc-select2", iconStyle: whiteIcon(BackupIcon) },
      { title: "Année scolaire", to: "uc-sweetalert", iconStyle: whiteIcon(CalendarMonthIcon) },
      { title: "Monnaie", to: "monaie", iconStyle: whiteIcon(CurrencyExchangeIcon) },
      { title: "Configuration monnaie", to: "config-monaie", iconStyle: whiteIcon(AttachMoneyIcon) },
      { title: "Configuration scolaire", to: "configSchool", iconStyle: whiteIcon(SchoolIcon) },
    ],
  },
  {
    title: "Utilisateurs",
    classsChange: "mm-collapse",
    iconStyle: whiteIcon(PeopleIcon),
    content: [
      { title: "Liste utilisateurs", to: "form-element", iconStyle: whiteIcon(PersonIcon) },
    ],
  },
];
