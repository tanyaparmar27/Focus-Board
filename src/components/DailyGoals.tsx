import { Target } from "lucide-react";

const getDayGoals = () => {
  const day = new Date().getDay();
  
  const goalsByDay: Record<number, string[]> = {
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

  return goalsByDay[day] || goalsByDay[1];
};

export const DailyGoals = () => {
  const goals = getDayGoals();
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
