import { ExceptionType, UserSignInType } from '@nonogram-api-monorepo/types';
import { useLazyLoginQuery } from '../../../store/api';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../../store/slices';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ERROR_TEXT_BASED_ON_EXCEPTION } from '../../../constants';

export const LoginForm: React.FC = () => {
  const [userSignInDto, setUserSignInDto] = useState<UserSignInType>({
    personalNumber: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginQuery] = useLazyLoginQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userSignInDto.password.trim() !== '' && userSignInDto.personalNumber) {
      //TODO check that password gets stored/checked correctly
      try {
        const result = await loginQuery(userSignInDto).unwrap();

        if (typeof result.access_token === 'string') {
          dispatch(setUserId(result.userId));
          navigate('/home', { replace: true });
        }
      } catch (error) {
        const e = error as ExceptionType;

        if (ERROR_TEXT_BASED_ON_EXCEPTION[e.status]) {
          toast.error(ERROR_TEXT_BASED_ON_EXCEPTION[e.status]);
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
        className="flex flex-col gap-[2.5rem] items-center"
      >
        <input
          value={userSignInDto.personalNumber}
          name="personalNumber"
          onChange={handleChange}
          type="number"
          placeholder="Personal Number:"
          className="rounded-lg border border-absoluteBlack w-2/3 h-9 p-3"
          required
        />
        <input
          value={userSignInDto.password}
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password:"
          className="rounded-lg border border-absoluteBlack w-2/3 h-9 p-3"
          required
        />
        <button
          type="submit"
          className="bg-loginPagePurple w-1/4 h-9 border border-absoluteBlack rounded-lg"
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
