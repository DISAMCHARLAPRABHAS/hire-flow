import RecruiterProfileForm from "@/components/recruiter-profile-form";

export default function RecruiterProfilePage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">My Profile</h1>
            </div>
            <RecruiterProfileForm />
        </>
    );
}
