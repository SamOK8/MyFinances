import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
//import {c} from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

const Dashboard = () => {
    const [portfolios, setPortfolios] = useState<[]>([]);


    useEffect(() => {
        async function fetchPortfolioData() {

            try {

                const response = await fetch("http://localhost:8080/api/portfolio/by-user", {

                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })

                //.then((response) => {
                console.log("Response status:", response.status);
                const data = await response.json();
                //console.log(data);

                //const data = await response.json();

                //setPortfolios(response.json())
                // });


                setPortfolios(data);
                console.log(portfolios);


            } catch (err: any) {
                console.error(err.message);
            }
        }
        fetchPortfolioData()
    }, []);



    return (
        <div>
            <nav>
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
            </nav>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
        </div>
    );
};
export default Dashboard;