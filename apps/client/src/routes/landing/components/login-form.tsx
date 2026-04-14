import { ExceptionType, UserSignInType } from '@nonogram-api-monorepo/types';
import { useLazyLoginQuery } from '../../../store/api';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../../store/slices';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { HTTP_ERROR_MESSAGES } from '../../../constants';

export const LoginForm: React.FC = () => {
  const [userSignInDto, setUserSignInDto] = useState<UserSignInType>({
    personalNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginQuery] = useLazyLoginQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userSignInDto.password.trim() !== '' && userSignInDto.personalNumber) {
      try {
        const result = await loginQuery(userSignInDto).unwrap();

        if (typeof result.access_token === 'string') {
          dispatch(setUserId(result.userId));
          navigate('/home', { replace: true });
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
    setUserSignInDto((prev) => ({
      ...prev,
      [name]: name === 'personalNumber' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="flex flex-col w-1/2 h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[3rem] items-center"
      >
        <div className="w-full sm:w-2/3 h-9 flex flex-col">
          <label>Personal Number:</label>
          <input
            value={userSignInDto.personalNumber}
            name="personalNumber"
            onChange={handleChange}
            type="number"
            placeholder="1234567"
            className="rounded-lg border border-absoluteBlack w-full h-9 p-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
        </div>
        <div className="flex flex-col w-full sm:w-2/3 h-9">
          <label>Password:</label>
          <div className="relative w-full">
            <input
              value={userSignInDto.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="StrongPassword123!"
              className="rounded-lg border border-absoluteBlack w-full h-9 p-3 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-lg disabled:cursor-not-allowed"
              disabled={!userSignInDto.password}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-loginPagePurple w-1/2 sm:w-1/4 h-9 border border-absoluteBlack rounded-lg hover:scale-105 active:scale-95 transition-transform"
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
