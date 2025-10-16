import { BrowserRouter as Router, Route, Routes, useLocation, Link, useNavigate } from "react-router-dom";
import PillNav from "./components/PillNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import AdminPropertyPageAdd from "./pages/AdminPropertyPageAdd";
import AdminPropertyPageEdit from "./pages/AdminPropertyPageEdit";
import AdminPropertiesTrash from "./pages/AdminPropertiesTrash";
import AdminContacts from "./pages/AdminContacts";
import AdminContactsTrash from "./pages/AdminContactsTrash";
import RequireAdmin from "./components/RequireAdmin";
import useAuth from "./hooks/useAuth";
import { signOutCustomer } from "./data/firebaseService";
import { User, LogIn, ShieldCheck } from "lucide-react";

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutCustomer();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const authButton = isAuthenticated ? (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {isAdmin && (
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '42px',
            padding: '0 18px',
            background: 'linear-gradient(135deg, #f5d37f 0%, #d4af37 100%)',
            color: '#121218',
            textDecoration: 'none',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.3)';
          }}
        >
          <ShieldCheck size={16} />
          Admin
        </Link>
      )}
      <Link
        to="/account"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '42px',
          padding: '0 18px',
          background: 'rgba(212, 175, 55, 0.06)',
          color: '#d4af37',
          textDecoration: 'none',
          borderRadius: '9999px',
          fontWeight: '600',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 0 1px rgba(212, 175, 55, 0.12) inset',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212, 175, 55, 0.3) inset';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.06)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212, 175, 55, 0.12) inset';
        }}
      >
        <User size={16} />
        Account
      </Link>
      <button
        onClick={handleLogout}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '42px',
          padding: '0 18px',
          background: 'rgba(212, 175, 55, 0.06)',
          color: '#d4af37',
          border: 'none',
          borderRadius: '9999px',
          fontWeight: '600',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 0 1px rgba(212, 175, 55, 0.12) inset'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212, 175, 55, 0.3) inset';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.06)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212, 175, 55, 0.12) inset';
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Link
        to="/login"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '42px',
          padding: '0 18px',
          background: 'rgba(212, 175, 55, 0.06)',
          color: '#d4af37',
          textDecoration: 'none',
          borderRadius: '9999px',
          fontWeight: '600',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 0 1px rgba(212, 175, 55, 0.12) inset',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212, 175, 55, 0.3) inset';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.06)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212, 175, 55, 0.12) inset';
        }}
      >
        <LogIn size={16} />
        Login
      </Link>
      <Link
        to="/signup"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '42px',
          padding: '0 18px',
          background: 'linear-gradient(135deg, #f5d37f 0%, #d4af37 100%)',
          color: '#121218',
          textDecoration: 'none',
          borderRadius: '9999px',
          fontWeight: '700',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.3)';
        }}
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <>
      <PillNav
        logo="/logo.png"
        logoAlt="Premia Realty"
        items={navItems}
        activeHref={location.pathname}
        baseColor="rgba(18, 18, 24, 0.85)"
        pillColor="rgba(212, 175, 55, 0.08)"
        hoveredPillTextColor="#121218"
        pillTextColor="#d4af37"
        authButton={authButton}
      />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/admin/trash" element={<RequireAdmin><AdminPropertiesTrash /></RequireAdmin>} />
          <Route path="/admin/contacts" element={<RequireAdmin><AdminContacts /></RequireAdmin>} />
          <Route path="/admin/contacts/trash" element={<RequireAdmin><AdminContactsTrash /></RequireAdmin>} />
          <Route path="/admin/properties/add" element={<RequireAdmin><AdminPropertyPageAdd /></RequireAdmin>} />
          <Route path="/admin/properties/edit/:propertyId" element={<RequireAdmin><AdminPropertyPageEdit /></RequireAdmin>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-background text-platinum-pearl">
        <AppContent />
      </div>
    </Router>
  );
};

export default App;
