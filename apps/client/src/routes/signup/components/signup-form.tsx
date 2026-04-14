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
  const [showPassword, setShowPassword] = useState(false);

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
        className="flex flex-col gap-[2rem] md:gap-[3rem] items-center"
      >
        <div className="flex flex-col w-full sm:w-2/3 h-9">
          <label>Personal Number:</label>
          <input
            value={
              userSignupDto.personalNumber ? userSignupDto.personalNumber : ''
            }
            name="personalNumber"
            onChange={handleChange}
            type="number"
            placeholder="1234567"
            className="rounded-lg border border-absoluteBlack w-full h-9 p-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
        </div>
        <div className="flex flex-col w-full sm:w-2/3 h-9">
          <label>Username:</label>
          <input
            value={userSignupDto.username}
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="ProGamer2005"
            className="rounded-lg border border-absoluteBlack w-full h-9 p-3"
            required
          />
        </div>
        <div className="flex flex-col w-full sm:w-2/3 h-9">
          <label>Password:</label>
          <div className="relative w-full">
            <input
              value={userSignupDto.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="pasvord123"
              className="rounded-lg border border-absoluteBlack w-full h-9 p-3 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-lg disabled:cursor-not-allowed"
              disabled={!userSignupDto.password}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-signupPageOrange w-1/2 sm:w-1/4 h-9 border border-absoluteBlack rounded-lg hover:scale-105 active:scale-95 transition-transform"
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
