import React from 'react';

// Define the types for the props this component will receive
interface RoomCategoryCardProps {
  name: string;
  image: string;
}

const RoomCategoryCard = ({ name, image }: RoomCategoryCardProps) => {
  return (
    <div className="flex flex-col cursor-pointer group">
      <img
        src={image}
        alt={name}
        className="w-full h-80 object-cover" // Image styling
      />
      <div className="flex items-center justify-between mt-3">
        <p className="font-semibold text-gray-800">{name}</p>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr; {/* Right arrow character */}
        </span>
      </div>
    </div>
  );
};

export default RoomCategoryCard;