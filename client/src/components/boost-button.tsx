import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

/**
 * BoostButton Component
 * Main action button for triggering AI-powered device optimization
 * Features:
 * - Animated feedback during optimization
 * - Success/error toast notifications
 * - Motion effects for better user interaction
 */
export function BoostButton() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  // Mutation for handling optimization requests
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/optimize");
      return res.json();
    },
    onSuccess: (data) => {
      // Show success toast with animation
      toast({
        title: "AI Optimization Complete",
        description: `${data.type}: Performance improved by ${data.impact}%. Actions taken: ${data.actions.join(", ")}`,
        className: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20",
      });
      setIsOptimizing(false);
    },
    onError: () => {
      // Show error toast with animation
      toast({
        title: "Optimization Failed",
        description: "Please try again later",
        variant: "destructive",
        className: "bg-gradient-to-r from-red-500/10 to-rose-500/10",
      });
      setIsOptimizing(false);
    },
  });

  const handleBoost = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  return (
    <AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <Button
          size="lg"
          className={`
            w-full h-16 text-lg font-bold
            bg-gradient-to-r from-primary/90 to-primary
            hover:from-primary hover:to-primary/90
            transition-all duration-300
            ${isOptimizing ? 'animate-pulse' : ''}
          `}
          onClick={handleBoost}
          disabled={isOptimizing}
        >
          <motion.div
            initial={false}
            animate={isOptimizing ? {
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="mr-2 h-6 w-6" />
          </motion.div>
          {isOptimizing ? "AI Optimizing..." : "AI-Powered Boost"}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}