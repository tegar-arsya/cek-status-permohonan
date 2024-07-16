// components/Navbar.tsx

'use client';

const Navbar = () => {
  return (
    <nav className="bg-red-600 p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between md:flex-nowrap">
        <div className="flex items-center text-centery">
          <h1 className="text-xl font-bold text-white md:text-2xl">Cek Status Permohonan Informasi Publik</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

