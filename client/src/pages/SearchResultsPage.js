import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchSearchResults } from "../http/FurnitureAPI";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        setLoading(true);
        fetchSearchResults(query)
            .then(data => setResults(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="container">
            <h2>Результаты поиска по запросу: "{query}"</h2>
            {loading ? (
                <p>Загрузка...</p>
            ) : results.length > 0 ? (
                <div className="search-grid">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>Ничего не найдено.</p>
            )}
        </div>
    );
};

export default SearchResultsPage;
