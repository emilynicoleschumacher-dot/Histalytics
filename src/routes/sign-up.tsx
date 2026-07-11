import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="container-narrow py-12 flex justify-center">
      <SignUp routing="hash" signInUrl="/sign-in" />
    </div>
  );
}