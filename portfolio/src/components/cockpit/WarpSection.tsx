import { motion } from "framer-motion";
import { useSharedWorldState } from "../../three/world/WorldStateProvider";

interface WarpSectionProps {
  children: React.ReactNode;
}

/**
 * WarpSection
 *
 * Wraps a scroll section with a "warp-in" reveal: it drops from depth with a
 * mild scale + perspective tilt the first time it enters the viewport, so
 * each section feels like a new star system the shuttle just arrived at.
 * Honours prefers-reduced-motion.
 */
export default function WarpSection({ children }: WarpSectionProps) {
  const world = useSharedWorldState();
  const reduced = world.isReducedMotion || world.capabilityTier === "low";

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: 6, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}
