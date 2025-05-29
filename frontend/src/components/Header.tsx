import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-[#e6f4ff] shadow-md py-4 px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Logo Galactus"
            className="h-10 w-10 object-contain rounded-full border border-white shadow"
          />
          <h1 className="text-2xl font-bold text-[#228be6]">Stock Control</h1>
        </div>
        <nav className="space-x-6 text-[#0c4a6e] font-medium hidden sm:block">
         
          
        </nav>
      </div>
    </motion.header>
  );
}
