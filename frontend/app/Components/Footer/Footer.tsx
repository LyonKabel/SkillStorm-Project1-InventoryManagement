// components/Footer.tsx
"use client";

import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-indigo-100 text-indigo-700 py-6 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
            
            <p className="text-sm mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} My Inventory App. All rights reserved.
            </p>

            
            <div className="flex gap-4 items-center">
            <a
                href="https://www.instagram.com/skillstormer"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-900 transition text-xl"
            >
                <FaInstagram />
            </a>
            <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-900 transition text-xl"
            >
                <FaFacebook />
            </a>
            <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-900 transition text-xl"
            >
                <FaTwitter />
            </a>
            <a
                href="https://www.skillstorm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-900 transition text-sm ml-2"
            >
                SkillStorm
            </a>
            </div>
        </div>
        </footer>
    );
}
