import { ExternalLink } from "lucide-react";

import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useState } from "react";
import { Link } from "react-router";

const HeroSection = () => {
  const [division, setDivision] = useState<string>("");
  const { data: divisions, isLoading: divisionIsLoading } = useGetDivisionsQuery(null);

  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <Logo size="64" />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Explore the beauty of <span className="text-primary">Bangladesh</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia
                fugiat omnis! Porro facilis quo animi consequatur. Explicabo.
              </p>
            </div>
            <div className="mt-6 space-y-3 w-[350px]">
              <div>
                <Button asChild className="shadow-sm transition-shadow hover:shadow w-full">
                  <Link to="/tours">
                    Explore More Tours to Visit
                    <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-between gap-3">
                <Select onValueChange={setDivision} value={division} disabled={divisionIsLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Divisions</SelectLabel>
                      {divisions?.map((item: { name: string; _id: string }) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button variant={"outline"}>
                  <Link to={division ? `/tours?division=${division}` : "/tours"}>Search</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

/*









import { Calendar } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="z-10 mx-auto flex max-w-4xl flex-col items-center gap-14 text-center">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
            alt="logo"
            className="h-14"
          />
          <div>
            <h1 className="mb-4 text-3xl font-medium text-pretty lg:text-6xl">
              Build Exceptional Online Experiences
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Create a website that captures attention, drives engagement, and
              aligns with your goals, all in a matter of days.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row">
            <Button size="lg" className="w-full sm:w-fit">
              <Calendar className="mr-2 h-4" />
              Get Started Today
            </Button>
            <div className="flex flex-col items-center gap-2 lg:items-start">
              <span className="inline-flex items-center -space-x-1">
                <Avatar className="size-7 border">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-7 border">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-7 border">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-7 border">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp"
                    alt="placeholder"
                  />
                </Avatar>
              </span>
              <p className="text-xs text-muted-foreground">
                Trusted by industry leaders
              </p>
            </div>
          </div>
        </div>
        <img
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
          alt="placeholder"
          className="mx-auto mt-24 aspect-video max-h-[700px] w-full max-w-7xl rounded-t-lg object-cover shadow-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;


*/
