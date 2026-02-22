import { ExceptionType, UserSignInDto } from '@nonogram-api-monorepo/types';
import { useLazyLoginQuery } from '../../../store/api';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

export const LoginForm = () => {
  const [userSignInDto, setUserSignInDto] = useState<UserSignInDto>({
    personalNumber: 0,
    password: '',
  });

  const navigate = useNavigate();

  const [trigger, { data, isLoading, isSuccess, error }] = useLazyLoginQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await trigger(userSignInDto).unwrap();

      if (typeof result.access_token === 'string') {
        navigate('/home', { replace: true });
      }
    } catch (error) {
      const e = error as ExceptionType;
      toast(e.data.message.message); //TODO check what type of error happened and let user know. (validation error or wrong credentias)
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSignInDto((prev) => ({
      ...prev,
      [name]: name === 'personalNumber' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="flex flex-col w-1/2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[2.5rem] items-center"
      >
        <input
          value={userSignInDto.personalNumber}
          name="personalNumber"
          onChange={handleChange}
          type="number"
          placeholder="Personal Number:"
          className="rounded-lg border border-[#000000] w-2/3 h-9 p-3"
        />
        <input
          value={userSignInDto.password}
          name="password"
          onChange={handleChange}
          type="text"
          placeholder="Password:"
          className="rounded-lg border border-[#000000] w-2/3 h-9 p-3"
        />
        <button
          type="submit"
          className="bg-[#DA6DE4] w-1/4 h-9 border border-[#000000] rounded-lg"
        >
          Log In
        </button>
        <Link to="/signup">
          <button className="underline">Sign Up</button>
        </Link>
      </form>
      <Toaster />
    </div>
  );
};
