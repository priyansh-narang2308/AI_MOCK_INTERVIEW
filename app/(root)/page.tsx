import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
  <>
    <section className="card-cta">
      <div className="flex flex-col gap-6 max-w-lg">
          <h2>Refine Your Interview Performance with Smart AI Coaching</h2>
        <p className="text-lg">
            Practice with real interview questions and receive instant, AI-powered feedback.
        </p>
        <Button asChild className="btn-primary max-sm:w-full">
          <Link href={"/interview"}>Ace an Interview</Link>
        </Button>
      </div>
      <Image src="/robot.png" alt="robt" width={400} height={400} className="max-sm:hidden" />
    </section>


{/* for my own intevriews */}
    <section className="flex flex-col gap-6 mt-9">
<h2>Your Interviews</h2>



<div className="interviews-section">
  {dummyInterviews.map((interview,index)=>(
    <InterviewCard  key={index} {...interview} />
  ))}
</div>
    </section>
  

  {/* for taking an interview */}
    <section className="flex flex-col gap-6 mt-8">
      <h2>Take an Interview</h2>
      <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
          {/* <p>You havnt taken any intevriws</p> for safe side */}
      </div>
    </section>

  </>
  );
}
