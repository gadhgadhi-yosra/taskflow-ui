import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-card">
        <h1>TaskFlow</h1>
        <p>Organise tes projets, tâches et équipe avec une interface moderne.</p>
        <div className="landing-actions">
          <Link to="/login" className="btn primary">
            Se connecter
          </Link>
          <Link to="/signup" className="btn secondary">
            S&apos;inscrire
          </Link>
        </div>
        <Link to="/app" className="landing-link">
          Continuer vers le dashboard
        </Link>
      </div>
    </div>
  );
}
