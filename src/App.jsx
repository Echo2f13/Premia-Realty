import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import Breadcrumbs from "./components/Breadcrumbs";
import LoadingScreen from "./components/LoadingScreen";
import { ToastProvider } from "./components/Toast";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import ChangePassword from "./pages/ChangePassword";
import PropertyDetail from "./pages/PropertyDetail";
import Admin from "./pages/Admin";
import AdminPropertyPageAdd from "./pages/AdminPropertyPageAdd";
import AdminPropertyPageEdit from "./pages/AdminPropertyPageEdit";
import AdminPropertiesTrash from "./pages/AdminPropertiesTrash";
import AdminContacts from "./pages/AdminContacts";
import AdminContactsTrash from "./pages/AdminContactsTrash";
import RequireAdmin from "./components/RequireAdmin";

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/property/:id" element={<PropertyDetail />} />

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Minimum loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      <Router>
        <ScrollToTop />
        <LanguageProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col bg-background text-platinum-pearl">
              <AppContent />
              <BackToTop />
            </div>
          </ToastProvider>
        </LanguageProvider>
      </Router>
    </>
  );
};

export default App;
