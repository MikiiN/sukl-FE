import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Léčiva', end: true },
  { to: '/substances', label: 'Látky' },
  { to: '/pharmacies', label: 'Lékárny' },
  { to: '/disruptions', label: 'Výpadky' },
  { to: '/atc', label: 'ATC' },
  { to: '/prescriptions', label: 'Preskripce' },
  { to: '/organizations', label: 'Organizace' },
  { to: '/registration-changes', label: 'Reg. změny' },
  { to: '/statistics', label: 'Statistiky' },
];

export const NavBar = () => (
  <nav className="navbar">
    <div className="navbar-inner">
      <span className="navbar-brand">SÚKL</span>
      <div className="navbar-links">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);
