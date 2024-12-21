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
import IndustrailMachines from './pages/IndustrialMachines'
import RawMatrials from './pages/RawMatrials'
import SpareParts from './pages/SpareParts'
import ProfileCreation from "./pages/ProfileCreation";
import AddService from "./dashboard/components/services/AddService";


function App() {
	const location = useLocation();
	const noSidebarPaths = ["/", "/profileCreation"];
	const showSidebar = !noSidebarPaths.includes(location.pathname);

	return (
		<div className="flex h-screen">
			{showSidebar && <Sidebar />}
			<div className="flex-1">
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/profileCreation" element={<ProfileCreation />} />
					<Route path="/dashboard" element={<OverviewPage />} />
					<Route path="/dashboard/services" element={<ProductsPage />} />
					<Route path="/dashboard/addservices" element={<AddService />} />
					<Route path="/dashboard/bookings" element={<OrdersPage />} />
					<Route path="/dashboard/sales" element={<SalesPage />} />
					<Route path="/dashboard/profile" element={<ProfileSection />} />
					<Route path="/dashboard/notifications" element={<NotificationPage />} />
					<Route path="/dashboard/settings" element={<SettingsPage />} />
					<Route path="/dashboard/services/industrials-offering" element={<Industrialsofferings />} />
					<Route path="/dashboard/services/marketplace/industrial-machines" element={<IndustrailMachines />} />
					<Route path="/dashboard/services/marketplace/raw-materials" element={<RawMatrials />} />
					<Route path="/dashboard/services/marketplace/spare-parts" element={<SpareParts />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;

