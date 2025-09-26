import React from "react";
import Hero from "@/app/components/Home/Hero";
import Companies from "@/app/components/Home/Companies";
import Courses from "@/app/components/Home/Courses";
import Mentor from "@/app/components/Home/Mentor";
import Testimonial from "@/app/components/Home/Testimonials";
import Calendar from "@/app/components/Home/Calendar";
import ContactForm from "@/app/components/ContactForm";
import Newsletter from "@/app/components/Home/Newsletter";
import Benefits from "@/app/components/Home/Benefits";
import Pricing from "@/app/components/Home/Pricing";
import FAQ from "@/app/components/Home/FAQ";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GROUPE EST FORMATION",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Companies />
      <Courses />
    <Mentor />
    <Calendar />
    <Testimonial />
  <Benefits />
  <Pricing />
  <FAQ />
  <ContactForm/>
  <Newsletter />
    </main>
  );
}