import Header from "../dashboard/components/common/Header";
import ConnectedAccounts from "../dashboard/components/settings/ConnectedAccounts";
import Notifications from "../dashboard/components/settings/Notifications";
import Profile from "../dashboard/components/settings/Profile";
import Security from "../dashboard/components/settings/Security";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 '>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Notifications />
				<Security />
				<ConnectedAccounts />
			</main>
		</div>
	);
};
export default SettingsPage;
