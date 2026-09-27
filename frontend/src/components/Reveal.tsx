import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay: 0.06 * i,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

type Props = {
  children: React.ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "span" | "li";
};

/** Scroll-triggered entrance reveal with a soft de-blur. */
export const Reveal = ({ children, i = 0, className, as = "div" }: Props) => {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      custom={i}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
    >
      {children}
    </Tag>
  );
};

/** Per-line masked headline reveal (Apple-style kinetic type). */
export const MaskedLines = ({
  lines,
  className,
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
}) => (
  <span className={className}>
    {lines.map((line, idx) => (
      <span className="ab-mask-line" key={idx}>
        <motion.span
          className="block"
          initial={{ y: "112%", rotate: 2, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          transition={{
            duration: 1.1,
            delay: delay + idx * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);
