
import { useEffect } from "react";
import { motion } from "framer-motion";
import Scanner from "@/components/Scanner";

const ScannerPage = () => {
  useEffect(() => {
    // Reset any previous scan results when entering this page
    window.scrollTo(0, 0);
    console.log("ScannerPage mounted - Scanner should be visible"); // Debug log
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-16 px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-3 text-primary">
            Scan Your Food
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Capture a barcode or ingredient list to get personalized nutritional insights
          </p>
        </div>
        
        <Scanner />
      </motion.div>
    </div>
  );
};

export default ScannerPage;
