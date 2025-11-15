import { Target } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const getDayGoals = (isMale: boolean) => {
  const day = new Date().getDay();
  
  const femaleGoals: Record<number, string[]> = {
    1: [ // Monday
      "Fresh start energy! Set your week's priorities 💪",
      "Break big tasks into smaller steps 📋",
      "Don't let Monday blues win - you've got this! ✨",
    ],
    2: [ // Tuesday
      "Build momentum from yesterday 🚀",
      "Tackle that challenging task you've been avoiding 💡",
      "Stay hydrated and energized ☕",
    ],
    3: [ // Wednesday
      "Midweek check-in - you're halfway there! 🎯",
      "Review progress and adjust if needed 📊",
      "Celebrate how far you've come this week 🌟",
    ],
    4: [ // Thursday
      "Almost Friday - keep the momentum going! 💫",
      "Finish strong, weekend is near 🎉",
      "Prep for tomorrow so you can relax ✅",
    ],
    5: [ // Friday
      "Finish the week on a high note! 🎊",
      "Wrap up loose ends before the weekend 📝",
      "Plan next week while it's fresh in mind 🗓️",
    ],
    6: [ // Saturday
      "Self-care Saturday - work at your pace 🌸",
      "Only urgent tasks today, rest is important 💝",
      "Balance productivity with relaxation 🧘‍♀️",
    ],
    0: [ // Sunday
      "Sunday prep for a smooth week ahead 📅",
      "Light planning, heavy relaxing 🌺",
      "Mental reset before the new week 🦋",
    ],
  };

  const maleGoals: Record<number, string[]> = {
    1: [ // Monday
      "New week, new wins! Crush those goals 💪",
      "Break big tasks into battle-sized chunks ⚔️",
      "Monday is your launchpad - let's go! 🚀",
    ],
    2: [ // Tuesday
      "Keep that momentum rolling, champ! 🔥",
      "Tackle that beast of a task head-on 💡",
      "Hydrate up and dominate 💧",
    ],
    3: [ // Wednesday
      "Halfway through the week - you're a machine! 🤖",
      "Check the playbook and adjust strategy 📊",
      "Celebrate the progress - you're on fire 🔥",
    ],
    4: [ // Thursday
      "Almost there, warrior! Push through! 💫",
      "Go hard now, chill this weekend 🎉",
      "Clear the deck for smooth sailing ✅",
    ],
    5: [ // Friday
      "Win the week! Finish line in sight! 🏁",
      "Clean up the battlefield before the weekend 📝",
      "Plan your next moves while the iron is hot 🔨",
    ],
    6: [ // Saturday
      "Chill mode activated - work at your pace 😎",
      "Only critical stuff - rest is fuel 🏋️",
      "Balance the grind with recovery 🧘",
    ],
    0: [ // Sunday
      "Game plan for the week ahead 🎮",
      "Light strategy, heavy recovery 💪",
      "Reset the mind before battle 🧠",
    ],
  };

  const goals = isMale ? maleGoals : femaleGoals;
  return goals[day] || goals[1];
};

export const DailyGoals = () => {
  const { user } = useUser();
  const isMale = user?.gender === "male";
  const goals = getDayGoals(isMale);
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="glass-effect p-6 rounded-3xl shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-lg">Daily Goals</h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium">{dayName}</span>
      </div>
      <ul className="space-y-3">
        {goals.map((goal, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-sm animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="h-2 w-2 rounded-full bg-gradient-primary" />
            <span>{goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
