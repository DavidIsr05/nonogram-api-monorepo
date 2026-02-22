import bigLogo from '../../assets/images/bigLogo.svg';
import { LoginForm } from './components/login-form';

export const Landing = () => {
  return (
    <div className="bg-[#DA6DE4] h-screen w-screen relative">
      <img
        src={bigLogo}
        className="h-screen w-screen absolute z-0 right-[15vh]"
        alt=""
      />
      <div className="bg-[#F5E6FA] w-1/2  h-screen inset-y-0 right-0 absolute z-10 border-l-2 border-[#A90FB8] flex flex-col items-center  gap-[6rem]">
        <h1 className="text-[3rem] pt-[10rem]">Welcome to Pixelit!</h1>
        <LoginForm />
      </div>
    </div>
  );
};
