const Header = ({ title }) => {
	return (
		<header className=' backdrop-blur-md shadow-lg'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				<h1 className='text-2xl font-semibold '>{title}</h1>
			</div>
		</header>
	);
};
export default Header;
