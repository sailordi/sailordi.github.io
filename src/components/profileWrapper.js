import { useNavigate } from "react-router-dom";
import ProfilePage from "./profile";

function ProfilePageWrapper() {
  const navigate = useNavigate();

  return (
    <div>
      <ProfilePage navigate={navigate} />
    </div>
  );
}

export default ProfilePageWrapper;