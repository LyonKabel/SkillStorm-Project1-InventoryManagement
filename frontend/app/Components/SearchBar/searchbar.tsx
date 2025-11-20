"use client";

import { FC } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange, placeholder = "Search..." }) => {
    return (
        <div className="flex items-center bg-white rounded-lg shadow-md px-4 py-2 w-full max-w-md">
        <FiSearch className="text-gray-400 mr-2" size={20} />
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
        />
        </div>
    );
};

export default SearchBar;
