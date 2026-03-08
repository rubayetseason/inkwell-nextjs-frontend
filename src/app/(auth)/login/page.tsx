import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl -z-10" />

      <LoginForm />
    </div>
  );
}
