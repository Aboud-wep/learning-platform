// src/Pages/Achievements/AchievementsPage.jsx
import React from "react";
import { useHome } from "../Home/Context/HomeContext";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import { useSubjects } from "../Subjects/Context/SubjectsContext";

const AchievementCard = ({ achievement }) => {
  return (
    <div className="p-4 border rounded-lg shadow mb-3">
      <h3 className="font-bold text-lg">{achievement.name}</h3>
      <p>{achievement.description}</p>
      <p>XP: {achievement.xp_reward}</p>
      <p>Coins: {achievement.coins_reward}</p>
    </div>
  );
};

const AchievementsPage = () => {
  const { profile } = useHome();
  const { mySubjects } = useSubjects();

  const achievements = profile?.achievements || [];

  if (!achievements.length)
    return <p className="text-center mt-10">لا توجد إنجازات بعد.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">إنجازاتي</h2>

      <ProfileStatsCard
        profile={profile}
        mySubjects={mySubjects}
        showAchievements={false}
      />
    </div>
  );
};

export default AchievementsPage;
