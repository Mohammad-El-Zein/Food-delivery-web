import React from "react";
import { useTranslation } from "react-i18next";
import "./DemoBanner.css";

const DemoBanner = () => {
  const { t } = useTranslation();
  return (
    <div className="demo-banner" role="note">
      {t("demoBanner.text")}
    </div>
  );
};

export default DemoBanner;
