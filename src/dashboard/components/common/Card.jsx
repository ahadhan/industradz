import React from "react";

const Card = ({
  title = "Card Title", // Optional title
  value, // Optional value for metrics or stats
  icon, // Optional icon component
  actionText, // Optional button text for an action
  onActionClick, // Optional callback for button clicks
  description, // Optional description or additional content
  footer, // Optional footer content
  bgColor = "bg-white", // Background color of the card
  textColor = "text-black", // Text color
  borderColor = "border-gray-300", // Border color
}) => {
  return (
    <div
      className={`p-4 shadow-md rounded-lg border ${bgColor} ${borderColor} flex flex-col items-start justify-between`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center">
          {icon && (
            <span className="p-2 rounded-full bg-gray-100 text-gray-600 mr-3">
              {icon}
            </span>
          )}
          <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
        </div>
        {actionText && (
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg"
            onClick={onActionClick}
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Card Value or Description */}
      {value && (
        <p className={`text-2xl font-bold mb-2 ${textColor}`}>{value}</p>
      )}
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      {/* Footer */}
      {footer && <div className="mt-auto w-full">{footer}</div>}
    </div>
  );
};

export default Card;
