import { useState } from "react";

const CategoryDropdown = ({ selectedCategory, setSelectedCategory }) => {
	const categories = [
		"Industrial offereings",
		"Maket place"
	];

	const [isOpen, setIsOpen] = useState(false);

	const handleCategorySelect = (category) => {
		setSelectedCategory(category);
		setIsOpen(false);
	};

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className='w-full border rounded-lg px-4 py-2 text-left focus:ring-2 focus:ring-blue-500'
			>
				{selectedCategory || "Select Category"}
			</button>
			{isOpen && (
				<ul className='absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10'>
					{categories.map((category, index) => (
						<li
							key={index}
							onClick={() => handleCategorySelect(category)}
							className='px-4 py-2 cursor-pointer hover:bg-gray-200'
						>
							{category}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CategoryDropdown;
