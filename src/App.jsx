// App.jsx
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./dashboard/components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationPage from "./pages/NotificationPage";
import ProfileSection from "./pages/ProfileSection";
import LoginPage from "./pages/LoginPage";
import Industrialsofferings from "./pages/IndustrialsOfferings";
import IndustrailMachines from './pages/IndustrialMachines';
import RawMatrials from './pages/RawMatrials';
import SpareParts from './pages/SpareParts';
import ProfileCreation from "./pages/ProfileCreation";
import AddIndustrialService from "./dashboard/components/services/AddIndustrialService";
import IndustrialMachinesOffering from "./dashboard/components/services/machines/IndustrialMachinedOfferings";
import SparePartsOffering from "./dashboard/components/services/machines/SpareParts";
import RawMaterial from "./dashboard/components/services/machines/RawMaterial";
import IndustrialMachineDetails from "./pages/IndustrialMachineDetails";
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const noSidebarPaths = ["/", "/profileCreation"];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <div className="flex-1 relative">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/profileCreation" element={<ProfileCreation />} />
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/dashboard/services" element={<ProductsPage />} />
          <Route path="/dashboard/addIndustrialService" element={<AddIndustrialService />} />
          <Route path="/dashboard/addservices/industrial-machines" element={<IndustrialMachinesOffering />} />
          <Route path="/dashboard/addservices/spare-parts" element={<SparePartsOffering />} />
          <Route path="/dashboard/addservices/raw-material" element={<RawMaterial />} />
          <Route path="/dashboard/sales" element={<SalesPage />} />
          <Route path="/dashboard/profile" element={<ProfileSection />} />
          <Route path="/dashboard/notifications" element={<NotificationPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/services/industrials-offering" element={<Industrialsofferings />} />
          <Route path="/dashboard/services/marketplace/industrial-machines" element={<IndustrailMachines />} />
          <Route path="/dashboard/services/marketplace/raw-materials" element={<RawMatrials />} />
          <Route path="/dashboard/services/marketplace/spare-parts" element={<SpareParts />} />

          {/* New Route for Machine Details */}
          <Route path="/dashboard/services/marketplace/industrial-machines/:id" element={<IndustrialMachineDetails />} />
        </Routes>

        {/* Insert Toaster here */}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
}

export default App;
