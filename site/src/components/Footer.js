// src/components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-8 px-4 border-t border-gray-800">
      <div className="container mx-auto text-center flex flex-col items-center">
        {/* Logo and Copyright */}
        <Link
          href="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-lg"
        >
          EcoWipe
        </Link>
        <p className="mt-2 text-sm">
          &copy; {new Date().getFullYear()} EcoWipe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


// src/components/Footer.js
// import Link from 'next/link';

// export default function Footer() {
//   return (
//     <footer className="bg-black text-gray-400 py-8 px-4 border-t border-gray-800">
//       <div className="container mx-auto text-center md:flex md:justify-between md:items-center">
//         {/* Logo and Copyright */}
//         <div className="mb-4 md:mb-0">
//           <Link
//             href="/"
//             className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-lg"
//           >
//             EcoWipe
//           </Link>
//           <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} EcoWipe. All rights reserved.</p>
//         </div>

//         {/* Footer Links */}
//         <div className="flex flex-wrap justify-center md:justify-end space-x-4">
//           <Link
//             href="/docs"
//             className="hover:text-orange-500 transition-colors duration-300"
//           >
//             Documentation
//           </Link>
//           <Link
//             href="/downloads"
//             className="hover:text-orange-500 transition-colors duration-300"
//           >
//             Downloads
//           </Link>
//           <Link
//             href="/verify-certificate"
//             className="hover:text-orange-500 transition-colors duration-300"
//           >
//             Verify Certificate
//           </Link>
//           {/* Add more links as needed, e.g., Privacy Policy, Contact */}
//         </div>
//       </div>
//     </footer>
//   );
// }