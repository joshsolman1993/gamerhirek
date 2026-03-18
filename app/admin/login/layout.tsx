// Login page has its own standalone layout — no admin sidebar needed
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
