import { Link } from "@remix-run/react";
export default function Index() {
    return (
        <main id="welcome">
            
            <center><img  id="logo" src="favicon.ico" alt="logo" width="400px" height="400px" />
            <p id="index-page"> BASE HOSPITAL LIMITED<br />
                
                <Link to="/">  </Link>
            </p>
            </center>
        </main>
    );
}