import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="container-narrow py-12 flex justify-center">
      <SignIn routing="hash" signUpUrl="/sign-up" />
    </div>
  );
}