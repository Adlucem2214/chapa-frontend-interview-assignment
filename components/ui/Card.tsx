import React from 'react';



interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
      className={`border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors duration-200 ${className}`}
      {...props}
    />
  );
};

export const CardHeader: React.FC<CardProps> = ({ className = '', ...props }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 border-b border-chapa-border-light dark:border-chapa-border-dark ${className}`} {...props} />;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...props }) => {
  return <h3 className={`text-lg font-semibold tracking-tight text-foreground ${className}`} {...props} />;
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => {
  return <p className={`text-sm text-chapa-slate dark:text-zinc-400 ${className}`} {...props} />;
};

export const CardContent: React.FC<CardProps> = ({ className = '', ...props }) => {
  return <div className={`p-6 ${className}`} {...props} />;
};

export const CardFooter: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    />
  );
};
