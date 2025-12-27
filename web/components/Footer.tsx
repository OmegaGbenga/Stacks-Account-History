import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-sm">© 2024 Stacks Account History. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
