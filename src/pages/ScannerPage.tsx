
import { useEffect } from "react";
import { motion } from "framer-motion";
import Scanner from "@/components/Scanner";

const ScannerPage = () => {
  useEffect(() => {
    // Reset any previous scan results when entering this page
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto w-full"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Scan Your Food
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Capture a barcode or ingredient list to get personalized nutritional insights based on your health profile
          </p>
        </div>
        
        <Scanner />
      </motion.div>
    </div>
  );
};

export default ScannerPage;
