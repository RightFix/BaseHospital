import { Link } from "@remix-run/react";

export default function Index() {
    return (
        <main id="welcome">
            <div className="hero-content">
                <img id="logo" src="/favicon.ico" alt="Base Hospital Logo" />
                <h1>BASE HOSPITAL LIMITED</h1>
                <p className="tagline">Quality Healthcare for All</p>
                
                <div className="hero-actions">
                    <Link to="/Patients" className="btn btn-primary">
                        View Patients
                    </Link>
                    <Link to="/appointments" className="btn btn-secondary">
                        Appointments
                    </Link>
                </div>

                <div className="hospital-info">
                    <div className="info-card">
                        <h3>Emergency</h3>
                        <p>24/7 Available</p>
                    </div>
                    <div className="info-card">
                        <h3>Location</h3>
                        <p>123 Health Ave</p>
                    </div>
                    <div className="info-card">
                        <h3>Contact</h3>
                        <p>+1 234 567 890</p>
                    </div>
                </div>
            </div>
        </main>
    );
}