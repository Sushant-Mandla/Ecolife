import React, { useState } from "react";
import Lottie from "lottie-react";
import sdgLauncherIcon from "../assets/sdg/sdg_icon.svg";
import goal1Logo from "../assets/sdg/goals/goal_1.json";
import goal2Logo from "../assets/sdg/goals/goal_2.json";
import goal3Logo from "../assets/sdg/goals/goal_3.json";
import goal4Logo from "../assets/sdg/goals/goal_4.json";
import goal5Logo from "../assets/sdg/goals/goal_5.json";
import goal6Logo from "../assets/sdg/goals/goal_6.json";
import goal7Logo from "../assets/sdg/goals/goal_7.json";
import goal8Logo from "../assets/sdg/goals/goal_8.json";
import goal9Logo from "../assets/sdg/goals/goal_9.json";
import goal10Logo from "../assets/sdg/goals/goal_10.json";
import goal11Logo from "../assets/sdg/goals/goal_11.json";
import goal12Logo from "../assets/sdg/goals/goal_12.json";
import goal13Logo from "../assets/sdg/goals/goal_13.json";
import goal14Logo from "../assets/sdg/goals/goal_14.json";
import goal15Logo from "../assets/sdg/goals/goal_15.json";
import goal16Logo from "../assets/sdg/goals/goal_16.json";
import goal17Logo from "../assets/sdg/goals/goal_17.json";

const sustainableGoals = [
  {
    id: 1,
    logo: goal1Logo,
    short: "No Poverty",
    title: "No Poverty",
    description:
      "Support fair wages, local livelihoods, and community initiatives that help people meet basic needs with dignity.",
  },
  {
    id: 2,
    logo: goal2Logo,
    short: "Zero Hunger",
    title: "Zero Hunger",
    description:
      "Choose local food, reduce waste, and support regenerative farming to help build resilient food systems.",
  },
  {
    id: 3,
    logo: goal3Logo,
    short: "Good Health",
    title: "Good Health and Well-being",
    description:
      "Promote cleaner air, active mobility, and healthier homes that improve physical and mental well-being.",
  },
  {
    id: 4,
    logo: goal4Logo,
    short: "Quality Education",
    title: "Quality Education",
    description:
      "Share sustainability knowledge, practical skills, and accessible tools so more people can take climate action.",
  },
  {
    id: 5,
    logo: goal5Logo,
    short: "Gender Equality",
    title: "Gender Equality",
    description:
      "Encourage equal opportunities and representation in climate leadership, policy, and community decision-making.",
  },
  {
    id: 6,
    logo: goal6Logo,
    short: "Clean Water",
    title: "Clean Water and Sanitation",
    description:
      "Conserve water, prevent contamination, and promote safe sanitation habits in homes and neighborhoods.",
  },
  {
    id: 7,
    logo: goal7Logo,
    short: "Clean Energy",
    title: "Affordable and Clean Energy",
    description:
      "Adopt efficient appliances, smart usage habits, and renewable energy options whenever possible.",
  },
  {
    id: 8,
    logo: goal8Logo,
    short: "Decent Work",
    title: "Decent Work and Economic Growth",
    description:
      "Support green jobs, ethical businesses, and innovation that creates prosperity without harming ecosystems.",
  },
  {
    id: 9,
    logo: goal9Logo,
    short: "Innovation",
    title: "Industry, Innovation and Infrastructure",
    description:
      "Promote low-carbon technologies, durable infrastructure, and circular systems that reduce resource use.",
  },
  {
    id: 10,
    logo: goal10Logo,
    short: "Reduced Inequality",
    title: "Reduced Inequalities",
    description:
      "Ensure sustainability solutions are inclusive, affordable, and accessible across communities.",
  },
  {
    id: 11,
    logo: goal11Logo,
    short: "Sustainable Cities",
    title: "Sustainable Cities and Communities",
    description:
      "Encourage public transport, green spaces, efficient buildings, and resilient neighborhood design.",
  },
  {
    id: 12,
    logo: goal12Logo,
    short: "Responsible Consumption",
    title: "Responsible Consumption and Production",
    description:
      "Buy less, choose durable products, repair often, and recycle correctly to lower environmental impact.",
  },
  {
    id: 13,
    logo: goal13Logo,
    short: "Climate Action",
    title: "Climate Action",
    description:
      "Track carbon emissions, cut fossil fuel dependency, and support climate policies that drive rapid change.",
  },
  {
    id: 14,
    logo: goal14Logo,
    short: "Life Below Water",
    title: "Life Below Water",
    description:
      "Reduce plastic leakage, protect waterways, and support sustainable seafood and marine conservation.",
  },
  {
    id: 15,
    logo: goal15Logo,
    short: "Life on Land",
    title: "Life on Land",
    description:
      "Protect forests, biodiversity, and soil health through responsible land use and restoration efforts.",
  },
  {
    id: 16,
    logo: goal16Logo,
    short: "Peace & Justice",
    title: "Peace, Justice and Strong Institutions",
    description:
      "Support transparent governance and community trust that make long-term sustainability possible.",
  },
  {
    id: 17,
    logo: goal17Logo,
    short: "Partnerships",
    title: "Partnerships for the Goals",
    description:
      "Collaborate across communities, organizations, and governments to scale practical climate solutions.",
  },
];

const SustainableGoalsWheel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(13);

  const selectedGoal =
    sustainableGoals.find((goal) => goal.id === selectedGoalId) ||
    sustainableGoals[0];

  return (
    <section className="max-w-6xl mx-auto mb-16 rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-6 md:p-10 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900">
          Sustainable Development Goals
        </h2>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="goals-launch-icon flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-700 bg-white shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-expanded={isOpen}
          aria-label="Open sustainable living goals"
        >
          <img
            src={sdgLauncherIcon}
            alt="Sustainable Development Goals"
            className="h-12 w-12 object-contain"
          />
        </button>
      </div>

      {isOpen && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr,1fr] items-center">
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-green-200 bg-white/75 p-6 shadow-xl backdrop-blur-sm">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-center text-sm font-semibold uppercase tracking-wider text-emerald-700">
                  Goal {selectedGoal.id}
                </p>
                <p className="mt-1 text-center text-lg font-bold text-green-900">
                  {selectedGoal.short}
                </p>
                <div className="mx-auto mt-4 h-56 w-56">
                  <Lottie
                    animationData={selectedGoal.logo}
                    loop={false}
                    autoplay={true}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-green-100">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Selected Goal
              </p>
              <h3 className="mt-2 text-2xl font-bold text-green-900">
                {selectedGoal.id}. {selectedGoal.title}
              </h3>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {selectedGoal.description}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sustainableGoals.map((goal, index) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`goal-chip reveal-goal rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200 ${
                    selectedGoalId === goal.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-green-100 bg-white hover:border-emerald-300"
                  }`}
                  style={{ animationDelay: `${index * 70}ms` }}
                  aria-label={`Show logo for Goal ${goal.id}`}
                >
                  Goal {goal.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SustainableGoalsWheel;
