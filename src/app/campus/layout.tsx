import { CampusShell } from "@/components/CampusShell";
import { FocusModeProvider } from "@/components/FocusMode";

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FocusModeProvider>
      <CampusShell>{children}</CampusShell>
    </FocusModeProvider>
  );
}
