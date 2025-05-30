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










    const handleDeletePortfolio = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/portfolios/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                console.log(`Portfolio s ID ${id} bylo smazáno.`);
                // Po úspěšném smazání aktualizujeme seznam portfolií
                //setPortfolios(portfolios.filter(portfolio => portfolio.id !== id));
            } else {
                console.error('Chyba při mazání portfolia:', response.status);
            }
        } catch (error) {
            console.error('Došlo k chybě při mazání:', error);
        }
    };

    const handleaddPortfolio = async () => {
        try {

        }catch (err: any) {
            console.error(err.message);
        }
    };

    const handleCheckPrices = async () => {
      try {


      }catch (err: any) {
          console.error(err.message);
      }
    };


    return (
        <div>
            <nav>
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
            </nav>


            <div className="welcome">
                <h1>Dashboard</h1>
                <p>Welcome to the dashboard!</p>
                <button onClick={handleaddPortfolio}>Add portfolio</button>
                <h2>Your Portfolios</h2>
            </div>


            {portfolios.map((portfolio: any) => (
                <div className="portfolio" key={portfolio.id}>
                    <h3>{portfolio.name}</h3>


                    <div className="deleteButton">
                        <button onClick={() => handleDeletePortfolio(portfolio.id)}>Delete</button>
                    </div>
                </div>

            ))}

        </div>
    );
};
export default Dashboard;