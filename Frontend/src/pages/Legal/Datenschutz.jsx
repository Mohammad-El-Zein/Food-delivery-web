import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Todo from "./Todo";
import "./Legal.css";

// ENTWURF: nur auf Basis dessen, was die App tatsächlich verarbeitet.
// Offene Punkte sind mit [TODO] markiert und müssen vor Veröffentlichung geprüft werden.
const Datenschutz = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Datenschutz – Flavor Haus (Demo-Projekt)";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="legal-page" lang="de">
      <h1>Datenschutzerklärung</h1>

      <div className="legal-draft">
        <strong>Entwurf:</strong> Dieser Text ist noch nicht rechtlich geprüft. Mit [TODO]
        markierte Stellen müssen ergänzt oder bestätigt werden.
      </div>

      <div className="legal-notice">
        „Flavor Haus“ ist ein <strong>fiktives Restaurant</strong> und diese Website ein
        nicht-kommerzielles Demo-Projekt. Es werden keine echten Bestellungen ausgeführt und
        keine echten Zahlungen abgewickelt.
      </div>

      <h2>1. Verantwortliche Stelle</h2>
      <p>
        <Todo>Vor- und Nachname</Todo>
        <br />
        <Todo>Anschrift</Todo>
        <br />
        E-Mail: <Todo>E-Mail-Adresse</Todo>
      </p>
      <p>
        Siehe auch das <Link to="/impressum">Impressum</Link>.
      </p>

      <h2>2. Hosting und Server</h2>
      <p>
        Die Website (Frontend) wird über <Todo>Hosting-Anbieter des Frontends bestätigen, z. B. Netlify</Todo>{" "}
        ausgeliefert. Die Programmierschnittstelle (Backend) läuft bei Railway{" "}
        <Todo>Region und Vertragspartner bestätigen</Todo>. Beim Aufruf der Seiten verarbeiten
        diese Anbieter technisch notwendige Verbindungsdaten wie die IP-Adresse.
      </p>
      <p>
        Das Backend schreibt Protokollmeldungen (Server-Logs) in die Konsole, die Railway
        aufzeichnet. Dazu gehören Startmeldungen und Fehlermeldungen, zum Beispiel wenn eine
        Anfrage an den KI-Dienst oder ein Bild-Upload fehlschlägt. Die App protokolliert dabei
        keine IP-Adressen und keine Inhalte von Konten oder Bestellungen; ein
        Zugriffsprotokoll ist im Backend nicht eingeschaltet.{" "}
        <Todo>prüfen, ob und wie lange Railway und der Frontend-Hoster eigene Zugriffsprotokolle (z. B. IP-Adresse, aufgerufene Adresse) speichern</Todo>
      </p>
      <p>
        Die Daten der App werden in einer MongoDB-Datenbank gespeichert.{" "}
        <Todo>Datenbank-Anbieter und Serverstandort, z. B. MongoDB Atlas, bestätigen</Todo>
      </p>

      <h2>3. Benutzerkonto</h2>
      <p>Bei der Registrierung speichern wir:</p>
      <ul>
        <li>Name</li>
        <li>E-Mail-Adresse</li>
        <li>Passwort, ausschließlich als verschlüsselter Hash (BCrypt), nicht im Klartext</li>
      </ul>
      <p>
        Zweck ist die Anmeldung sowie die Zuordnung von Warenkorb und Bestellungen zu deinem
        Konto. Name und E-Mail-Adresse kannst du im Profil ändern. Zum Warenkorb speichern wir
        die ausgewählten Gerichte und Mengen.
      </p>
      <p>
        Rechtsgrundlage: <Todo>prüfen, z. B. Art. 6 Abs. 1 lit. b DSGVO</Todo>
        <br />
        Speicherdauer: <Todo>Speicherdauer festlegen</Todo>
      </p>
      <p>
        Zur Löschung deines Kontos schreibe an <Todo>E-Mail-Adresse</Todo>.
      </p>

      <h2>4. Bestellungen</h2>
      <p>Wenn du eine (Test-)Bestellung aufgibst, speichern wir:</p>
      <ul>
        <li>E-Mail-Adresse und Telefonnummer</li>
        <li>Lieferadresse und Postleitzahl</li>
        <li>bestellte Gerichte, Mengen und Gesamtbetrag</li>
        <li>Bestell- und Zahlungsstatus, Zeitpunkt der Bestellung</li>
        <li>die Kennung der Stripe-Zahlungssitzung</li>
      </ul>
      <p>
        Vorname, Nachname, Land und Bundesland werden im Bestellformular abgefragt, aber nicht
        an den Server übertragen und nicht gespeichert. Bestellungen sind für dich unter „Meine
        Bestellungen“ und für die Administratoren dieser Demo im Admin-Bereich sichtbar.
      </p>
      <p>
        Rechtsgrundlage: <Todo>prüfen</Todo>
        <br />
        Speicherdauer: <Todo>Speicherdauer festlegen</Todo>
      </p>

      <h2>5. Zahlungen über Stripe (Testmodus)</h2>
      <p>
        Zum Bezahlen wirst du auf die Bezahlseite von Stripe weitergeleitet. Die Zahlungen
        laufen ausschließlich im <strong>Testmodus</strong>: Es wird kein echtes Geld bewegt,
        und es sollen keine echten Kartendaten eingegeben werden (Testkarte: 4242 4242 4242
        4242). Kartendaten gibst du direkt bei Stripe ein, sie werden nicht an uns
        übermittelt. Wir übergeben an Stripe die Bestellnummer und den Betrag und erhalten
        den Zahlungsstatus zurück.
      </p>
      <p>
        Anbieter: <Todo>Stripe-Vertragspartner, Datenschutzhinweise von Stripe und ggf. Drittlandübermittlung angeben</Todo>
      </p>

      <h2>6. KI-Kalorienschätzung</h2>
      <p>
        Wenn du die KI-Schätzung der Kalorien startest, senden wir den <strong>Namen des
        Gerichts</strong> und die von dir eingegebene <strong>Portionsgröße</strong> an einen
        KI-Dienst: zuerst an OpenAI, und falls dieser nicht antwortet, an Anthropic (Claude).
        Weitere Daten zu deiner Person werden dabei nicht mitgeschickt.
      </p>
      <p>
        Um Missbrauch zu verhindern, zählen wir die Anfragen pro IP-Adresse. Diese Zählung
        liegt nur im Arbeitsspeicher des Servers und wird spätestens nach einer Stunde
        verworfen.
      </p>
      <p>
        <Todo>Vertragspartner, Serverstandort und Drittlandübermittlung bei OpenAI und Anthropic angeben</Todo>
      </p>

      <h2>7. Lokaler Speicher im Browser und Cookies</h2>
      <p>Die App legt im lokalen Speicher deines Browsers ab:</p>
      <ul>
        <li>
          <code>token</code>: dein Anmelde-Token, solange du eingeloggt bist. Er ist 10 Stunden
          gültig und wird beim Abmelden gelöscht.
        </li>
        <li>
          <code>lang</code>: die gewählte Sprache der Website.
        </li>
      </ul>
      <p>
        Diese Einträge werden nur für die genannten Funktionen genutzt und nicht an Dritte
        weitergegeben; der Anmelde-Token wird bei Anfragen an unser Backend mitgeschickt.
        Die App selbst setzt keine Cookies (auch das Backend erzeugt keine Sitzungs-Cookies)
        und verwendet keine Analyse- oder Tracking-Dienste.{" "}
        <Todo>prüfen, welche Cookies Stripe auf seiner Bezahlseite setzt und ob der Frontend-Hoster Cookies setzt</Todo>
      </p>

      <h2>8. Schriftarten und Bilder</h2>
      <p>
        Die Schriftarten sind in die Website eingebunden und werden von unserem eigenen
        Server geladen. Es wird keine Verbindung zu Google Fonts oder anderen
        Schriftarten-Diensten aufgebaut.
      </p>
      <p>
        Die meisten Bilder von Gerichten sind direkt in die Website eingebunden. Für Gerichte,
        die im Admin-Bereich mit eigenem Bild angelegt werden, wird das Bild entweder bei
        Amazon Web Services (Speicherdienst S3, Region eu-north-1, Stockholm) oder in unserer
        Datenbank gespeichert. Liegt ein Bild bei S3, lädt dein Browser es direkt von den
        Servern von Amazon; dabei wird deine IP-Adresse an Amazon übermittelt.{" "}
        <Todo>prüfen, ob in der Datenbank aktuell Gerichte mit S3-Bildadresse gespeichert sind, und ggf. Anbieter (Amazon Web Services) und Rechtsgrundlage angeben</Todo>
      </p>

      <h2>9. Kontaktformular und Newsletter</h2>
      <p>
        Das Kontaktformular und das Newsletter-Formular sind reine Demo-Funktionen. Eingaben
        werden nicht an den Server gesendet und nicht gespeichert.
      </p>

      <h2>10. Links zu GitHub und LinkedIn</h2>
      <p>
        Im Footer verlinken wir auf die Profile des Entwicklers bei GitHub und LinkedIn. Erst
        wenn du einen Link anklickst, wird die jeweilige Seite geöffnet; dann gelten deren
        Datenschutzbestimmungen.
      </p>

      <h2>11. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung
        (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20)
        und Widerspruch (Art. 21). Außerdem kannst du dich bei einer
        Datenschutz-Aufsichtsbehörde beschweren.{" "}
        <Todo>zuständige Aufsichtsbehörde angeben</Todo>
      </p>

      <p>
        Stand: <Todo>Datum</Todo>
      </p>
    </main>
  );
};

export default Datenschutz;
