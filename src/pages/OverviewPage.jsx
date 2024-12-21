import {GlobeIcon, BarChart2, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../dashboard/components/common/Header";
import StatCard from "../dashboard/components/common/StatCard";
import SalesOverviewChart from "../dashboard/components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../dashboard/components/overview/CategoryDistributionChart";
import SalesChannelChart from "../dashboard/components/overview/SalesChannelChart";

const OverviewPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Earnings' icon={Zap} value='$12,345' color='#6366F1' />
					<StatCard name='New Bookings' icon={Users} value='1,234' color='#8B5CF6' />
					<StatCard name='Pending Earnings' icon={BarChart2} value='12.5%' color='#10B981' />
					<StatCard name='New Locations' icon={GlobeIcon} value='20%' color='#10B981' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
