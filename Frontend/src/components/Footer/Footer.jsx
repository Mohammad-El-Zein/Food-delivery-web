import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DEMO_RESTAURANT, DEVELOPERS } from "../../util/demoInfo";
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-grid">
          {/* Spalte 1: fiktives Restaurant */}
          <section className="site-footer-col">
            <h3>{t("footer.restaurantTitle")}</h3>
            <p className="site-footer-note">{t("footer.fictionalNote")}</p>
            <address>
              {DEMO_RESTAURANT.street}
              <br />
              {DEMO_RESTAURANT.city} {t("footer.fictionalSuffix")}
              <br />
              {t("footer.phoneLabel")}: {DEMO_RESTAURANT.phone}
              <br />
              {t("footer.emailLabel")}: {DEMO_RESTAURANT.email}
            </address>
            <p>
              <strong>{t("footer.hoursLabel")}:</strong> {t("footer.hours")}
            </p>
          </section>

          {/* Spalte 2: Entwickler */}
          <section className="site-footer-col">
            <h3>{t("footer.developedBy")}</h3>
            <ul className="site-footer-devs">
              {DEVELOPERS.map((dev) => (
                <li key={dev.key}>
                  <span className="site-footer-dev-name">
                    {t(`people.${dev.key}.name`)}
                  </span>
                  <span className="site-footer-dev-role">
                    {t(`people.${dev.key}.role`)}
                  </span>
                  <span className="site-footer-social">
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`people.${dev.key}.githubLabel`)}
                    >
                      <i className="bi-github" aria-hidden="true"></i>
                    </a>
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`people.${dev.key}.linkedinLabel`)}
                    >
                      <i className="bi-linkedin" aria-hidden="true"></i>
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Spalte 3: Über dieses Projekt */}
          <section className="site-footer-col">
            <h3>{t("footer.aboutTitle")}</h3>
            <p>{t("footer.aboutText")}</p>
          </section>
        </div>

        <div className="site-footer-bottom">
          <span>{t("footer.copyright", { year })}</span>
          <nav className="site-footer-legal" aria-label={t("footer.legalNav")}>
            <Link to="/impressum">{t("footer.imprint")}</Link>
            <Link to="/datenschutz">{t("footer.privacy")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
