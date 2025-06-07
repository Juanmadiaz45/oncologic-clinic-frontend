interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContainer = ({
  children,
  className = '',
}: CardContainerProps) => (
  <div
    className={`bg-white rounded-xl shadow-card border border-gray-200 p-8 ${className}`}
  >
    {children}
  </div>
);
