export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="section-padding">
      <div className="section-container">
        {children}
      </div>
    </main>
  );
}
