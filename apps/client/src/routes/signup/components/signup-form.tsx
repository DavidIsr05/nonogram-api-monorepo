import { CreateUserType, ExceptionType } from '@nonogram-api-monorepo/types';
import { useLazySignupQuery } from '../../../store/api';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { HTTP_ERROR_MESSAGES } from '../../../constants';

export const SignupForm: React.FC = () => {
  const [userSignupDto, setUserSignupDto] = useState<CreateUserType>({
    username: '',
    password: '',
    personalNumber: null,
  });

  const navigate = useNavigate();

  const [signupQuery] = useLazySignupQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userSignupDto.password.trim() !== '' && userSignupDto.personalNumber) {
      try {
        const result = await signupQuery(userSignupDto).unwrap();

        if (result) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        const e = error as ExceptionType;

        if (HTTP_ERROR_MESSAGES[e.status]) {
          toast.error(HTTP_ERROR_MESSAGES[e.status]);
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
    setUserSignupDto((prev) => ({
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
          value={
            userSignupDto.personalNumber ? userSignupDto.personalNumber : ''
          }
          name="personalNumber"
          onChange={handleChange}
          type="number"
          placeholder="Personal Number:"
          className="rounded-lg border border-absoluteBlack w-2/3 h-9 p-3"
          required
        />
        <input
          value={userSignupDto.username}
          name="username"
          onChange={handleChange}
          type="text"
          placeholder="Username:"
          className="rounded-lg border border-absoluteBlack w-2/3 h-9 p-3"
          required
        />
        <input
          value={userSignupDto.password}
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password:"
          className="rounded-lg border border-absoluteBlack w-2/3 h-9 p-3"
          required
        />
        <button
          type="submit"
          className="bg-signupPageOrange w-1/4 h-9 border border-absoluteBlack rounded-lg"
        >
          Sign up
        </button>
        <Link to="/">
          <button className="underline">Log in</button>
        </Link>
      </form>
    </div>
  );
};
