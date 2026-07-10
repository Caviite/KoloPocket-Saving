// ContributorsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    FaSearch,
    FaUser,
    FaSpinner,
    FaArrowRight,
    FaExclamationTriangle,
    FaUsers,
    FaUserPlus,
} from "react-icons/fa";
import { privateInstance } from "../api/api";
import "./Contributor.css";

const ContributorsPage = () => {
    // ─── State ──────────────────────────────────────────────────────────────
    const [contributors, setContributors] = useState([]);
    const [filteredContributors, setFilteredContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Data Fetching ──────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAlajoContributors = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch all groups created by the logged-in Alajo
                const response = await privateInstance.get("/creategroup/getMyGroups");

                let groups = [];
                if (Array.isArray(response.data)) {
                    groups = response.data;
                } else if (response.data?.groups && Array.isArray(response.data.groups)) {
                    groups = response.data.groups;
                }

                // 2. Extract nested contributors out of those specific groups
                const uniqueContributorsMap = new Map();

                groups.forEach((group) => {
                    if (group.contributors && Array.isArray(group.contributors)) {
                        group.contributors.forEach((contributor) => {
                            // Ensure the contributor object exists and has a valid ID or Email
                            const identityKey = contributor._id || contributor.id || contributor.email;
                            if (identityKey) {
                                // Map stores them uniquely so duplicates across multiple groups don't show up twice
                                uniqueContributorsMap.set(identityKey, contributor);
                            }
                        });
                    }
                });

                // Convert map values back into a clean flat array
                const distinctContributors = Array.from(uniqueContributorsMap.values());

                setContributors(distinctContributors);
                setFilteredContributors(distinctContributors);
            } catch (err) {
                console.error("Failed to fetch specific Alajo contributors:", err);
                setError(err.message || "Unable to load your group contributors. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlajoContributors();
    }, []);

    // ─── Client-Side Search (memoized) ────────────────────────────────────
    const filterContributors = useCallback(
        (query, list) => {
            if (!query.trim()) return list;
            const lowerQuery = query.toLowerCase().trim();
            return list.filter((contributor) => {
                const fullName = (contributor.name || "").toLowerCase();
                const email = (contributor.email || "").toLowerCase();
                const phone = (contributor.phoneNumber || contributor.phone || "").toLowerCase();
                return fullName.includes(lowerQuery) || email.includes(lowerQuery) || phone.includes(lowerQuery);
            });
        },
        []
    );

    useEffect(() => {
        setFilteredContributors(filterContributors(searchQuery, contributors));
    }, [searchQuery, contributors, filterContributors]);

    // ─── Helpers ────────────────────────────────────────────────────────────
    const getInitials = (contributor) => {
        const nameParts = (contributor.name || "").trim().split(" ");
        if (nameParts.length >= 2) {
            return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
        }
        return `${nameParts[0]?.charAt(0) || "?"}`.toUpperCase();
    };

    const getAvatarColor = (email) => {
        let hash = 0;
        const fallbackStr = email || "default_hash_value";
        for (let i = 0; i < fallbackStr.length; i++) {
            hash = fallbackStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 65%, 75%)`;
    };

    // ─── Render: Loading ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="contributors-page">
                <div className="contributors-loading">
                    <FaSpinner className="spinner-icon" />
                    <p>Loading your group contributors…</p>
                </div>
            </div>
        );
    }

    // ─── Render: Error ──────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="contributors-page">
                <div className="contributors-error">
                    <FaExclamationTriangle className="error-icon" />
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ─── Render: Empty ──────────────────────────────────────────────────────
    if (contributors.length === 0) {
        return (
            <div className="contributors-page">
                <div className="contributors-empty">
                    <FaUsers className="empty-icon" />
                    <h3>No contributors assigned</h3>
                    <p className="text-secondary">
                        Contributors will show up here once you create an Ajo Group and assign them to it.
                    </p>
                </div>
            </div>
        );
    }

    // ─── Render: Main Grid ──────────────────────────────────────────────────
    const hasSearchResults = filteredContributors.length > 0;

    return (
        <div className="contributors-page">
            {/* Header */}
            <div className="contributors-header">
                <h1 className="page-title">My Beneficiaries</h1>
                <p className="text-secondary page-subtitle">
                    {contributors.length} unique contributor{contributors.length !== 1 ? "s" : ""} across your active groups
                </p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-wrapper">
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search contributors by name, email, or phone…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search contributors"
                    />
                    {searchQuery && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Results status */}
            {searchQuery && (
                <div className="search-status text-secondary">
                    {hasSearchResults
                        ? `Showing ${filteredContributors.length} of ${contributors.length}`
                        : "No contributors match your search"}
                </div>
            )}

            {/* Grid */}
            {hasSearchResults ? (
                <div className="contributors-grid">
                    {filteredContributors.map((contributor, index) => {
                        const initials = getInitials(contributor);
                        const avatarColor = getAvatarColor(contributor.email || contributor.name || `${index}`);
                        const fullName = contributor.name || "Unnamed Contributor";

                        return (
                            <div key={contributor._id || contributor.id || index} className="contributor-card">
                                <div className="card-avatar" style={{ backgroundColor: avatarColor, color: '#1e293b', fontWeight: 'bold' }}>
                                    {initials}
                                </div>
                                <div className="card-body">
                                    <h4 className="card-name">{fullName}</h4>
                                    <p className="card-email text-secondary">{contributor.email || "No email linked"}</p>
                                    {contributor.phoneNumber && (
                                        <p className="card-phone text-secondary" style={{ fontSize: '12px', marginTop: '2px' }}>
                                            {contributor.phoneNumber}
                                        </p>
                                    )}
                                </div>
                                <div className="card-action">
                                    <button className="action-button">
                                        View Activity <FaArrowRight className="action-icon" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="contributors-empty search-empty">
                    <FaUser className="empty-icon" />
                    <h4>No results found</h4>
                    <p className="text-secondary">Try adjusting your search filters</p>
                </div>
            )}
        </div>
    );
};

export default ContributorsPage;