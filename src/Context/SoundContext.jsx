import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import clickSound from "../assets/sounds/click.wav";
import correctSound from "../assets/sounds/correctanswer.mp3";
import wrongSound from "../assets/sounds/wronganswer.mp3";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(
    JSON.parse(localStorage.getItem("soundEnabled")) ?? true
  );

  const clickAudioRef = useRef(new Audio(clickSound));
  const correctAudioRef = useRef(new Audio(correctSound));
  const wrongAudioRef = useRef(new Audio(wrongSound));

  // Save user preference
  useEffect(() => {
    localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // 🔊 Global click handler
  useEffect(() => {
    const handleClick = () => {
      if (soundEnabled) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [soundEnabled]);

  // Functions for other sounds
  const playCorrect = () => {
    if (soundEnabled) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play().catch(() => {});
    }
  };

  const playWrong = () => {
    if (soundEnabled) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        playCorrect,
        playWrong,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
