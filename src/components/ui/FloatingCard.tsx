import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FloatingCard({ children, delay = 0, className = '' }: FloatingCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur-xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
        {children}
      </div>
    </motion.div>
  );
}