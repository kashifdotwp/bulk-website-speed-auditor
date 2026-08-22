import React, { useState, useMemo } from 'react';
import { Globe, MapPin, Users, Search, ArrowRight, Building, Sparkles, Filter, Check, Copy } from 'lucide-react';
import { TIER1_GEOGRAPHY } from '../data/geographyData';
import { LOCAL_BUSINESS_NICHES } from '../data/nichesData';

export default function GeographyView({ onSelectLocationForSerp }) {
  const [selectedCountry, setSelectedCountry] = useState('us'); // 'us' | 'uk' | 'canada' | 'australia'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNicheQuery, setSelectedNicheQuery] = useState('Roofing Contractor');
  const [copiedCity, setCopiedCity] = useState(null);

  const countryData = TIER1_GEOGRAPHY[selectedCountry] || TIER1_GEOGRAPHY.us;

  // Filter states and cities based on search
  const filteredStates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return countryData.states;

    return countryData.states.filter(state => {
      const matchStateName = state.name.toLowerCase().includes(q);
      const matchCode = state.code.toLowerCase().includes(q);
      const matchCity = state.topCities.some(city => city.name.toLowerCase().includes(q));
      return matchStateName || matchCode || matchCity;
    });
  }, [countryData, searchQuery]);

  const handleLaunchSerpForCity = (cityName, stateCode) => {
    const combinedQuery = `${selectedNicheQuery} ${cityName} ${stateCode}`.trim();
    if (onSelectLocationForSerp) {
      onSelectLocationForSerp(combinedQuery, countryData.countryCode);
    }
  };

  const handleCopyLocation = (cityName, stateCode) => {
    const text = `${selectedNicheQuery} ${cityName} ${stateCode}`.trim();
    navigator.clipboard.writeText(text);
    setCopiedCity(text);
    setTimeout(() => setCopiedCity(null), 1800);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.25rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(2, 132, 199, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <Globe size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              🌍 Tier-1 Geography & Population Directory
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Complete market targeting database for USA, UK, Canada & Australia with recent population statistics and top commercial metro hubs.
            </p>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL TIER-1 POPULATION</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>~470 Million</div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>COVERED REGIONS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>85+ States / Provinces</div>
          </div>
        </div>
      </div>

      {/* Country Switcher Navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.65rem',
        marginBottom: '1.25rem'
      }}>
        {Object.entries(TIER1_GEOGRAPHY).map(([key, country]) => {
          const isSelected = selectedCountry === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => { setSelectedCountry(key); setSearchQuery(''); }}
              style={{
                background: isSelected ? 'var(--bg-card)' : 'var(--bg-primary)',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{country.flag}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {country.countryName}
                  </span>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Pop: <strong>{country.totalPopulation}</strong> • {country.states.length} {key === 'uk' ? 'Regions' : 'States/Prov.'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Toolbar: Quick Niche Combo + Search Filter */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        {/* Quick Niche Query Selector for 1-Click Launch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            🎯 Target Niche for 1-Click Discovery:
          </span>
          <select
            className="filter-select"
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.75rem', minWidth: '220px' }}
            value={selectedNicheQuery}
            onChange={e => setSelectedNicheQuery(e.target.value)}
          >
            {LOCAL_BUSINESS_NICHES.slice(0, 30).map(n => (
              <option key={n.id} value={n.keywords[0]}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        {/* State/City Search Box */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="search-input"
            style={{ width: '100%', paddingLeft: '2.1rem', fontSize: '0.825rem' }}
            placeholder={`Search ${countryData.countryName} states, provinces, or cities...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Showing count */}
      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
        Showing <strong>{filteredStates.length}</strong> {selectedCountry === 'uk' ? 'regions' : 'states/provinces'} in {countryData.countryName}:
      </div>

      {/* States & Cities Accordion / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredStates.map(state => (
          <div
            key={state.code}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            {/* State Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="badge badge-indigo" style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                  {state.code}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {state.name}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  <Users size={12} style={{ marginRight: '4px' }} /> Population: {state.population}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({state.topCities.length} key commercial cities)
                </span>
              </div>
            </div>

            {/* Cities Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.65rem'
            }}>
              {state.topCities.map((city, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                      <Building size={13} color="var(--accent-primary)" />
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {city.name}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Pop: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{city.population}</span> • {city.tier}
                    </div>
                  </div>

                  {/* 3 Action Icon Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {/* 1. Copy Search Query Button */}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        padding: '0.35rem',
                        fontSize: '0.75rem',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onClick={() => handleCopyLocation(city.name, state.code)}
                      title={`Copy Search Query: "${selectedNicheQuery} ${city.name} ${state.code}"`}
                    >
                      {copiedCity === `${selectedNicheQuery} ${city.name} ${state.code}` ? (
                        <Check size={13} color="var(--status-good)" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>

                    {/* 2. Open in Google Search New Tab */}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        padding: '0.35rem',
                        fontSize: '0.75rem',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onClick={() => {
                        const q = `${selectedNicheQuery} ${city.name} ${state.code}`;
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
                      }}
                      title={`Open Google Search in New Tab: "${selectedNicheQuery} ${city.name} ${state.code}"`}
                    >
                      <ExternalLink size={13} />
                    </button>

                    {/* 3. Prospect in App SERP Lead Finder */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        padding: '0.35rem',
                        fontSize: '0.75rem',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onClick={() => handleLaunchSerpForCity(city.name, state.code)}
                      title={`Prospect in SERP Lead Finder: "${selectedNicheQuery} ${city.name} ${state.code}"`}
                    >
                      <Search size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
