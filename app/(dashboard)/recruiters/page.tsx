import { getRecruiters } from "@/lib/queries/recruiters";
import { RecruitersList } from "@/components/recruiters/RecruitersList";

export default async function RecruitersPage() {
  const recruiters = await getRecruiters();
  return <RecruitersList recruiters={recruiters} />;
}
