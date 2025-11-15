import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { useUser, type Gender } from "@/contexts/UserContext";

const Login = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!gender) {
      setError("Please select your gender");
      return;
    }

    setUser({ name, gender });
    navigate("/");
  };

  const isMale = gender === "male";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        gender === "male"
          ? "bg-gradient-to-br from-blue-50 to-cyan-50"
          : gender === "female"
          ? "bg-gradient-soft"
          : "bg-gradient-to-br from-slate-50 to-gray-100"
      }`}
    >
      <div className="w-full max-w-md">
        {/* Header - Unisex until gender selected */}
        <div className="text-center space-y-4 mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect shadow-soft transition-all duration-500 ${
              gender === "male" ? "bg-blue-500/10" : gender === "female" ? "bg-primary/10" : "bg-slate-200/50"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-colors duration-500 ${
                gender === "male" ? "text-blue-500" : gender === "female" ? "text-primary" : "text-slate-600"
              } animate-pulse`}
            />
            <span className="text-sm font-medium">Focus Board</span>
          </div>
          <h1
            className={`text-4xl font-bold transition-all duration-500 ${
              gender === "male"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                : gender === "female"
                ? "bg-gradient-primary bg-clip-text text-transparent"
                : "text-slate-800"
            }`}
          >
            Get Focused
          </h1>
          <p className="text-muted-foreground transition-all duration-500">
            {gender ? (isMale ? "Ready to crush it? 🚀" : "Let's make today amazing ✨") : "Let's get started 🎯"}
          </p>
        </div>

        {/* Form */}
        <div className="glass-effect p-8 rounded-3xl shadow-soft space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="glass-effect border-border/50 focus-visible:ring-primary"
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">I identify as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setGender("female");
                  setError("");
                }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  gender === "female"
                    ? "border-primary bg-primary/10 shadow-soft"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-2">👩</div>
                <div className="text-sm font-medium">Female</div>
              </button>

              <button
                onClick={() => {
                  setGender("male");
                  setError("");
                }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  gender === "male"
                    ? "border-blue-500 bg-blue-500/10 shadow-soft"
                    : "border-border hover:border-blue-500/50"
                }`}
              >
                <div className="text-2xl mb-2">👨</div>
                <div className="text-sm font-medium">Male</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleLogin}
            className={`w-full h-12 font-semibold text-base transition-all duration-500 shadow-glow ${
              isMale
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90"
                : "bg-gradient-primary hover:opacity-90"
            }`}
          >
            {gender ? (isMale ? "Let's Go" : "Get Started") : "Select Gender & Continue"}
          </Button>

          <p className="text-xs text-muted-foreground text-center transition-all duration-500">
            {gender ? (isMale ? "Time to dominate your goals 💪" : "You've got this 🌟") : "Choose to customize your experience"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
