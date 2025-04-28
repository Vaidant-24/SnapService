import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Company Info */}
        <h3 className="text-xl font-bold mb-2">SnapService</h3>
        <p className="text-gray-300 mb-4">
          Connecting homeowners with trusted professionals for all your home
          service needs.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-center">
          &copy; {new Date().getFullYear()} SnapService. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
