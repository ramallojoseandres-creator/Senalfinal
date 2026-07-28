import { CampusShell } from "@/components/CampusShell";

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CampusShell>{children}</CampusShell>;
}
