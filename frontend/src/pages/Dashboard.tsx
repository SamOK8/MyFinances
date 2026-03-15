import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
// import '.src/App.css';

interface Portfolio {
    id?: number;
    name?: string;
    user?: User;
    assets?: Asset[];
    value?: number;
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
    error?: string;
}

const Dashboard = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [portfolio, setPortfolio] = useState<Portfolio>();
    // const [selectedAsset, setSelectedAsset] = useState<string>('stock');
    const [isVisible, setIsVisible] = useState(false);
    const [, setError] = useState<string>("");
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
    const [userNetWorth, setUserNetWorth] = useState(0);
    //, setUserNetWorth




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

    // const handleEditPortfolio = async (id: number) => {
    //
    // }



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
            <div key={i} className="asset-input-box">
                <div className="input-row">
                    <input type="text" placeholder="Asset Name (e.g. Bitcoin)" name="assetName" required onChange={(e) => {
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
                    <input type="number" placeholder="Quantity" min={0} step="any" name="assetQuantity" required onChange={(e) => {
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
                </div>
                <div className="input-row">
                    <input type="text" placeholder="Symbol (e.g. BTC)" name="assetSymbol" required onChange={(e) => {
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
                    <select
                        id="assetType"
                        name="assetType"
                        onChange={e => handleAssetTypeChange(i, e.target.value)}>
                        <option value="stock">Stock</option>
                        <option value="crypto">Crypto</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const total = portfolios.reduce(
            (sum: number, portfolio: any) => sum + portfolio.value,
            0
        );
        setUserNetWorth(total);
    }, [portfolios]);


    return (
        <div className="app-container">
            <nav>
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
            </nav>

            <div className="header-stats">
                <div className="net-worth-box">
                    Net Worth: <span>${userNetWorth.toFixed(2)}</span>
                </div>
                <div className="welcome">
                    <h1>Dashboard</h1>
                    <p>Welcome to your portfolio manager!</p>
                </div>
            </div>

            <div className="controls">
                {/* Hide 'Add Portfolio' button when form is open */}
                {!isVisible && (
                    <button onClick={openForm} className="primary-btn">Add Portfolio</button>
                )}
            </div>

            {isVisible && (
                <div className="form-container">
                    <div className="form-header">
                        <h2>Create New Portfolio</h2>
                        {/* Cancel button to close form */}
                        <button type="button" onClick={() => setIsVisible(false)} className="cancel-btn">Cancel</button>
                    </div>

                    <form onSubmit={handleAddPortfolio} className="add-portfolio-form">
                        <input
                            type="text"
                            placeholder="Portfolio Name"
                            name="portfolioName"
                            required
                            onChange={(e) => {
                                setPortfolio(prev => ({ ...(prev ?? { assets: [] }), name: e.target.value }));
                            }}
                        />
                        <button type="button" onClick={addAsset} className="secondary-btn">+ Add Asset</button>
                        <button type="submit" className="success-btn">Save Portfolio</button>
                    </form>

                    <div className="asset-forms-container">
                        {portfolio?.assets?.map((asset, i) => (
                            assetForm(asset, i)
                        ))}
                    </div>
                </div>
            )}
            <h2>Your Portfolios</h2>

            {/* DASHBOARD GRID */}
            <div className="dashboard-grid">
                {portfolios.map((portfolio: any) => (
                    <div className="portfolio-box" key={portfolio.id}>

                        <div className="portfolio-header">
                            <h3>{portfolio.name}</h3>
                            <span className="portfolio-total">Total Value: ${portfolio.value.toFixed(2)}</span>
                        </div>

                        {/* ASSET LIST (Scrollable if 5+ assets) */}
                        <div className="asset-list">
                            {(portfolio.assets || []).map((asset: Asset, index: number) => (
                                <div key={asset.id || index} className="asset-block">
                                    <div className="asset-name">
                                        {asset.name} <span className="symbol">({asset.symbol})</span>
                                    </div>

                                    {asset.error === 'INVALID_SYMBOL' ? (
                                        <div className="error-text">Invalid Symbol</div>
                                    ) : asset.error ? (
                                        <div className="warning-text">Price unavailable</div>
                                    ) : (
                                        <div className="asset-details-grid">
                                            <div className="asset-detail"><span className="label">Type:</span> {asset.type}</div>
                                            <div className="asset-detail"><span className="label">Qty:</span> {asset.quantity}</div>
                                            <div className="asset-detail"><span className="label">Price:</span> ${asset.currentPrice?.toFixed(2)}</div>
                                            <div className="asset-detail value-highlight"><span className="label">Value:</span> ${( (asset.currentPrice ?? 0) * (asset.quantity ?? 0) ).toFixed(2)}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="portfolio-actions">
                            <button className="delete-btn" onClick={() => handleDeletePortfolio(portfolio.id)}>Delete Portfolio</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Dashboard;
