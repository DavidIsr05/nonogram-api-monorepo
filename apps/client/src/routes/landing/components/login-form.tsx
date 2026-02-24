import { ExceptionType, UserSignInDto } from '@nonogram-api-monorepo/types';
import { useLazyLoginQuery } from '../../../store/api';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const [userSignInDto, setUserSignInDto] = useState<UserSignInDto>({
    personalNumber: '',
    password: '',
  });

  const navigate = useNavigate();

  const [loginQuery] = useLazyLoginQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userSignInDto.password.trim() !== '' && userSignInDto.personalNumber) {
      try {
        const result = await loginQuery(userSignInDto).unwrap();

        if (typeof result.access_token === 'string') {
          navigate('/home', { replace: true });
        }
      } catch (error) {
        const e = error as ExceptionType;

        console.log(e);

        if (e.status === 400) {
          toast.error('Validation error');
        } else if (e.status === 401) {
          toast.error('Wrong credentials');
        } else if (e.status === 404) {
          toast.error('User with that personal number does not exist');
        } else if (e.status === 'FETCH_ERROR') {
          toast.error('Could not fetch data from API');
        } else {
          toast.error('error');
        }
      }
    } else {
      toast.error('Fill out the form');
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
          required
        />
        <input
          value={userSignInDto.password}
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password:"
          className="rounded-lg border border-[#000000] w-2/3 h-9 p-3"
          required
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
    </div>
  );
};
