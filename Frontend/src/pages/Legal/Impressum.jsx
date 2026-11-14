import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Todo from "./Todo";
import "./Legal.css";

const Impressum = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Impressum – Flavor Haus (Demo-Projekt)";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="legal-page" lang="de">
      <h1>Impressum</h1>

      <div className="legal-notice">
        <strong>Hinweis:</strong> „Flavor Haus“ ist ein <strong>fiktives Restaurant</strong>.
        Diese Website ist ein nicht-kommerzielles Demo- und Lernprojekt. Es werden keine
        Speisen verkauft oder geliefert, Zahlungen laufen ausschließlich im Stripe-Testmodus.
        Die auf der Website genannten Restaurantdaten (Adresse, Telefon, E-Mail,
        Öffnungszeiten) sind erfunden.
      </div>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <Todo>Vor- und Nachname</Todo>
        <br />
        <Todo>Straße und Hausnummer</Todo>
        <br />
        <Todo>PLZ und Ort</Todo>
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <Todo>E-Mail-Adresse</Todo>
        <br />
        <Todo>zweiter schneller Kontaktweg prüfen, z. B. Telefonnummer oder Kontaktformular</Todo>
      </p>

      <h2>Datenschutz</h2>
      <p>
        Informationen zur Verarbeitung personenbezogener Daten findest du in der{" "}
        <Link to="/datenschutz">Datenschutzerklärung</Link>.
      </p>
    </main>
  );
};

export default Impressum;
