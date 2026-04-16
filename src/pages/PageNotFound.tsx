import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6">
      <div className="text-center max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-8xl md:text-9xl font-extrabold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-2xl md:text-3xl font-semibold"
        >
          Oops! Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-gray-300"
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition shadow-lg"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-2xl border border-gray-600 hover:bg-gray-800 transition cursor-pointer"
          >
            Go Back
          </button>
        </motion.div>

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="w-500px h-500px bg-purple-600 opacity-20 blur-3xl rounded-full absolute top-10 left-1/2 -translate-x-1/2" />
          <div className="w-400px h-400px bg-indigo-600 opacity-20 blur-3xl rounded-full absolute bottom-10 left-1/3" />
        </div>
      </div>
    </div>
  );
}
