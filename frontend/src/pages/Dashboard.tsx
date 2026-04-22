import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
    const navigate = useNavigate();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [portfolio, setPortfolio] = useState<Portfolio>();
    // const [selectedAsset, setSelectedAsset] = useState<string>('stock');
    const [isVisible, setIsVisible] = useState(false);
    const [, setError] = useState<string>("");
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
    const [userNetWorth, setUserNetWorth] = useState(0);
    //, setUserNetWorth




    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

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

            if (response.status === 401 || response.status === 403) {
                handleLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            setPortfolios(data);
            console.log(portfolios);
            console.log(data);

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

            if (response.status === 401 || response.status === 403) {
                handleLogout();
                return;
            }

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

    const handleSavePortfolio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isEditing = !!portfolio?.id;
            const url = isEditing ? `${apiUrl}/api/portfolio/${portfolio.id}` : `${apiUrl}/api/portfolio/add`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(portfolio)
            });

            if (response.status === 401 || response.status === 403) {
                handleLogout();
                return;
            }

            if (response.ok) {
                fetchPortfolioData();
                setPortfolio(undefined);
                setIsVisible(false);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err: any) {
            console.error("Failed to save portfolio: " + err.message);
            setError("Failed to save portfolio");
        }

    };

    const handleEditClick = (p: Portfolio) => {
        // Deep copy assets to prevent mutating dashboard state directly before saving
        const pCopy = JSON.parse(JSON.stringify(p));
        setPortfolio(pCopy);
        setIsVisible(true);
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

    function openForm() {
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

    function assetForm(_asset: Asset, i: number) {
        return (
            <div key={i} className="asset-input-box">
                <div className="input-row">
                    <input type="text" placeholder="Asset Name (e.g. Bitcoin)" name="assetName" required
                        value={_asset.name || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPortfolio(prev => {
                                if (!prev) return prev;
                                const assets = prev.assets ? [...prev.assets] : [];
                                const a = assets[i] ? { ...assets[i] } : { name: '', quantity: 0, symbol: '', type: 'stock' };
                                a.name = value;
                                assets[i] = a;
                                return { ...prev, assets };
                            });
                        }} />
                    <input type="number" placeholder="Quantity" min={0} step="any" name="assetQuantity" required
                        value={_asset.quantity || ""}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value || '0');
                            setPortfolio(prev => {
                                if (!prev) return prev;
                                const assets = prev.assets ? [...prev.assets] : [];
                                const a = assets[i] ? { ...assets[i] } : { name: '', quantity: 0, symbol: '', type: 'stock' };
                                a.quantity = value;
                                assets[i] = a;
                                return { ...prev, assets };
                            });
                        }} />
                </div>
                <div className="input-row">
                    {_asset.type !== 'cash' && (
                        <input type="text" placeholder="Symbol (e.g. BTC)" name="assetSymbol" required
                            value={_asset.symbol || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPortfolio(prev => {
                                    if (!prev) return prev;
                                    const assets = prev.assets ? [...prev.assets] : [];
                                    const a = assets[i] ? { ...assets[i] } : { name: '', quantity: 0, symbol: '', type: 'stock' };
                                    a.symbol = value;
                                    assets[i] = a;
                                    return { ...prev, assets };
                                });
                            }} />
                    )}
                    <select
                        id="assetType"
                        name="assetType"
                        value={_asset.type || "stock"}
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


    const renderFormContent = () => (
        <>
            <div className="form-header">
                <h2>{portfolio?.id ? "Edit Portfolio" : "Create New Portfolio"}</h2>
                {/* Cancel button to close form */}
                <button type="button" onClick={() => setIsVisible(false)} className="cancel-btn">Cancel</button>
            </div>

            <form onSubmit={handleSavePortfolio} className="add-portfolio-form">
                <input
                    type="text"
                    placeholder="Portfolio Name"
                    name="portfolioName"
                    value={portfolio?.name || ""}
                    required
                    onChange={(e) => {
                        setPortfolio(prev => ({ ...(prev ?? { assets: [] }), name: e.target.value }));
                    }}
                />
                <button type="button" onClick={addAsset} className="secondary-btn">+ Add Asset</button>
                <button type="submit" className="success-btn">{portfolio?.id ? "Update Portfolio" : "Save Portfolio"}</button>
            </form>

            <div className="asset-forms-container">
                {portfolio?.assets?.map((asset, i) => (
                    assetForm(asset, i)
                ))}
            </div>
        </>
    );

    return (
        <div className="app-container">
            <nav>
                <button className="secondary-btn" onClick={handleLogout}>Logout</button>
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

            {isVisible ? (
                portfolio?.id ? (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="form-container" style={{
                            maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
                        }}>
                            {renderFormContent()}
                        </div>
                    </div>
                ) : (
                    <div className="form-container">
                        {renderFormContent()}
                    </div>
                )
            ) : null}
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
                                        {asset.name} {asset.type !== 'cash' && asset.symbol && <span className="symbol">({asset.symbol})</span>}
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
                                            <div className="asset-detail value-highlight"><span className="label">Value:</span> ${((asset.currentPrice ?? 0) * (asset.quantity ?? 0)).toFixed(2)}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="portfolio-actions">
                            <button className="primary-btn" onClick={() => handleEditClick(portfolio)} style={{ marginRight: '1rem' }}>Edit Portfolio</button>
                            <button className="delete-btn" onClick={() => handleDeletePortfolio(portfolio.id)}>Delete Portfolio</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Dashboard;
