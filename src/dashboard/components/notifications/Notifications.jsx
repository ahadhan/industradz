import { motion } from "framer-motion";

const notifications = [
	{ id: 1, message: "New user registered", date: "2024-11-27" },
	{ id: 2, message: "Server backup completed", date: "2024-11-26" },
	{ id: 3, message: "Password changed successfully", date: "2024-11-25" },
];

const Notifications = () => {
	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className="text-xl font-semibold text-gray-100 mb-4">Notifications</h2>
			<div className="space-y-4">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className="bg-gray-700 text-gray-200 rounded-lg p-4 flex justify-between items-center"
					>
						<span>{notification.message}</span>
						<span className="text-gray-400 text-sm">{notification.date}</span>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default Notifications;
