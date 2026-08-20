import { getEmployers } from "@/lib/queries/recruiters";
import { EmployersList } from "@/components/recruiters/RecruitersList";

export default async function RecruitersPage() {
  const employers = await getEmployers();
  return <EmployersList employers={employers} />;
}
