import React from 'react';

export function Footer() {
  return (
    <footer className="bg-black py-8 border-t border-neutral-900 text-center">
      <p className="text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Ruben O'Connor. All rights reserved.
      </p>
    </footer>
  );
}
