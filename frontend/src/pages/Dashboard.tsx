import {Form, Link} from "react-router-dom";
import {useEffect, useState} from "react";

class Portfolio {
    id: number;
    name: string;
    user: User;
    assets: Asset[];
}

class User {
    id: number;
    username: string;
}

class Asset {
    id: number;
    name: string;
    type: string;
    quantity: number;
    symbol: string;
    currentPrice?: number;
}

const Dashboard = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [portfolio, setPortfolio] = useState<Portfolio>();
    // const [selectedAsset, setSelectedAsset] = useState<string>('stock');
    const [isVisible, setIsVisible] = useState(false);
    const[error, setError] = useState<string>("");





    async function fetchPortfolioData() {

        try {
            const response = await fetch("http://localhost:8080/api/portfolio/by-user", {

                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            const data = await response.json();

            setPortfolios(data);
            console.log(portfolios);
            console.log(data);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

        } catch (err: any) {
            console.error(err.message);
            setError("failed to load portfolios check internet connection");
        }
    }

    useEffect(() => {

        fetchPortfolioData()
    }, []);


    const handleDeletePortfolio = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/portfolio/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                setPortfolios(portfolios.filter(portfolio => portfolio.id !== id));

            } else {
                throw new Error(response.statusText);
            }
        } catch (err: any) {
            console.error("failed to delete portdolio: ", err.message);
            setError("failed to delete portdolio");
        }
    };

    const handleAddPortfolio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/portfolio/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(portfolio)
            });

            if (response.ok) {
                fetchPortfolioData();
                setPortfolio(undefined);
                setIsVisible(false);
            } else {
                throw new Error(response.statusText);
            }
        }catch (err: any) {
            console.error("Failed to add portfolio: " + err.message);
            setError("Failed to add portfolio");
        }

    };



    function addAsset() {
        if (!portfolio) return;
        const newAsset = new Asset();
        newAsset.type = "stock";
        const updatedAssets = portfolio.assets ? [...portfolio.assets, newAsset] : [newAsset];
        setPortfolio({ ...portfolio, assets: updatedAssets });
    }

    function openForm(){
        const newPortfolio = new Portfolio();
        newPortfolio.assets = [];
        setPortfolio(newPortfolio);
        setIsVisible(true);
    }

    function handleAssetTypeChange(index: number, value: string) {
        if (!portfolio) return;
        const updatedAssets = portfolio.assets.map((asset, i) =>
            i === index ? { ...asset, type: value } : asset
        );
        setPortfolio({ ...portfolio, assets: updatedAssets });
    }

    function assetForm(asset: Asset, i: number){
        return (
            <form key={i}>
                <label></label>
                <input type="text" placeholder="Asset Name" name="assetName" required onChange={(e) => {
                    portfolio.assets[i].name = e.target.value;
                }}/>
                <label></label>
                <input type="number" placeholder="quantity" min={0} name="assetQuantity" required onChange={(e) => {
                    portfolio.assets[i].quantity = parseFloat(e.target.value);
                }}/>
                <br/>
                <label>Official Ticker symbol: </label>
                <input type="text" placeholder="symbol" name="assetSymbol" required onChange={(e) => {
                    portfolio.assets[i].symbol = e.target.value;
                }}/>


                <br/>
                <label htmlFor="assetType">Choose asset type: </label>
                <select
                    id="assetType"
                    name="assetType"
                    onChange={e => handleAssetTypeChange(i, e.target.value)}>
                    <option value="stock">Stock</option>
                    <option value="crypto">Crypto</option>
                    <option value="cash">Cash</option>
                </select>
            </form>
        );
    }

    return (
        <div>
            <nav>
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
            </nav>


            <div className="welcome">
                <h1>Dashboard</h1>
                <p>Welcome to the dashboard!</p>
            </div>


            <button onClick={openForm}>Add portfolio</button>

            {isVisible && (<div>
                    <form onSubmit={handleAddPortfolio}>
                        <label></label>
                        <input type="text" placeholder="Portfolio Name" name="portfolioName" required
                               onChange={(e) => {
                                   const newPortfolio = portfolio;
                                   newPortfolio.name = e.target.value;
                                   setPortfolio(newPortfolio);
                               }}/>
                        <button type="submit">Apply</button>

                    </form>
                    <button onClick={addAsset}>Add asset</button>

                {portfolio?.assets?.map((asset, i) => (
                    assetForm(asset, i)
                ))}
            </div>
                )}


            <h2>Your Portfolios</h2>

            {portfolios.map((portfolio: any) => (
                <div className="portfolio" key={portfolio.id}>
                    <h3>{portfolio.name}</h3>








                    {portfolio.assets.map((asset: Asset) => (
                        <li key={asset.id}>
                            <strong>{asset.name} ({asset.symbol})</strong>
                            <br />
                            Type: {asset.type}, Quantity: {asset.quantity}
                            {asset.currentPrice !== undefined && asset.currentPrice !== null && `, Current Price: $${asset.currentPrice.toFixed(2)}`}
                            <br />
                            value: ${(asset.currentPrice) * (asset.quantity)}
                        </li>
                    ))}




                    <div className="deleteButton">
                        <button onClick={() => handleDeletePortfolio(portfolio.id)}>Delete</button>
                    </div>
                </div>

            ))}

        </div>
    );
};
export default Dashboard;