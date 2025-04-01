import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4 px-6 md:px-12 bg-transparent">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <span className="text-orange-500 text-2xl">🏠</span>
        <span>SnapService</span>
      </Link>

      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition"
        >
          Login
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          Register
        </Link>
      </div>
    </header>
  );
};

export default Header;
