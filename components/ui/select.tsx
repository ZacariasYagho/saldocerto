export const Select: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
}

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  return (
    <span>
      {children}
    </span>
  );
}

export const SelectTrigger: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children, ...props }) => {
  return (
    <button {...props}>
      {children}
    </button>
  );
}

export const SelectValue: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
}
