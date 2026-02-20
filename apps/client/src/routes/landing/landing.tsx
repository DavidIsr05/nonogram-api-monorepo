import bigLogo from '../../assets/images/bigLogo.svg';

export const Landing = () => {
  return (
    <div className="bg-[#DA6DE4] h-screen w-screen relative">
      <img
        src={bigLogo}
        className="h-screen w-screen absolute z-0 right-[15vh]"
      />
      <div className="bg-[#F5E6FA] w-1/2  h-screen inset-y-0 right-0 absolute z-10 border-l-2 border-[#A90FB8]" />
    </div>
  );
};
