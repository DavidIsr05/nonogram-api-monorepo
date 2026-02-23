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

    if (
      userSignInDto.password.trim() !== '' &&
      userSignInDto.personalNumber.trim() !== ''
    ) {
      try {
        const result = await loginQuery({
          personalNumber: parseInt(userSignInDto.personalNumber),
          password: userSignInDto.password, //TODO take a look for making better solution for this
        }).unwrap();

        if (typeof result.access_token === 'string') {
          navigate('/home', { replace: true });
        }
      } catch (error) {
        const e = error as ExceptionType;
        toast(e.data.message.message); //TODO check what type of error happened and let user know. (validation error or wrong credentias)
      }
    } else {
      toast.error('Fill out the form');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSignInDto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col w-1/2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[2.5rem] items-center"
      >
        <input
          value={userSignInDto ? userSignInDto.personalNumber : ''}
          name="personalNumber"
          onChange={handleChange}
          type="text"
          placeholder="Personal Number:"
          className="rounded-lg border border-[#000000] w-2/3 h-9 p-3"
          required
        />
        <input
          value={userSignInDto ? userSignInDto.password : ''}
          name="password"
          onChange={handleChange}
          type="text"
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
