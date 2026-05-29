import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LeadForm from '../LeadForm';

// 1. Define the separate animation configurations
const modalVariants = {
  // --- MOBILE CONFIG (Swoop & Rotate) ---
  mobileInitial: { 
    opacity: 0, 
    x: "100vw", 
    y: -60, 
    rotate: -12 
  },
  mobileAnimate: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotate: 0,
    transition: { type: "spring", damping: 14, stiffness: 75 }
  },
  mobileExit: { 
    opacity: 0, 
    x: "100vw", 
    y: -60, 
    rotate: -12, 
    transition: { duration: 0.3, ease: "easeInOut" } 
  },

  // --- DESKTOP CONFIG (Standard Fade & Scale) ---
  desktopInitial: { 
    opacity: 0, 
    scale: 0.95,
    y: 0,
    x: 0,
    rotate: 0
  },
  desktopAnimate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  desktopExit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

export default function VIPForm({
    vipModal,
    setVipModal
}: {
    vipModal: boolean;
    setVipModal: (value: boolean) => void;
}) {
  // 2. Check if the screen is under 500px
  const isMobile = useMediaQuery('(max-width: 500px)');

  return (
    <AnimatePresence>
      {vipModal && (
        /* Full-screen overlay wrapper */
        <motion.div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden"
          onClick={() => setVipModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* The Modal Box itself */}
          <motion.div 
            className="flex flex-col gap-6 sm:gap-3 w-full max-w-md max-h-[90vh] bg-white p-6 md:p-8 rounded-lg sm:rounded-xl shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()} 
            
            // 3. Conditionally apply transform origin
            style={{ transformOrigin: isMobile ? "bottom right" : "center" }} 
            
            // 4. Connect the variants and conditionally switch paths
            variants={modalVariants}
            initial={isMobile ? "mobileInitial" : "desktopInitial"}
            animate={isMobile ? "mobileAnimate" : "desktopAnimate"}
            exit={isMobile ? "mobileExit" : "desktopExit"}
          >
            <h3 className="text-center text-xl font-bold uppercase tracking-widest mb-4">
              Request VIP Access
            </h3>
            
            <LeadForm
              fields={['f_name', 'l_name', 'email', 'phone', 'city', 'dob', 'total_guests']}
              formType="vip_table_request"
              buttonText="Become a VIP"
            />

            <p 
              onClick={() => setVipModal(false)}
              className="text-gray-400 text-sm font-inter font-[600] tracking-widest text-center cursor-pointer hover:text-gray-500 w-24 self-center mt-2"
            >
              Later
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}