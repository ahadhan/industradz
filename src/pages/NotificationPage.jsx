import { motion } from "framer-motion";
const dummyNotifications = [
  { id: 1, message: "You have a new message from John Doe", time: "2 minutes ago" },
  { id: 2, message: "Your profile was viewed by Jane Smith", time: "15 minutes ago" },
  { id: 3, message: "Bob Johnson booked a service", time: "1 hour ago" },
  { id: 4, message: "Alice Brown sent a booking order", time: "3 hours ago" },
  { id: 5, message: "Charlie Wilson liked your services", time: "5 hours ago" },
];

const NotificationPage = () => {
  const notifications = dummyNotifications;

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <motion.div
        className="w-full max-w-screen-lg  bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        
        {/* Notifications Table */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <motion.tr
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {notification.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {notification.time}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPage;
