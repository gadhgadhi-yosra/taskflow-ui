import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-card">
        <h2>Page introuvable</h2>
        <p>La page demandée n&apos;existe pas.</p>
        <Link to="/" className="btn primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
