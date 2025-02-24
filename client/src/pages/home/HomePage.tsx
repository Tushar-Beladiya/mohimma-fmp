import { HomeWorkSpaceView } from "../../feature/home";

export const HomePage = () => {
  return (
    <div>
      <div className="relative h-screen w-full bg-[#374955]">
        <div className="absolute top-0 left-0 w-full h-60 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white">NextCloud</h1>
        </div>
        <HomeWorkSpaceView />
      </div>
    </div>
  );
};
