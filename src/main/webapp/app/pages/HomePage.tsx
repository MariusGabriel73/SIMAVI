import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Bine ați venit la Clinica Medicală</h1>
        <p className="text-muted mb-0">Alegeți rolul pentru a continua</p>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-12 col-md-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div style={{ fontSize: 40 }}>👤</div>
              <h5 className="card-title mt-3">Pacient</h5>
              <p className="card-text text-muted">Accesează opțiunile disponibile pentru pacienți.</p>
              <button className="btn btn-primary" onClick={() => navigate('/pacient')}>
                Pagina Pacientului
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div style={{ fontSize: 40 }}>🩺</div>
              <h5 className="card-title mt-3">Medic</h5>
              <p className="card-text text-muted">Intră în zona dedicată medicilor.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/medic')}>
                Pagina Medicilor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
