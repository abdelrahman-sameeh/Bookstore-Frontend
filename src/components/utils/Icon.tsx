import { Icon as Ic } from "@iconify/react";

type iconProps = {
  icon: string;
  style?: React.CSSProperties;
  className?: string
};

const Icon = ({ icon, style, className }: iconProps) => {
  return <Ic icon={icon} style={style} className={className} />;
};

export default Icon;
