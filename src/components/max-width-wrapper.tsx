interface MaxWidthWrapperProps {
  children: React.ReactNode;
  heading?: string;
}

const MaxWidthWrapper = ({ children, heading }: MaxWidthWrapperProps) => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-68px)] max-w-7xl flex-col p-5 md:min-h-[calc(100vh-80px)] md:p-10">
      {heading && (
        <h1 className="text-4xl font-bold tracking-tight">{heading}</h1>
      )}

      {children}
    </div>
  );
};

export default MaxWidthWrapper;
