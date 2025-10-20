import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

// Replace classes with interfaces and make fields optional to avoid definite-assignment errors
interface Portfolio {
    id?: number;
    name?: string;
    user?: User;
    assets?: Asset[];
}

interface User {
    id?: number;
    username?: string;
}

interface Asset {
    id?: number;
    name?: string;
    type?: string;
    quantity?: number;
    symbol?: string;
    currentPrice?: number;
}

const Dashboard = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [portfolio, setPortfolio] = useState<Portfolio>();
    // const [selectedAsset, setSelectedAsset] = useState<string>('stock');
    const [isVisible, setIsVisible] = useState(false);
    const [, setError] = useState<string>("");
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';




    async function fetchPortfolioData() {

        try {
            const response = await fetch(`${apiUrl}/api/portfolio/by-user`, {

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
            const response = await fetch(`${apiUrl}/api/portfolio/${id}`, {
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
            const response = await fetch(`${apiUrl}/api/portfolio/add`, {
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
        const newAsset: Asset = { type: "stock", name: "", quantity: 0, symbol: "" };
        setPortfolio(prev => {
            if (!prev) return prev;
            const updatedAssets = prev.assets ? [...prev.assets, newAsset] : [newAsset];
            return { ...prev, assets: updatedAssets };
        });
    }

    function openForm(){
        const newPortfolio: Portfolio = { assets: [] };
        setPortfolio(newPortfolio);
        setIsVisible(true);
    }

    function handleAssetTypeChange(index: number, value: string) {
        setPortfolio(prev => {
            if (!prev) return prev;
            const assets = prev.assets ? prev.assets.map((asset, i) => i === index ? { ...asset, type: value } : asset) : [];
            return { ...prev, assets };
        });
    }

    function assetForm(_asset: Asset, i: number){
        return (
            <form key={i}>
                <label></label>
                <input type="text" placeholder="Asset Name" name="assetName" required onChange={(e) => {
                    const value = e.target.value;
                    setPortfolio(prev => {
                        if (!prev) return prev;
                        const assets = prev.assets ? [...prev.assets] : [];
                        const a = assets[i] ? { ...assets[i] } : { name: '', quantity: 0, symbol: '', type: 'stock' };
                        a.name = value;
                        assets[i] = a;
                        return { ...prev, assets };
                    });
                }}/>
                <label></label>
                <input type="number" placeholder="quantity" min={0} name="assetQuantity" required onChange={(e) => {
                    const value = parseFloat(e.target.value || '0');
                    setPortfolio(prev => {
                        if (!prev) return prev;
                        const assets = prev.assets ? [...prev.assets] : [];
                        const a = assets[i] ? { ...assets[i] } : { name: '', quantity: 0, symbol: '', type: 'stock' };
                        a.quantity = value;
                        assets[i] = a;
                        return { ...prev, assets };
                    });
                }}/>
                <br/>
                <label>Official Ticker symbol: </label>
                <input type="text" placeholder="symbol" name="assetSymbol" required onChange={(e) => {
                    const value = e.target.value;
                    setPortfolio(prev => {
                        if (!prev) return prev;
                        const assets = prev.assets ? [...prev.assets] : [];
                        const a = assets[i] ? { ...assets[i] } : { name: '', quantity: 0, symbol: '', type: 'stock' };
                        a.symbol = value;
                        assets[i] = a;
                        return { ...prev, assets };
                    });
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
                                   setPortfolio(prev => ({ ...(prev ?? { assets: [] }), name: e.target.value }));
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
                <div className="box" key={portfolio.id}>
                    <h3>{portfolio.name}</h3>

                    { (portfolio.assets || []).map((asset: Asset) => (
                        <li key={asset.id} className="portfolioList">
                            <strong>{asset.name} ({asset.symbol})</strong>
                            <br />
                            Type: {asset.type}, Quantity: {asset.quantity}
                            {asset.currentPrice !== undefined && asset.currentPrice !== null && `, Current Price: $${asset.currentPrice.toFixed(2)}`}
                            <br />
                            value: ${( (asset.currentPrice ?? 0) * (asset.quantity ?? 0) ).toFixed(2)}
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
