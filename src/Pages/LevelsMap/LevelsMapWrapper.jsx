import { useParams } from "react-router-dom";
import { LevelsProvider } from "./Context/LevelsContext";
import LevelsMap from "./LevelsMap";

const LevelsMapWrapper = () => {
  const { subjectId } = useParams();
  return (
    <LevelsProvider subjectId={subjectId}>
      <LevelsMap />
    </LevelsProvider>
  );
};

export default LevelsMapWrapper;
