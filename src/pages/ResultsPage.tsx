
import { useEffect } from "react";
import { motion } from "framer-motion";
import Results from "@/components/Results";

const ResultsPage = () => {
  useEffect(() => {
    // Scroll to top when this page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Scan Results
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Analysis of your scanned product based on your health profile and preferences
          </p>
        </div>
        
        <Results />
      </motion.div>
    </div>
  );
};

export default ResultsPage;
